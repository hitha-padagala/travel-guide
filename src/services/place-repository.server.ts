import type { Place } from '@/types/travel';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { places as seedPlaces } from '@/data/travel-data';

function mapPlaceRow(place: any): Place {
  return {
    id: place.id,
    slug: place.slug,
    name: place.name,
    state: place.state,
    category: place.category,
    rating: Number(place.rating),
    distanceKm: Number(place.distance_km ?? place.distanceKm ?? 0),
    budget: place.budget,
    familyFriendly: Boolean(place.family_friendly ?? place.familyFriendly),
    shortDescription: place.short_description ?? place.shortDescription,
    whyFamous: place.why_famous ?? place.whyFamous,
    bestTimeToVisit: place.best_time_to_visit ?? place.bestTimeToVisit,
    timings: place.timings,
    entryFee: place.entry_fee ?? place.entryFee,
    image: place.image,
    gallery: place.gallery ?? [],
    nearbyAttractions: place.nearby_attractions ?? place.nearbyAttractions ?? [],
    latitude: Number(place.latitude),
    longitude: Number(place.longitude)
  };
}

function mergeWithSeedPlaces(places: Place[]) {
  const merged = new Map(seedPlaces.map((place) => [place.slug, place]));
  for (const place of places) {
    const seed = merged.get(place.slug);
    merged.set(place.slug, {
      ...seed,
      ...place,
      image: seed?.image ?? place.image,
      gallery: seed?.gallery?.length ? seed.gallery : place.gallery
    });
  }
  return Array.from(merged.values());
}

export async function getPlacesServer(): Promise<Place[]> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return seedPlaces;

  const { data, error } = await supabase.from('places').select('*').order('rating', { ascending: false });
  if (error || !data?.length) return seedPlaces;

  return mergeWithSeedPlaces(data.map(mapPlaceRow));
}

export async function searchPlacesServer(query: string): Promise<Place[]> {
  const normalized = query.trim();
  if (!normalized) return getPlacesServer();

  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return seedPlaces.filter((place) =>
      [place.name, place.category, place.shortDescription, place.whyFamous].some((value) =>
        value.toLowerCase().includes(normalized.toLowerCase())
      )
    );
  }

  const search = `%${normalized}%`;
  const { data, error } = await supabase
    .from('places')
    .select('*')
    .or(`name.ilike.${search},category.ilike.${search},short_description.ilike.${search},why_famous.ilike.${search}`)
    .order('rating', { ascending: false });

  if (error || !data?.length) return seedPlaces;

  return mergeWithSeedPlaces(data.map(mapPlaceRow));
}

export async function getPlacesNearServer(lat: number, lng: number): Promise<Place[]> {
  const places = await getPlacesServer();
  return places
    .map((place) => ({
      ...place,
      distanceKm: Number(haversineKm(lat, lng, place.latitude, place.longitude).toFixed(1))
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

export async function getPlaceBySlugServer(slug: string): Promise<Place | null> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return seedPlaces.find((place) => place.slug === slug) ?? null;
  }

  const { data, error } = await supabase.from('places').select('*').eq('slug', slug).maybeSingle();
  if (error || !data) {
    return seedPlaces.find((place) => place.slug === slug) ?? null;
  }

  const mapped = mapPlaceRow(data);
  const seed = seedPlaces.find((place) => place.slug === slug);
  return {
    ...seed,
    ...mapped,
    image: seed?.image ?? mapped.image,
    gallery: seed?.gallery?.length ? seed.gallery : mapped.gallery
  };
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const r = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return 2 * r * Math.asin(Math.sqrt(a));
}
