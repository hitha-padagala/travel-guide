import { notFound } from 'next/navigation';
import { PlaceDetails } from '@/components/places/place-details';
import { getPlaceBySlugServer } from '@/services/place-repository.server';

export default async function PlacePage({ params }: { params: { slug: string } }) {
  const place = await getPlaceBySlugServer(params.slug);
  if (!place) notFound();
  return <PlaceDetails place={place} />;
}
