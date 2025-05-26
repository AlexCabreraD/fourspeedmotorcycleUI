// src/app/api/items/by-category/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createWPSClient } from '@/lib/api/wps-client';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const client = createWPSClient();

        // Get query parameters
        const vehicle = searchParams.get('vehicle');
        const category = searchParams.get('category');
        const pageSize = parseInt(searchParams.get('page[size]') || '24');
        const cursor = searchParams.get('cursor');
        const include = searchParams.get('include') || 'product,images,brand';
        const sort = searchParams.get('sort') || 'name';
        const brands = searchParams.get('brands');
        const priceMin = searchParams.get('price_min');
        const priceMax = searchParams.get('price_max');
        const status = searchParams.get('status');

        if (!vehicle || !category) {
            return NextResponse.json({
                success: false,
                error: 'Vehicle and category parameters are required',
                data: []
            }, { status: 400 });
        }

        // Map category to product types
        const categoryToProductTypes: { [key: string]: string[] } = {
            'engine-performance': [
                'Engine', 'Intake/Carb/Fuel System', 'Exhaust', 'Engine Management', 'Spark Plugs',
                'Air Filters', 'Oil Filters', 'Piston kits & Components', 'Gaskets/Seals', 'Jets', 'Clutch'
            ],
            'drivetrain-motion': [
                'Drive', 'Belts', 'Chains', 'Sprockets', 'Suspension', 'Brakes', 'Wheels', 'Rims',
                'Tires', 'Tubes', 'Tire/Wheel Accessories', 'Tire And Wheel Kit', 'Wheel Components'
            ],
            'controls-handling': [
                'Handlebars', 'Risers', 'Grips', 'Hand Controls', 'Foot Controls', 'Levers',
                'Cable/Hydraulic Control Lines', 'Throttle', 'Steering'
            ],
            'body-protection': [
                'Body', 'Guards/Braces', 'Handguards', 'Protective/Safety', 'Windshield/Windscreen',
                'Seat', 'UTV Cab/Roof/Door'
            ],
            'electrical-electronics': [
                'Electrical', 'Batteries', 'Starters', 'Switches', 'Illumination', 'Gauges/Meters',
                'Audio/Visual/Communication', 'GPS'
            ],
            'apparel-safety': [
                'Headgear', 'Helmets', 'Helmet Accessories', 'Eyewear', 'Gloves', 'Shirts',
                'Jerseys', 'Jackets', 'Pants', 'Shorts', 'Suits', 'Footwear', 'Protective/Safety', 'Flotation Vests'
            ],
            'tools-maintenance': [
                'Tools', 'Chemicals', 'Hardware/Fasteners/Fittings', 'Stands/Lifts', 'Clamps'
            ],
            'storage-transport': [
                'Luggage', 'Racks', 'Straps/Tie-Downs', 'Trailer/Towing', 'Storage Covers',
                'Utility Containers', 'Fuel Containers'
            ]
        };

        const productTypes = categoryToProductTypes[category];

        if (!productTypes) {
            return NextResponse.json({
                success: false,
                error: 'Invalid category',
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
                params['sort[asc]'] = 'list_price';
                break;
            case 'price_high':
                params['sort[desc]'] = 'list_price';
                break;
            case 'sku':
                params['sort[asc]'] = 'sku';
                break;
            case 'newest':
                params['sort[desc]'] = 'created_at';
                break;
            default:
                params['sort[asc]'] = 'name';
        }

        // Add price filters if specified
        if (priceMin) {
            params['filter[list_price][gt]'] = parseFloat(priceMin);
        }
        if (priceMax) {
            params['filter[list_price][lt]'] = parseFloat(priceMax);
        }

        // Add status filter if specified
        if (status) {
            const statusValues = status.split(',');
            if (statusValues.length === 1) {
                params['filter[status]'] = statusValues[0];
            }
            // For multiple status values, we'll filter after getting results
        }

        let response;

        // If brand filter is specified, use brand-specific endpoint
        if (brands) {
            const brandIds = brands.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
            if (brandIds.length === 1) {
                // Get items from specific brand
                response = await client.getItemsByBrand(brandIds[0], params);
            } else {
                // Multiple brands - get all items and filter
                response = await client.getItems(params);
            }
        } else {
            // Get all items
            response = await client.getItems(params);
        }

        let filteredItems = response.data;

        // Filter by product types that match the category
        filteredItems = filteredItems.filter((item: any) => {
            // Since WPS API doesn't have direct product_type filtering in all endpoints,
            // we'll use name-based filtering as a fallback
            const itemName = item.name.toLowerCase();
            const productName = item.product?.name?.toLowerCase() || '';

            // Check if item matches any of the product types for this category
            return productTypes.some(type => {
                const typeKeywords = type.toLowerCase().split('/').flatMap(t => t.split(' '));
                return typeKeywords.some(keyword =>
                    itemName.includes(keyword) || productName.includes(keyword)
                );
            }) || Math.random() > 0.7; // Include some random items for demo purposes
        });

        // Apply brand filtering if multiple brands specified
        if (brands && brands.includes(',')) {
            const brandIds = brands.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
            filteredItems = filteredItems.filter((item: any) =>
                item.brand && brandIds.includes(item.brand.id)
            );
        }

        // Apply status filtering if multiple values specified
        if (status && status.includes(',')) {
            const statusValues = status.split(',');
            filteredItems = filteredItems.filter((item: any) =>
                statusValues.includes(item.status)
            );
        }

        // Vehicle-specific filtering (simplified for demo)
        const vehicleKeywords: { [key: string]: string[] } = {
            'street': ['motorcycle', 'bike', 'street', 'road', 'sport'],
            'offroad': ['dirt', 'motocross', 'enduro', 'trail', 'mx'],
            'atv': ['atv', 'quad', 'utv', 'side', 'utility'],
            'snow': ['snowmobile', 'sled', 'snow', 'ski', 'track'],
            'watercraft': ['jet', 'ski', 'pwc', 'watercraft', 'sea'],
            'bicycle': ['bicycle', 'bike', 'bmx', 'mountain', 'road']
        };

        const vehicleKeywordList = vehicleKeywords[vehicle] || [];

        if (vehicleKeywordList.length > 0) {
            filteredItems = filteredItems.filter((item: any) => {
                const searchText = `${item.name} ${item.product?.name || ''} ${item.product?.description || ''}`.toLowerCase();
                return vehicleKeywordList.some(keyword => searchText.includes(keyword)) ||
                    Math.random() > 0.4; // Include more items for demo
            });
        }

        // Simulate pagination for filtered results
        const startIndex = 0; // In real implementation, you'd handle cursor-based pagination
        const endIndex = Math.min(startIndex + pageSize, filteredItems.length);
        const paginatedItems = filteredItems.slice(startIndex, endIndex);

        // Create mock cursor for next page
        const hasMore = endIndex < filteredItems.length;
        const mockNextCursor = hasMore ? `cursor_${endIndex}` : null;

        return NextResponse.json({
            success: true,
            data: paginatedItems,
            meta: {
                cursor: {
                    current: cursor || null,
                    prev: null,
                    next: mockNextCursor,
                    count: paginatedItems.length
                },
                total_filtered: filteredItems.length,
                total_unfiltered: response.data.length
            },
            filters: {
                vehicle,
                category,
                brands: brands ? brands.split(',') : [],
                priceMin,
                priceMax,
                status: status ? status.split(',') : [],
                sort,
                productTypes
            }
        });

    } catch (error: any) {
        console.error('Items by category API error:', error);

        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to fetch items',
            data: []
        }, {
            status: error.status || 500
        });
    }
}