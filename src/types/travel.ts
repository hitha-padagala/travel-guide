export type TravelCategory =
  | 'Religious'
  | 'Historical'
  | 'Beaches'
  | 'Hill Stations'
  | 'Adventure'
  | 'Food & Culture';

export type Budget = 'Low' | 'Medium' | 'High';

export type Category = {
  name: TravelCategory;
  icon: string;
  description: string;
};

export type Place = {
  id: string;
  slug: string;
  name: string;
  state: string;
  category: TravelCategory;
  rating: number;
  distanceKm: number;
  budget: Budget;
  familyFriendly: boolean;
  shortDescription: string;
  whyFamous: string;
  bestTimeToVisit: string;
  timings: string;
  entryFee: string;
  image: string;
  gallery: string[];
  nearbyAttractions: string[];
  latitude: number;
  longitude: number;
  recommendedStays?: Recommendation[];
  recommendedEats?: Recommendation[];
};

export type Recommendation = {
  name: string;
  description: string;
  type: string;
};
