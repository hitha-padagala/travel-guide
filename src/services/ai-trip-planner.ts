import { places as catalogPlaces } from '@/data/travel-data';
import type { Place, TripBudgetItem, TripPlan, TripPlannerRequest, TripPlanDay, TravelChatMessage } from '@/types/travel';

const interestMap: Record<string, string[]> = {
  temples: ['Religious', 'Historical'],
  history: ['Historical'],
  beaches: ['Beaches'],
  mountains: ['Hill Stations'],
  adventure: ['Adventure'],
  food: ['Food & Culture']
};

const destinationAliases: Record<string, string> = {
  bangalore: 'bangalore',
  banglore: 'bangalore',
  bengaluru: 'bangalore',
  delhi: 'delhi',
  newdelhi: 'delhi'
};

function findPlace(destination: string) {
  const normalized = destination.trim().toLowerCase();
  const aliasKey = normalized.replace(/\s+/g, '');
  const aliasMatch = destinationAliases[aliasKey];

  if (aliasMatch) {
    const exact = catalogPlaces.find((place) => place.slug === aliasMatch || place.name.toLowerCase() === aliasMatch);
    if (exact) return exact;
  }

  const exactMatch =
    catalogPlaces.find((place) => place.slug === normalized || place.name.toLowerCase() === normalized) ??
    catalogPlaces.find((place) => place.name.toLowerCase().includes(normalized) && normalized.length >= 4);

  if (exactMatch) return exactMatch;

  return null;
}

function resolvePlace(destination: string) {
  const place = findPlace(destination);
  if (place) return place;

  return (
    {
      id: `custom-${destination.trim().toLowerCase().replace(/\s+/g, '-') || 'trip'}`,
      slug: destination.trim().toLowerCase().replace(/\s+/g, '-'),
      name: destination.trim() || 'Your destination',
      state: '',
      category: 'Food & Culture',
      rating: 0,
      distanceKm: 0,
      budget: 'Medium',
      familyFriendly: true,
      shortDescription: 'A custom trip destination.',
      whyFamous: 'Trip plan based on your entered destination.',
      bestTimeToVisit: 'Varies',
      timings: 'Varies',
      entryFee: 'Varies',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      gallery: [],
      nearbyAttractions: [],
      latitude: 0,
      longitude: 0
    } satisfies Place
  );
}

function matchingInterests(place: Place, interests: string[]) {
  const categories = interests.flatMap((interest) => interestMap[interest.toLowerCase()] ?? []);
  const combined = categories.includes(place.category) ? [place.category, ...categories] : [place.category, ...categories];
  return Array.from(new Set(combined));
}

function formatBudget(days: number, budget: string) {
  const base =
    budget === 'Low' ? 1800 : budget === 'High' ? 6500 : budget === 'Flexible' ? 4200 : 3200;
  const total = Math.max(base * days, 1200 * days);
  return `₹${total.toLocaleString('en-IN')}`;
}

function buildBudgetBreakdown(days: number, budget: string): TripBudgetItem[] {
  const factor = budget === 'Low' ? 0.7 : budget === 'High' ? 1.4 : budget === 'Flexible' ? 1 : 0.9;
  return [
    { label: 'Stay', amount: `₹${Math.round(2200 * days * factor).toLocaleString('en-IN')}`, note: 'Comfortable stay estimate' },
    { label: 'Food', amount: `₹${Math.round(900 * days * factor).toLocaleString('en-IN')}`, note: 'Meals and snacks' },
    { label: 'Local travel', amount: `₹${Math.round(700 * days * factor).toLocaleString('en-IN')}`, note: 'Taxis, autos, and transfers' },
    { label: 'Activities', amount: `₹${Math.round(800 * days * factor).toLocaleString('en-IN')}`, note: 'Entry fees and experiences' }
  ];
}

function buildItinerary(place: Place, request: TripPlannerRequest): TripPlanDay[] {
  return Array.from({ length: request.days }, (_, index) => {
    const day = index + 1;
    const focus =
      day === 1
        ? `Start with ${place.name} highlights and an easy orientation walk.`
        : day === request.days
        ? `Wrap up with a slow morning and a final visit near ${place.name}.`
        : `Spend the day on nearby attractions and local experiences around ${place.name}.`;

    return {
      day,
      title: day === 1 ? 'Arrival and orientation' : day === request.days ? 'Easy wrap-up' : `Day ${day} exploration`,
      morning: day === 1 ? `Check in, rest, and explore the main area of ${place.name}.` : `Visit the most important sight near ${place.name}.`,
      afternoon: focus,
      evening: request.style === 'Food & Culture' ? 'End with a local dinner and market walk.' : 'Enjoy a relaxed dinner and a short evening stroll.',
      staySuggestion: `${place.state} base near ${place.name}`,
      foodSuggestion: request.style === 'Food & Culture' ? 'Prioritize local cuisine and signature snacks.' : 'Pick a popular nearby restaurant or cafe.'
    };
  });
}

export async function generateTripPlan(request: TripPlannerRequest): Promise<TripPlan> {
  return generateTripPlanFallback(request);
}

function generateTripPlanFallback(request: TripPlannerRequest): TripPlan {
  const place = resolvePlace(request.destination);
  const interests = place.state ? matchingInterests(place, request.interests) : Array.from(new Set([request.style, ...request.interests.map((item) => item)]));

  return {
    destination: place.name,
    summary: `${request.days}-day ${request.style.toLowerCase()} trip to ${place.name} with a ${request.budget.toLowerCase()} budget.`,
    bestFor: interests,
    totalCost: formatBudget(request.days, request.budget),
    budgetBreakdown: buildBudgetBreakdown(request.days, request.budget),
    itinerary: buildItinerary(place, request),
    chatSuggestions: [
      `Make the trip more ${request.style.toLowerCase()}.`,
      place.state ? `Add more food stops in ${place.state}.` : `Add more local food stops.`,
      `Keep this plan within a ${request.budget.toLowerCase()} budget.`,
      `Suggest a slower pace for day 2.`
    ]
  };
}

export function answerTripQuestion(request: TripPlannerRequest, question: string, plan: TripPlan): string {
  const normalized = question.trim().toLowerCase();
  if (!normalized) return 'Ask me about itinerary, budget, stays, food, or pace.';

  if (normalized.includes('budget')) {
    return `For ${request.days} days in ${plan.destination}, expect around ${plan.totalCost} overall, with the stay usually taking the largest share.`;
  }

  if (normalized.includes('stay') || normalized.includes('hotel')) {
    return `For ${plan.destination}, I would keep the stay close to the main attractions so daily travel stays simple and affordable.`;
  }

  if (normalized.includes('food') || normalized.includes('eat')) {
    return `Look for local specialties in ${plan.destination} and keep one meal each day flexible for regional dishes.`;
  }

  if (normalized.includes('day') || normalized.includes('itinerary')) {
    return `The plan starts gently on day 1, keeps the middle days active, and leaves the last day open for a relaxed finish.`;
  }

  return `I can refine that for ${plan.destination}. Try asking about budget, food, stays, or a slower/faster pace.`;
}

export function createPlannerGreeting(plan: TripPlan): TravelChatMessage {
  return {
    id: 'assistant-greeting',
    role: 'assistant',
    content: `Your ${plan.destination} plan is ready. Ask me to refine budget, food, stays, or pacing.`
  };
}
