'use client';

import Link from 'next/link';
import { Bookmark, Compass } from 'lucide-react';
import type { Place } from '@/types/travel';
import { useSavedPlaces } from '@/context/saved-places-context';
import { places as catalogPlaces } from '@/data/travel-data';

export function SavedPlacesPanel() {
  const { savedPlaceIds } = useSavedPlaces();
  const places: Place[] = catalogPlaces.filter((place) => savedPlaceIds.includes(place.id) || savedPlaceIds.includes(place.slug));

  return (
    <div className="rounded-3xl border border-[#c8d7f2] bg-white/90 p-6">
      <div className="flex items-center gap-3">
        <Bookmark className="h-5 w-5 text-[#1d4ed8]" />
        <h1 className="text-3xl font-semibold text-slate-900">Travel Shortlist</h1>
      </div>
      <p className="mt-2 text-slate-700">A local shortlist of places you want to explore on your next trip.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {places.map((place) => (
          <Link key={place.slug} href={`/places/${place.slug}`} className="rounded-2xl border border-[#c8d7f2] bg-white p-4 transition hover:bg-[#eff6ff]">
            <p className="text-xs uppercase tracking-[0.3em] text-[#1d4ed8]">{place.category}</p>
            <h2 className="mt-2 text-lg font-semibold text-slate-900">{place.name}</h2>
            <p className="mt-2 text-sm text-slate-700">{place.shortDescription}</p>
          </Link>
        ))}
      </div>

      {places.length === 0 ? (
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-dashed border-[#c8d7f2] bg-[#eff6ff] p-5 text-sm text-slate-600">
          <Compass className="h-4 w-4" />
          Open a place and tap Save place to build your shortlist.
        </div>
      ) : null}
    </div>
  );
}
