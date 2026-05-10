import { HomePageShell } from '@/components/home/home-page-shell';
import { getPlacesServer } from '@/services/place-repository.server';
import { places as seedPlaces } from '@/data/travel-data';

export default async function HomePage() {
  const places = (await getPlacesServer()) ?? seedPlaces;
  return <HomePageShell places={places} />;
}
