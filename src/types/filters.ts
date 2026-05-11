import type { Budget, TravelCategory } from '@/types/travel';

export type TravelFilters = {
  state: string;
  category: TravelCategory | 'All';
  distanceKm: number;
  rating: number;
  budget: Budget | 'All';
  familyFriendly: boolean;
  query: string;
};
