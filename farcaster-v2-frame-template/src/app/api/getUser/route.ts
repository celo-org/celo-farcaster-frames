import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get('q');
  const limit = searchParams.get('limit') || '10';

  if (!query) {
    return NextResponse.json({ error: 'Query parameter required' }, { status: 400 });
  }

  try {
    // Using Neynar API for Farcaster user search
    // Replace with your preferred Farcaster API if needed
    const apiKey = process.env.NEYNAR_API_KEY || '';
    
    if (!apiKey) {
      console.warn('NEYNAR_API_KEY is not set');
      return NextResponse.json({ error: 'API configuration error' }, { status: 500 });
    }
    
    const response = await fetch(`https://api.neynar.com/v2/farcaster/user/search?q=${encodeURIComponent(query)}&limit=${limit}`, {
      headers: {
        'Accept': 'application/json',
        'api_key': apiKey
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data.result.users);
  } catch (error) {
    console.error('Error searching users:', error);
    return NextResponse.json({ error: 'Failed to search users' }, { status: 500 });
  }
}