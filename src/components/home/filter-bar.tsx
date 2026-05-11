'use client';

import { useTravelFilters } from '@/context/travel-filters-context';
import { categories, states } from '@/data/travel-data';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

export function FilterBar() {
  const { filters, setFilters } = useTravelFilters();

  return (
    <div className="grid gap-4 rounded-3xl border border-emerald-200 bg-white/85 p-5 lg:grid-cols-5">
      <Input
        placeholder="Search places, cities, or temples"
        value={filters.query}
        onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))}
      />
      <Select value={filters.state} onChange={(event) => setFilters((current) => ({ ...current, state: event.target.value }))}>
        <option value="All">All states</option>
        {states.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </Select>
      <Select value={filters.category} onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value as typeof current.category }))}>
        <option value="All">All categories</option>
        {categories.map((category) => (
          <option key={category.name} value={category.name}>
            {category.name}
          </option>
        ))}
      </Select>
      <Select value={filters.budget} onChange={(event) => setFilters((current) => ({ ...current, budget: event.target.value as typeof current.budget }))}>
        <option value="All">All budgets</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </Select>
      <Select value={String(filters.distanceKm)} onChange={(event) => setFilters((current) => ({ ...current, distanceKm: Number(event.target.value) }))}>
        <option value="10">Within 10 km</option>
        <option value="25">Within 25 km</option>
        <option value="50">Within 50 km</option>
        <option value="100">Within 100 km</option>
      </Select>
      <button
        type="button"
        onClick={() => setFilters((current) => ({ ...current, familyFriendly: !current.familyFriendly }))}
        className="rounded-xl border border-emerald-200 bg-white px-4 py-2 text-sm text-slate-800 transition hover:bg-emerald-50"
      >
        Family travel {filters.familyFriendly ? 'on' : 'off'}
      </button>
      <div className="lg:col-span-5">
        <Badge className="bg-emerald-100 text-emerald-900">Guide rating {filters.rating}+</Badge>
      </div>
    </div>
  );
}
