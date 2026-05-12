'use client';

import { useTravelFilters } from '@/context/travel-filters-context';
import { categories, states } from '@/data/travel-data';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

export function FilterBar() {
  const { filters, setFilters } = useTravelFilters();

  return (
    <div className="grid gap-4 rounded-3xl border border-[#c8d7f2] bg-white/90 p-5 lg:grid-cols-4">
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
    </div>
  );
}
