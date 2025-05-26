// src/app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createWPSClient } from '@/lib/api/wps-client';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const client = createWPSClient();

        // Get query parameters
        const query = searchParams.get('q');
        const pageSize = parseInt(searchParams.get('page[size]') || '20');
        const cursor = searchParams.get('cursor');
        const include = searchParams.get('include') || 'product,items,images,brands';
        const sort = searchParams.get('sort') || 'relevance';
        const type = searchParams.get('type') || 'all'; // 'all', 'products', 'items'
        const brands = searchParams.get('brands');
        const priceMin = searchParams.get('price_min');
        const priceMax = searchParams.get('price_max');

        if (!query || query.trim().length === 0) {
            return NextResponse.json({
                success: false,
                error: 'Search query is required',
                data: []
            }, { status: 400 });
        }

        const searchTerm = query.trim();

        // Build API parameters
        const params: any = {
            'page[size]': Math.min(pageSize, 50), // Limit max page size
            include: include
        };

        if (cursor) {
            params['page[cursor]'] = cursor;
        }

        // Add sorting (simplified for search)
        switch (sort) {
            case 'name':
                params['sort[asc]'] = 'name';
                break;
            case 'name_desc':
                params['sort[desc]'] = 'name';
                break;
            case 'price_low':
                params['sort[asc]'] = 'list_price';
                break;
            case 'price_high':
                params['sort[desc]'] = 'list_price';
                break;
            case 'newest':
                params['sort[desc]'] = 'created_at';
                break;
            default:
                // For relevance, we'll use name sorting and handle relevance in post-processing
                params['sort[asc]'] = 'name';
        }

        let results: any[] = [];

        try {
            // Search strategy:
            // 1. Check if it looks like a SKU/part number (alphanumeric with dashes/numbers)
            // 2. Search products by name
            // 3. Search items by name and SKU
            // 4. Combine and deduplicate results

            const isLikelyPartNumber = /^[a-zA-Z0-9-]+$/.test(searchTerm) && searchTerm.length >= 3;

            // Search items first (especially for SKU searches)
            if (type === 'all' || type === 'items') {
                try {
                    let itemResults;

                    if (isLikelyPartNumber) {
                        // Try exact SKU match first
                        try {
                            itemResults = await client.searchItemsBySku(searchTerm, {
                                ...params,
                                'page[size]': Math.min(params['page[size]'], 10)
                            });
                        } catch (error) {
                            // If exact SKU fails, try prefix search
                            itemResults = await client.getItems({
                                ...params,
                                'filter[sku][pre]': searchTerm,
                                'page[size]': Math.min(params['page[size]'], 20)
                            });
                        }
                    } else {
                        // Search by item name
                        itemResults = await client.searchItems(searchTerm, {
                            ...params,
                            'page[size]': Math.min(params['page[size]'], 30)
                        });
                    }

                    // Add type field and process items
                    const processedItems = itemResults.data.map((item: any) => ({
                        ...item,
                        type: 'item'
                    }));

                    results = [...results, ...processedItems];
                } catch (error) {
                    console.error('Item search error:', error);
                }
            }

            // Search products
            if (type === 'all' || type === 'products') {
                try {
                    const productResults = await client.searchProducts(searchTerm, {
                        ...params,
                        'page[size]': Math.min(params['page[size]'], 30)
                    });

                    // Add type field and process products
                    const processedProducts = productResults.data.map((product: any) => ({
                        ...product,
                        type: 'product'
                    }));

                    results = [...results, ...processedProducts];
                } catch (error) {
                    console.error('Product search error:', error);
                }
            }

        } catch (error) {
            console.error('Search API error:', error);
        }

        // Apply additional filters
        let filteredResults = results;

        // Brand filtering
        if (brands) {
            const brandIds = brands.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
            filteredResults = filteredResults.filter((result: any) =>
                result.brand && brandIds.includes(result.brand.id)
            );
        }

        // Price filtering
        if (priceMin || priceMax) {
            filteredResults = filteredResults.filter((result: any) => {
                let itemPrice: number | null = null;

                if (result.type === 'item' && result.list_price) {
                    itemPrice = parseFloat(result.list_price);
                } else if (result.type === 'product' && result.items && result.items.length > 0) {
                    const prices = result.items.map((item: any) => parseFloat(item.list_price)).filter((p: number) => !isNaN(p));
                    if (prices.length > 0) {
                        itemPrice = Math.min(...prices); // Use minimum price for filtering
                    }
                }

                if (itemPrice === null) return false;

                if (priceMin && itemPrice < parseFloat(priceMin)) return false;
                if (priceMax && itemPrice > parseFloat(priceMax)) return false;

                return true;
            });
        }

        // Remove duplicates (same product appearing as both product and item)
        const seenProductIds = new Set();
        const deduplicatedResults = [];

        // Prioritize exact SKU matches and products over generic items
        const sortedResults = filteredResults.sort((a: any, b: any) => {
            // Exact SKU matches first
            if (isLikelyPartNumber) {
                const aExactMatch = a.sku?.toLowerCase() === searchTerm.toLowerCase();
                const bExactMatch = b.sku?.toLowerCase() === searchTerm.toLowerCase();
                if (aExactMatch && !bExactMatch) return -1;
                if (!aExactMatch && bExactMatch) return 1;
            }

            // Products before individual items
            if (a.type === 'product' && b.type === 'item') return -1;
            if (a.type === 'item' && b.type === 'product') return 1;

            return 0;
        });

        for (const result of sortedResults) {
            const productId = result.type === 'product' ? result.id : result.product?.id;

            if (productId) {
                if (!seenProductIds.has(productId)) {
                    deduplicatedResults.push(result);
                    seenProductIds.add(productId);
                }
            } else {
                // Items without products (shouldn't happen often)
                deduplicatedResults.push(result);
            }
        }

        // Limit results and simulate pagination
        const startIndex = 0;
        const endIndex = Math.min(startIndex + pageSize, deduplicatedResults.length);
        const paginatedResults = deduplicatedResults.slice(startIndex, endIndex);

        // Calculate relevance scores for sorting (simplified)
        if (sort === 'relevance') {
            paginatedResults.sort((a: any, b: any) => {
                const aName = (a.name || '').toLowerCase();
                const bName = (b.name || '').toLowerCase();
                const searchLower = searchTerm.toLowerCase();

                // Exact name matches score highest
                const aExactName = aName === searchLower;
                const bExactName = bName === searchLower;
                if (aExactName && !bExactName) return -1;
                if (!aExactName && bExactName) return 1;

                // Names starting with search term score higher
                const aStartsWith = aName.startsWith(searchLower);
                const bStartsWith = bName.startsWith(searchLower);
                if (aStartsWith && !bStartsWith) return -1;
                if (!aStartsWith && bStartsWith) return 1;

                // Names containing search term score next
                const aContains = aName.includes(searchLower);
                const bContains = bName.includes(searchLower);
                if (aContains && !bContains) return -1;
                if (!aContains && bContains) return 1;

                // For items, exact SKU matches
                if (isLikelyPartNumber && a.sku && b.sku) {
                    const aSkuMatch = a.sku.toLowerCase() === searchLower;
                    const bSkuMatch = b.sku.toLowerCase() === searchLower;
                    if (aSkuMatch && !bSkuMatch) return -1;
                    if (!aSkuMatch && bSkuMatch) return 1;
                }

                return 0;
            });
        }

        // Create mock cursor for next page
        const hasMore = endIndex < deduplicatedResults.length;
        const mockNextCursor = hasMore ? `search_${endIndex}_${Buffer.from(searchTerm).toString('base64')}` : null;

        return NextResponse.json({
            success: true,
            data: paginatedResults,
            meta: {
                cursor: {
                    current: cursor || null,
                    prev: null,
                    next: mockNextCursor,
                    count: paginatedResults.length
                },
                total_results: deduplicatedResults.length,
                search_info: {
                    query: searchTerm,
                    is_likely_part_number: isLikelyPartNumber,
                    result_types: {
                        products: deduplicatedResults.filter(r => r.type === 'product').length,
                        items: deduplicatedResults.filter(r => r.type === 'item').length
                    }
                }
            },
            filters: {
                query: searchTerm,
                type,
                brands: brands ? brands.split(',') : [],
                priceMin,
                priceMax,
                sort
            }
        });

    } catch (error: any) {
        console.error('Search API error:', error);

        return NextResponse.json({
            success: false,
            error: error.message || 'Search failed',
            data: []
        }, {
            status: error.status || 500
        });
    }
}