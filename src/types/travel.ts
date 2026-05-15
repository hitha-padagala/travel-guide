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
  image?: string;
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

export type PlannerStyle = 'Family' | 'Solo' | 'Couple' | 'Adventure' | 'Religious' | 'Food & Culture';
export type TravelTransport = 'Car' | 'Train' | 'Plane';

export type TripPlannerRequest = {
  destination: string;
  days: number;
  budget: Budget | 'Flexible';
  interests: string[];
  style: PlannerStyle;
  travelers: number;
  departureCity?: string;
  transport?: TravelTransport;
};

export type TripPlanDay = {
  day: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  staySuggestion: string;
  foodSuggestion: string;
};

export type TripBudgetItem = {
  label: string;
  amount: string;
  note: string;
};

export type TripPlan = {
  destination: string;
  state: string;
  category: TravelCategory | 'Custom';
  bestTimeToVisit: string;
  nearbyAttractions: string[];
  suggestedPlaces?: string[];
  summary: string;
  bestFor: string[];
  totalCost: string;
  budgetBreakdown: TripBudgetItem[];
  itinerary: TripPlanDay[];
  chatSuggestions: string[];
};

export type TravelChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};
