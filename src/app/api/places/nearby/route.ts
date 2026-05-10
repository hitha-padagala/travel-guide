import { NextResponse } from 'next/server';
import { getPlacesNearServer } from '@/services/place-repository.server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const lat = Number(url.searchParams.get('lat'));
  const lng = Number(url.searchParams.get('lng'));

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return NextResponse.json([]);
  }

  const places = await getPlacesNearServer(lat, lng);
  return NextResponse.json(places);
}
