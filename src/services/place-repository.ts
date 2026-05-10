import { places as seedPlaces } from '@/data/travel-data';
import type { Place } from '@/types/travel';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export async function getPlaces(): Promise<Place[]> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return seedPlaces;

  const { data, error } = await supabase.from('places').select('*').order('rating', { ascending: false });
  if (error || !data?.length) return seedPlaces;

  return data as Place[];
}
