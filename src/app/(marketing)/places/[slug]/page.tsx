import { notFound } from 'next/navigation';
import { PlaceDetails } from '@/components/places/place-details';
import { getPlaceBySlugServer } from '@/services/place-repository.server';

export default async function PlacePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const place = await getPlaceBySlugServer(slug);
  if (!place) notFound();
  return <PlaceDetails place={place} />;
}
