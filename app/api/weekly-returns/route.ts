import { NextResponse } from 'next/server';
import { getStore } from '@netlify/blobs';

export const runtime = 'edge';

interface WeeklyReturn {
  location: string;
  week: number;
  weekDateRange: string;
  blastersReturned: number;
  vestsReturned: number;
  batteriesReturned: number;
  players: number;
}

export async function GET() {
  try {
    const store = getStore('weekly-returns-data');
    const data = await store.get('returns', { type: 'json' });

    if (!data) {
      // Return empty data if not found
      return NextResponse.json({
        lastUpdated: new Date().toISOString(),
        returns: []
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching weekly returns:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const store = getStore('weekly-returns-data');

    await store.setJSON('returns', {
      returns: data.returns || [],
      lastUpdated: new Date().toISOString()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating weekly returns:', error);
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
}
