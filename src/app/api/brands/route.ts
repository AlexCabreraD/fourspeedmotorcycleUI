// src/app/api/brands/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createWPSClient } from '@/lib/api/wps-client';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const client = createWPSClient();

        // Get query parameters
        const popular = searchParams.get('popular');
        const pageSize = parseInt(searchParams.get('page[size]') || '50');
        const cursor = searchParams.get('cursor');

        // Build API parameters
        const params: any = {
            'page[size]': pageSize,
            'sort[asc]': 'name'
        };

        if (cursor) {
            params['page[cursor]'] = cursor;
        }

        const response = await client.getBrands(params);

        // If popular brands requested, return a curated list of major brands
        if (popular === 'true') {
            const popularBrandNames = [
                'FLY RACING', 'FOX', 'ALPINESTARS', 'YOSHIMURA', 'FMF', 'PRO CIRCUIT',
                'RENTHAL', 'ODI', 'AKRAPOVIC', 'BOYESEN', 'MOTION PRO', 'ALL BALLS',
                'K&N', 'NGK', 'EBC', 'GALFER', 'ITP', 'MAXXIS', 'DUNLOP', 'MICHELIN'
            ];

            // Filter to popular brands and limit count
            response.data = response.data
                .filter(brand => popularBrandNames.includes(brand.name.toUpperCase()))
                .slice(0, 12);
        }

        return NextResponse.json({
            success: true,
            data: response.data,
            meta: response.meta
        });

    } catch (error: any) {
        console.error('Brands API error:', error);

        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to fetch brands',
            data: []
        }, {
            status: error.status || 500
        });
    }
}