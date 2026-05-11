'use client';

import { useDeferredValue } from 'react';
import Link from 'next/link';
import type { Place } from '@/types/travel';
import { Star, MapPin } from 'lucide-react';
import { DestinationGridSkeleton } from '@/components/home/destination-grid-skeleton';

export function DestinationGrid({ destinations }: { destinations: Place[] }) {
  const deferredDestinations = useDeferredValue(destinations);

  if (!deferredDestinations.length) {
    return <DestinationGridSkeleton />;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {deferredDestinations.map((place, index) => (
        <Link
          key={place.id}
          href={`/places/${place.slug}`}
          className={`group overflow-hidden rounded-3xl border border-emerald-200 bg-white/85 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_20px_60px_rgba(76,78,18,0.08)] animate-fade-up`}
          style={{ animationDelay: `${Math.min(index * 120, 600)}ms` }}
        >
          <div className="relative aspect-[16/10] overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${place.image})` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-transparent opacity-80 transition duration-300 group-hover:opacity-50" />
            <div className="absolute left-4 top-4 rounded-full border border-emerald-200 bg-white/90 px-3 py-1 text-xs text-emerald-900 backdrop-blur">
              Featured
            </div>
          </div>
          <div className="space-y-3 p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-900">{place.category}</span>
              <span className="flex items-center gap-1 text-sm text-emerald-700"><Star className="h-4 w-4" />{place.rating}</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-900">{place.name}</h3>
            <p className="text-sm text-slate-700">{place.shortDescription}</p>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <MapPin className="h-4 w-4" />
              {place.distanceKm} km away
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
