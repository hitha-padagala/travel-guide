'use client';

import { DestinationGrid } from '@/components/home/destination-grid';
import { AiPlannerBanner } from '@/components/home/ai-planner-banner';
import { FilterBar } from '@/components/home/filter-bar';
import { TravelFiltersProvider, useTravelFilters } from '@/context/travel-filters-context';
import type { Place } from '@/types/travel';
import { SectionReveal } from '@/components/home/section-reveal';
import { Globe2 } from 'lucide-react';
import { stateCategories } from '@/data/travel-data';

function FilteredDestinations() {
  const { filteredPlaces } = useTravelFilters();
  return <DestinationGrid destinations={filteredPlaces} />;
}

function StateCategoryView({ places }: { places: Place[] }) {
  const { filters } = useTravelFilters();

  const visiblePlaces =
    filters.state === 'All' ? places : places.filter((place) => place.state === filters.state);

  const grouped = stateCategories.reduce<Record<string, Place[]>>((acc, category) => {
    acc[category] = visiblePlaces.filter((place) => place.category === category);
    return acc;
  }, {});

  const orderedCategories = stateCategories.filter((category) => grouped[category].length > 0);

  if (!orderedCategories.length) {
    if (filters.category !== 'All' || filters.state !== 'All') {
      return (
        <div className="rounded-3xl border border-emerald-200 bg-white/85 p-6 text-center">
          <h3 className="text-xl font-semibold text-slate-900">Selected category not available</h3>
          <p className="mt-2 text-sm text-slate-700">
            We do not have a place for this state and category combination yet. Try a different state or category.
          </p>
        </div>
      );
    }

    return <FilteredDestinations />;
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-emerald-200 bg-white/80 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-700">State guide</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">
              {filters.state === 'All' ? 'Browse by state and category' : `${filters.state} by category`}
            </h3>
          </div>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-800">
            {visiblePlaces.length} places
          </span>
        </div>
      </div>
      {orderedCategories.map((category) => (
        <div key={category} className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xl font-semibold text-slate-900">{category}</h3>
            <span className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs text-emerald-800">
              {grouped[category].length} places
            </span>
          </div>
          <DestinationGrid destinations={grouped[category]} />
        </div>
      ))}
    </div>
  );
}

export function HomePageShell({ places }: { places: Place[] }) {
  return (
    <TravelFiltersProvider places={places}>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <SectionReveal className="relative overflow-hidden rounded-3xl border border-emerald-200/70 bg-[#f4f8ef] p-5 shadow-[0_20px_80px_rgba(84,121,62,0.10)] backdrop-blur md:p-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-72 overflow-hidden">
            <div className="animate-pulse-glow absolute left-10 top-8 h-40 w-40 rounded-full bg-emerald-200/35 blur-3xl" />
            <div className="animate-pulse-glow absolute right-10 top-2 h-52 w-52 rounded-full bg-emerald-100/50 blur-3xl" />
          </div>
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="space-y-5 animate-fade-up">
              <span className="inline-flex rounded-full border border-emerald-300 bg-emerald-100 px-4 py-1 text-sm text-emerald-900">
                India travel guide
              </span>
              <div className="space-y-3">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
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
            <p className="mt-1 text-slate-700">Select a state to see all its places grouped by category.</p>
          </div>
          <FilterBar />
          <StateCategoryView places={places} />
        </SectionReveal>

        <SectionReveal className="mt-12">
          <AiPlannerBanner />
        </SectionReveal>
      </div>
    </TravelFiltersProvider>
  );
}
