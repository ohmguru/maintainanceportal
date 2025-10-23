import { NextResponse } from 'next/server';
import { getStore } from '@netlify/blobs';

export const runtime = 'edge';

export async function GET() {
  try {
    const store = getStore('battery-data');
    const data = await store.get('inventory', { type: 'json' });

    if (!data) {
      // Return default data if not found
      return NextResponse.json({
        lastUpdated: new Date().toISOString(),
        allocationBase: 90,
        totalReserve1: 284,
        locations: []
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching battery inventory:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const store = getStore('battery-data');

    await store.setJSON('inventory', {
      ...data,
      lastUpdated: new Date().toISOString()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating battery inventory:', error);
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
}
