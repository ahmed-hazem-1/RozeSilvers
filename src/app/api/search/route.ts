import { NextRequest, NextResponse } from 'next/server';
import { searchProductsAction } from '@/lib/shopify/actions';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '8', 10);

    if (!query.trim()) {
      return NextResponse.json({ products: [] });
    }

    const products = await searchProductsAction(query, limit);

    return NextResponse.json({ products });
  } catch (error) {
    console.error('API /api/search error:', error);
    return NextResponse.json({ products: [], error: 'Failed to search products' }, { status: 500 });
  }
}
