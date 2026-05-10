import type { Place } from '@/types/travel';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { places as seedPlaces } from '@/data/travel-data';

export async function getPlacesServer(): Promise<Place[]> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return seedPlaces;

  const { data, error } = await supabase.from('places').select('*').order('rating', { ascending: false });
  if (error || !data?.length) return seedPlaces;

  return data.map((place) => ({
    id: place.id,
    slug: place.slug,
    name: place.name,
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
  }));
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

  return data.map((place) => ({
    id: place.id,
    slug: place.slug,
    name: place.name,
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
  }));
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

  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    category: data.category,
    rating: Number(data.rating),
    distanceKm: Number(data.distance_km ?? data.distanceKm ?? 0),
    budget: data.budget,
    familyFriendly: Boolean(data.family_friendly ?? data.familyFriendly),
    shortDescription: data.short_description ?? data.shortDescription,
    whyFamous: data.why_famous ?? data.whyFamous,
    bestTimeToVisit: data.best_time_to_visit ?? data.bestTimeToVisit,
    timings: data.timings,
    entryFee: data.entry_fee ?? data.entryFee,
    image: data.image,
    gallery: data.gallery ?? [],
    nearbyAttractions: data.nearby_attractions ?? data.nearbyAttractions ?? [],
    latitude: Number(data.latitude),
    longitude: Number(data.longitude)
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
