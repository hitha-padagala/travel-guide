'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';
import type { TravelFilters } from '@/types/filters';
import type { Place } from '@/types/travel';

type TravelFiltersContextValue = {
  filters: TravelFilters;
  setFilters: React.Dispatch<React.SetStateAction<TravelFilters>>;
  filteredPlaces: Place[];
};

const initialFilters: TravelFilters = {
  category: 'All',
  distanceKm: 50,
  rating: 0,
  budget: 'All',
  familyFriendly: false,
  query: ''
};

const TravelFiltersContext = createContext<TravelFiltersContextValue | null>(null);

export function TravelFiltersProvider({
  children,
  places
}: {
  children: React.ReactNode;
  places: Place[];
}) {
  const [filters, setFilters] = useState<TravelFilters>(initialFilters);

  const filteredPlaces = useMemo(
    () =>
      places.filter((place) => {
        const matchesCategory = filters.category === 'All' || place.category === filters.category;
        const matchesDistance = place.distanceKm <= filters.distanceKm;
        const matchesRating = place.rating >= filters.rating;
        const matchesBudget = filters.budget === 'All' || place.budget === filters.budget;
        const matchesFamily = !filters.familyFriendly || place.familyFriendly;
        const query = filters.query.trim().toLowerCase();
        const matchesQuery =
          !query ||
          place.name.toLowerCase().includes(query) ||
          place.category.toLowerCase().includes(query) ||
          place.shortDescription.toLowerCase().includes(query);

        return matchesCategory && matchesDistance && matchesRating && matchesBudget && matchesFamily && matchesQuery;
      }),
    [filters, places]
  );

  return <TravelFiltersContext.Provider value={{ filters, setFilters, filteredPlaces }}>{children}</TravelFiltersContext.Provider>;
}

export function useTravelFilters() {
  const context = useContext(TravelFiltersContext);
  if (!context) throw new Error('useTravelFilters must be used within TravelFiltersProvider');
  return context;
}
