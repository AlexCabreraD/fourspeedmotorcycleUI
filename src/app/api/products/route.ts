// src/app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createWPSClient } from '@/lib/api/wps-client';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const client = createWPSClient();

        // Get query parameters
        const featured = searchParams.get('featured');
        const include = searchParams.get('include') || 'items,images';
        const pageSize = parseInt(searchParams.get('page[size]') || '12');
        const cursor = searchParams.get('cursor');

        // Build API parameters
        const params: any = {
            'page[size]': pageSize,
            include: include
        };

        if (cursor) {
            params['page[cursor]'] = cursor;
        }

        // If featured products requested, we'll get products with images
        // In a real implementation, you might have a featured flag in your data
        if (featured === 'true') {
            // Get products that have images (more likely to be featured)
            params['include'] = 'items,images,brands';
            params['page[size]'] = 8; // Limit for homepage
        }

        const response = await client.getProducts(params);

        // Filter out products without images for featured section
        if (featured === 'true') {
            response.data = response.data.filter(product =>
                product.images && product.images.length > 0
            );
        }

        return NextResponse.json({
            success: true,
            data: response.data,
            meta: response.meta
        });

    } catch (error: any) {
        console.error('Products API error:', error);

        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to fetch products',
            data: []
        }, {
            status: error.status || 500
        });
    }
}