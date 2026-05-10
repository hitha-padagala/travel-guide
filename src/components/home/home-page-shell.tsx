'use client';

import { DestinationGrid } from '@/components/home/destination-grid';
import { AiPlannerBanner } from '@/components/home/ai-planner-banner';
import { FilterBar } from '@/components/home/filter-bar';
import { TravelFiltersProvider, useTravelFilters } from '@/context/travel-filters-context';
import type { Place } from '@/types/travel';
import { SectionReveal } from '@/components/home/section-reveal';
import { Globe2 } from 'lucide-react';

function FilteredDestinations() {
  const { filteredPlaces } = useTravelFilters();
  return <DestinationGrid destinations={filteredPlaces} />;
}

export function HomePageShell({ places }: { places: Place[] }) {
  return (
    <TravelFiltersProvider places={places}>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <SectionReveal className="relative overflow-hidden rounded-3xl border border-emerald-200/70 bg-[#f4f8ef] p-6 shadow-[0_20px_80px_rgba(84,121,62,0.10)] backdrop-blur md:p-10">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-72 overflow-hidden">
            <div className="animate-pulse-glow absolute left-10 top-8 h-40 w-40 rounded-full bg-emerald-200/35 blur-3xl" />
            <div className="animate-pulse-glow absolute right-10 top-2 h-52 w-52 rounded-full bg-emerald-100/50 blur-3xl" />
          </div>
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-6 animate-fade-up">
              <span className="inline-flex rounded-full border border-emerald-300 bg-emerald-100 px-4 py-1 text-sm text-emerald-900">
                India travel guide
              </span>
              <div className="space-y-4">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                  Explore sacred sites, heritage cities, coastal escapes, hill retreats, and adventure routes.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-700 sm:text-lg">
                  Plan your next India trip with a curated guide to famous places, quick search, clean details, and a local shortlist.
                </p>
              </div>
              <p className="max-w-2xl rounded-2xl border border-emerald-200 bg-white/80 px-4 py-3 text-sm text-slate-700">
                Browse a curated set of famous Indian places, then open a destination to see its story, best season, timings, and map.
              </p>
            </div>
            <div className="grid gap-4 rounded-3xl border border-emerald-200/70 bg-white/80 p-4 animate-float-slow">
              <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-100 to-emerald-50 p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-emerald-900">
                  <Globe2 className="h-4 w-4" />
                  Current guide
                </div>
                <p className="mt-2 text-sm text-slate-700">
                  Discover the most iconic places across India, curated for weekend breaks and longer trips.
                </p>
              </div>
              {places.slice(0, 3).map((place) => (
                <div key={place.id} className="rounded-2xl border border-emerald-200 bg-white/70 p-4 transition duration-300 hover:bg-white">
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">{place.category}</p>
                  <h3 className="mt-2 text-lg font-medium text-slate-900">{place.name}</h3>
                  <p className="mt-1 text-sm text-slate-700">{place.shortDescription}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>

        <SectionReveal className="mt-12 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Featured destinations</h2>
            <p className="mt-1 text-slate-700">Popular India stops to add to your travel shortlist.</p>
          </div>
          <FilterBar />
          <FilteredDestinations />
        </SectionReveal>

        <SectionReveal className="mt-12">
          <AiPlannerBanner />
        </SectionReveal>
      </div>
    </TravelFiltersProvider>
  );
}
