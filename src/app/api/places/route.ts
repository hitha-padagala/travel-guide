import { NextResponse } from 'next/server';
import { getPlacesServer } from '@/services/place-repository.server';

export async function GET() {
  const places = await getPlacesServer();
  return NextResponse.json(places);
}
