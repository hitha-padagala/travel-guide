'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useTravelFilters } from '@/context/travel-filters-context';

export function HeroSearch() {
  const { filters, setFilters } = useTravelFilters();
  return (
    <div className="flex max-w-2xl items-center gap-3 rounded-2xl border border-emerald-200 bg-white/80 p-3 shadow-lg ring-1 ring-emerald-200/20 transition duration-300 focus-within:ring-emerald-300/40">
      <Search className="h-5 w-5 text-slate-400" />
      <Input
        placeholder="Search a city, monument, beach, or hill station"
        value={filters.query}
        onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))}
      />
      <span className="rounded-xl border border-emerald-200 bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-900">
        Search
      </span>
    </div>
  );
}
