'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useTravelFilters } from '@/context/travel-filters-context';

export function HeroSearch() {
  const { filters, setFilters } = useTravelFilters();
  return (
    <div className="flex max-w-2xl items-center gap-3 rounded-2xl border border-[#c8d7f2] bg-white/90 p-3 shadow-lg ring-1 ring-[#1d4ed8]/15 transition duration-300 focus-within:ring-[#1d4ed8]/30">
      <Search className="h-5 w-5 text-slate-400" />
      <Input
        placeholder="Search a city, monument, beach, or hill station"
        value={filters.query}
        onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))}
      />
      <span className="rounded-xl border border-[#bfd0f7] bg-[#eaf2ff] px-4 py-2 text-sm font-semibold text-[#1d4ed8]">
        Search
      </span>
    </div>
  );
}
