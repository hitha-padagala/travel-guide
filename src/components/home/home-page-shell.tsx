'use client';

import { DestinationGrid } from '@/components/home/destination-grid';
import { AiPlannerBanner } from '@/components/home/ai-planner-banner';
import { FilterBar } from '@/components/home/filter-bar';
import { TravelFiltersProvider, useTravelFilters } from '@/context/travel-filters-context';
import type { Place } from '@/types/travel';
import { SectionReveal } from '@/components/home/section-reveal';
import { Sparkles } from 'lucide-react';

function FilteredDestinations() {
  const { filteredPlaces } = useTravelFilters();
  return <DestinationGrid destinations={filteredPlaces} />;
}

function StateCategoryView() {
  const { filters, filteredPlaces } = useTravelFilters();
  const visiblePlaces = filters.state === 'All' ? filteredPlaces : filteredPlaces.filter((place) => place.state === filters.state);
  const stateLabel = filters.state === 'All' ? 'All states' : filters.state;
  const orderedCategories = Array.from(new Set(visiblePlaces.map((place) => place.category)));
  const grouped = orderedCategories.reduce<Record<string, Place[]>>((acc, category) => {
    acc[category] = visiblePlaces.filter((place) => place.category === category);
    return acc;
  }, {});

  if (!visiblePlaces.length && (filters.state !== 'All' || filters.category !== 'All')) {
    return (
      <div className="rounded-3xl border border-[#c8d7f2] bg-white/90 p-6 text-center">
        <h3 className="text-xl font-semibold text-slate-900">Selected category not available</h3>
        <p className="mt-2 text-sm text-slate-700">
          We do not have a place for this state and category combination yet. Try a different state or category.
        </p>
      </div>
    );
  }

  if (!visiblePlaces.length) {
    return <FilteredDestinations />;
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-[#c8d7f2] bg-white/90 p-5 shadow-[0_18px_50px_rgba(29,78,216,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#1d4ed8]">Available places</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">{stateLabel}</h3>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#c8d7f2] bg-[#eff6ff] px-3 py-1 text-xs text-[#1d4ed8]">
            <Sparkles className="h-3.5 w-3.5" />
            {visiblePlaces.length} places
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {orderedCategories.map((category) => (
            <span key={category} className="rounded-full border border-[#c8d7f2] bg-[#eff6ff] px-3 py-1 text-xs text-[#1d4ed8]">
              {category} {grouped[category].length}
            </span>
          ))}
        </div>
      </div>

      {orderedCategories.map((category) => (
        <div key={category} className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xl font-semibold text-slate-900">{category}</h3>
            <span className="rounded-full border border-[#c8d7f2] bg-white px-3 py-1 text-xs text-[#1d4ed8]">
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
        <SectionReveal className="relative overflow-hidden rounded-3xl border border-[#c8d7f2]/70 bg-[#edf4ff] p-5 shadow-[0_20px_80px_rgba(29,78,216,0.08)] backdrop-blur md:p-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-72 overflow-hidden">
            <div className="animate-pulse-glow absolute left-10 top-8 h-40 w-40 rounded-full bg-[#93c5fd]/30 blur-3xl" />
            <div className="animate-pulse-glow absolute right-10 top-2 h-52 w-52 rounded-full bg-[#1d4ed8]/18 blur-3xl" />
          </div>
          <div className="space-y-6 animate-fade-up">
            <div className="space-y-5">
            
              <div className="space-y-3">
                <h2 className="w-full text-4xl font-semibold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                  Explore sacred sites, heritage cities, coastal escapes, hill retreats, and adventure routes.
                </h2>
                <p className="w-full text-base leading-7 text-slate-700 sm:text-lg">
                  Plan your next India trip with a curated guide to famous places, quick search, clean details, and a local shortlist.
                </p>
              </div>
             
            </div>
            
          </div>
        </SectionReveal>

        <SectionReveal className="mt-12">
          <AiPlannerBanner />
        </SectionReveal>

        <SectionReveal className="mt-12 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Featured destinations</h2>
            <p className="mt-1 text-slate-700">Select a state to see the available places for that state and category.</p>
          </div>
          <FilterBar />
          <StateCategoryView />
        </SectionReveal>
      </div>
    </TravelFiltersProvider>
  );
}
