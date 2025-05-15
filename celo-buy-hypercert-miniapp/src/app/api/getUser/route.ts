import { NeynarAPIClient, Configuration } from "@neynar/nodejs-sdk";
import { NextResponse } from "next/server";

const config = new Configuration({
  apiKey: process.env.NEYNAR_API_KEY || '',
});
const client = new NeynarAPIClient(config);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const limit = searchParams.get('limit') || '10';

  if (!q || q.length === 0) {
    return NextResponse.json({ error: 'Search term is required' }, { status: 400 });
  }

  try {
    const data = await client.searchUser({ q, limit: Number(limit) });
    return NextResponse.json(data.result.users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}