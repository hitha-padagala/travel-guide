import { NextResponse } from 'next/server';
import { searchPlacesServer } from '@/services/place-repository.server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q') ?? '';
  const places = await searchPlacesServer(query);
  return NextResponse.json(places);
}
