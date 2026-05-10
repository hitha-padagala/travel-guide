'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type SavedPlacesContextValue = {
  savedPlaceIds: string[];
  toggleSavedPlace: (id: string) => void;
  isSaved: (id: string) => boolean;
};

const SavedPlacesContext = createContext<SavedPlacesContextValue | null>(null);

export function SavedPlacesProvider({ children }: { children: React.ReactNode }) {
  const [savedPlaceIds, setSavedPlaceIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('travelnest-saved-places');
      if (stored) setSavedPlaceIds(JSON.parse(stored) as string[]);
    } catch {
      setSavedPlaceIds([]);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem('travelnest-saved-places', JSON.stringify(savedPlaceIds));
    } catch {
      // ignore storage errors
    }
  }, [savedPlaceIds]);

  const value = useMemo(
    () => ({
      savedPlaceIds,
      toggleSavedPlace: (id: string) =>
        setSavedPlaceIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id])),
      isSaved: (id: string) => savedPlaceIds.includes(id)
    }),
    [savedPlaceIds]
  );

  return <SavedPlacesContext.Provider value={value}>{children}</SavedPlacesContext.Provider>;
}

export function useSavedPlaces() {
  const context = useContext(SavedPlacesContext);
  if (!context) throw new Error('useSavedPlaces must be used within SavedPlacesProvider');
  return context;
}
