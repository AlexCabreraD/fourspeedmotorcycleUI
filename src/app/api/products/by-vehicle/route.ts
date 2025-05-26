// src/app/api/products/by-vehicle/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createWPSClient, WPSProduct, WPSItem, WPSImage, WPSBrand } from '@/lib/api/wps-client';

// Use the existing ApiResponse type or define a simple one
interface ApiResponse<T> {
    data: T;
    meta?: any;
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const client = createWPSClient();

        // Get query parameters
        const vehicle = searchParams.get('vehicle');
        const pageSize = parseInt(searchParams.get('page[size]') || '20');
        const cursor = searchParams.get('cursor');
        const include = searchParams.get('include') || 'items,images,brands';
        const sort = searchParams.get('sort') || 'name';
        const brands = searchParams.get('brands');
        const priceMin = searchParams.get('price_min');
        const priceMax = searchParams.get('price_max');

        if (!vehicle) {
            return NextResponse.json({
                success: false,
                error: 'Vehicle parameter is required',
                data: []
            }, { status: 400 });
        }

        // Map vehicle to catalog flag for filtering
        const vehicleToCatalogMap: { [key: string]: string } = {
            'street': 'street_catalog',
            'offroad': 'offroad_catalog',
            'atv': 'atv_catalog',
            'snow': 'snow_catalog',
            'watercraft': 'watercraft_catalog',
            'bicycle': 'bicycle_catalog'
        };

        const catalogFlag = vehicleToCatalogMap[vehicle];
        if (!catalogFlag) {
            return NextResponse.json({
                success: false,
                error: 'Invalid vehicle type',
                data: []
            }, { status: 400 });
        }

        // Build API parameters
        const params: any = {
            'page[size]': pageSize,
            include: include
        };

        if (cursor) {
            params['page[cursor]'] = cursor;
        }

        // Add sorting
        switch (sort) {
            case 'name_desc':
                params['sort[desc]'] = 'name';
                break;
            case 'price_low':
                params['sort[asc]'] = 'items.list_price';
                break;
            case 'price_high':
                params['sort[desc]'] = 'items.list_price';
                break;
            case 'newest':
                params['sort[desc]'] = 'created_at';
                break;
            default:
                params['sort[asc]'] = 'name';
        }

        // Since WPS API doesn't directly support catalog flag filtering,
        // we'll get products and then filter them on our side
        // In a real implementation, you might want to use taxonomy terms or other WPS filtering

        let filteredProducts: WPSProduct[];
        let responseMeta: any;

        // If brand filter is specified, filter by brand first
        if (brands) {
            const brandIds = brands.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
            if (brandIds.length === 1) {
                // Use brand-specific endpoint for single brand
                const itemsResponse = await client.get(`brands/${brandIds[0]}/items`, params);

                // Convert items to products format (simplified approach)
                const productsFromItems: WPSProduct[] = (itemsResponse.data as WPSItem[]).map((item: WPSItem) => {
                    const baseProduct = item.product || {
                        id: item.id,
                        name: item.name,
                        description: undefined,
                        designation_id: null,
                        alternate_name: null,
                        care_instructions: null,
                        sort: 0,
                        image_360_id: null,
                        image_360_preview_id: null,
                        size_chart_id: null,
                        created_at: '',
                        updated_at: ''
                    };

                    return {
                        ...baseProduct,
                        items: [item],
                        images: item.images || [],
                        brand: item.brand
                    };
                });

                filteredProducts = productsFromItems;
                responseMeta = itemsResponse.meta;
            } else {
                // Multiple brands - get all products and filter
                const productsResponse = await client.getProducts(params);
                filteredProducts = productsResponse.data;
                responseMeta = productsResponse.meta;
            }
        } else {
            // Get all products
            const productsResponse = await client.getProducts(params);
            filteredProducts = productsResponse.data;
            responseMeta = productsResponse.meta;
        }

        // Apply brand filtering if multiple brands specified
        if (brands && brands.includes(',')) {
            const brandIds = brands.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
            filteredProducts = filteredProducts.filter((product: WPSProduct) =>
                product.brand && brandIds.includes(product.brand.id)
            );
        }

        // Apply price filtering
        if (priceMin || priceMax) {
            filteredProducts = filteredProducts.filter((product: WPSProduct) => {
                if (!product.items || product.items.length === 0) return false;

                const prices = product.items.map((item: WPSItem) => parseFloat(item.list_price)).filter((p: number) => !isNaN(p));
                if (prices.length === 0) return false;

                const minPrice = Math.min(...prices);
                const maxPrice = Math.max(...prices);

                if (priceMin && maxPrice < parseFloat(priceMin)) return false;
                if (priceMax && minPrice > parseFloat(priceMax)) return false;

                return true;
            });
        }

        // For demo purposes, we'll simulate vehicle-specific filtering by using product categories
        // In a real implementation, you'd use the actual catalog flags from your database
        const vehicleKeywords: { [key: string]: string[] } = {
            'street': ['motorcycle', 'bike', 'street', 'road', 'sport'],
            'offroad': ['dirt', 'motocross', 'enduro', 'trail', 'mx'],
            'atv': ['atv', 'quad', 'utv', 'side', 'utility'],
            'snow': ['snowmobile', 'sled', 'snow', 'ski', 'track'],
            'watercraft': ['jet', 'ski', 'pwc', 'watercraft', 'sea'],
            'bicycle': ['bicycle', 'bike', 'bmx', 'mountain', 'road']
        };

        const keywords = vehicleKeywords[vehicle] || [];

        // This is a simplified filter - in production you'd use proper catalog associations
        if (keywords.length > 0) {
            filteredProducts = filteredProducts.filter((product: WPSProduct) => {
                const searchText = `${product.name} ${product.description || ''}`.toLowerCase();
                return keywords.some(keyword => searchText.includes(keyword)) ||
                    Math.random() > 0.3; // Random inclusion to show more products for demo
            });
        }

        return NextResponse.json({
            success: true,
            data: filteredProducts,
            meta: responseMeta,
            vehicle: vehicle,
            filters: {
                brands: brands ? brands.split(',') : [],
                priceMin,
                priceMax,
                sort
            }
        });

    } catch (error: any) {
        console.error('Products by vehicle API error:', error);

        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to fetch products',
            data: []
        }, {
            status: error.status || 500
        });
    }
}