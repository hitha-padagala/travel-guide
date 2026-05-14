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

export function lookupPlace(destination: string) {
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
  const place = lookupPlace(destination);
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

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const r = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return 2 * r * Math.asin(Math.sqrt(a));
}

function resolveDeparturePlace(departureCity?: string) {
  if (!departureCity) return null;
  return resolvePlace(departureCity);
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

function buildBudgetBreakdown(days: number, budget: string, destination: Place, departure?: Place | null, transport?: TripPlannerRequest['transport']): TripBudgetItem[] {
  const factor = budget === 'Low' ? 0.7 : budget === 'High' ? 1.4 : budget === 'Flexible' ? 1 : 0.9;
  const travelMultiplier =
    departure && destination.latitude && destination.longitude && departure.latitude && departure.longitude
      ? Math.max(1, Math.min(2.5, haversineKm(departure.latitude, departure.longitude, destination.latitude, destination.longitude) / 500))
      : 1;
  const transportMultiplier = transport === 'Plane' ? 1.6 : transport === 'Car' ? 0.9 : 0.75;
  return [
    {
      label: 'Travel expenditure',
      amount: `₹${Math.round(3200 * factor * travelMultiplier * transportMultiplier).toLocaleString('en-IN')}`,
      note: departure ? `Intercity travel from ${departure.name} by ${transport ?? 'train'}` : `Intercity travel to the destination by ${transport ?? 'train'}`
    },
    { label: 'Stay', amount: `₹${Math.round(2200 * days * factor).toLocaleString('en-IN')}`, note: 'Comfortable stay estimate' },
    { label: 'Food', amount: `₹${Math.round(900 * days * factor).toLocaleString('en-IN')}`, note: 'Meals and snacks' },
    { label: 'Local travel', amount: `₹${Math.round(700 * days * factor).toLocaleString('en-IN')}`, note: 'Taxis, autos, and transfers' },
    { label: 'Activities', amount: `₹${Math.round(800 * days * factor).toLocaleString('en-IN')}`, note: 'Entry fees and experiences' }
  ];
}

function buildItinerary(place: Place, request: TripPlannerRequest): TripPlanDay[] {
  const attractionNames = place.nearbyAttractions.length ? place.nearbyAttractions : [place.whyFamous, place.bestTimeToVisit].filter(Boolean);
  const firstAttraction = attractionNames[0] ?? place.name;
  const secondAttraction = attractionNames[1] ?? firstAttraction;
  const thirdAttraction = attractionNames[2] ?? secondAttraction;
  const transport = request.transport ?? 'Train';
  const styleHint =
    request.style === 'Food & Culture'
      ? 'food trail'
      : request.style === 'Adventure'
      ? 'active exploration'
      : request.style === 'Religious'
      ? 'pilgrimage rhythm'
      : request.style === 'Family'
      ? 'family-friendly pace'
      : 'flexible sightseeing';

  return Array.from({ length: request.days }, (_, index) => {
    const day = index + 1;
    const focus =
      day === 1
        ? `Start with ${firstAttraction} and an easy orientation walk around ${place.name}.`
        : day === request.days
        ? `Wrap up with a slower day focused on ${thirdAttraction} and a relaxed finish.`
        : `Spend the day moving through ${secondAttraction} and nearby local experiences.`;

    return {
      day,
      title:
        day === 1
          ? `${transport} arrival and ${place.category.toLowerCase()} intro`
          : day === request.days
          ? `Wrap-up and ${styleHint}`
          : `${transport} + ${styleHint} day ${day}`,
      morning:
        day === 1
          ? transport === 'Plane'
            ? `Land, check in, and take it easy before heading to ${firstAttraction}.`
            : transport === 'Car'
            ? `Drive in, rest, and explore ${firstAttraction}.`
            : `Arrive by train, settle in, and explore ${firstAttraction}.`
          : transport === 'Plane'
          ? `Start light after the flight and focus on ${day % 2 === 0 ? secondAttraction : firstAttraction}.`
          : transport === 'Car'
          ? `Use the road trip flexibility to start with ${day % 2 === 0 ? secondAttraction : firstAttraction}.`
          : `Use the train-friendly pace to start with ${day % 2 === 0 ? secondAttraction : firstAttraction}.`,
      afternoon: focus,
      evening:
        request.style === 'Food & Culture'
          ? `End with a local dinner and a short ${place.state ? place.state : 'city'} market walk.`
          : request.style === 'Adventure'
          ? 'Enjoy a relaxed dinner and recharge for the next day.'
          : transport === 'Plane'
          ? 'Keep the evening light after the flight and settle into the hotel.'
          : transport === 'Car'
          ? 'Enjoy a relaxed dinner and a comfortable road-trip finish.'
          : 'Enjoy a relaxed dinner and a short evening stroll.',
      staySuggestion: place.state ? `${place.state} base near ${place.name}` : `Stay near the main area of ${place.name}`,
      foodSuggestion:
        request.style === 'Food & Culture'
          ? `Prioritize ${firstAttraction} area specialties and signature snacks.`
          : transport === 'Plane'
          ? `Pick a convenient restaurant near the hotel after arrival.`
          : transport === 'Car'
          ? `Pick a route-friendly stop close to ${day % 2 === 0 ? secondAttraction : firstAttraction}.`
          : `Pick a popular nearby restaurant or cafe close to ${day % 2 === 0 ? secondAttraction : firstAttraction}.`
    };
  });
}

export async function generateTripPlan(request: TripPlannerRequest): Promise<TripPlan> {
  return generateTripPlanFallback(request);
}

function generateTripPlanFallback(request: TripPlannerRequest): TripPlan {
  const place = resolvePlace(request.destination);
  const departure = resolveDeparturePlace(request.departureCity);
  const interests = place.state ? matchingInterests(place, request.interests) : Array.from(new Set([request.style, ...request.interests.map((item) => item)]));
  const budgetBreakdown = buildBudgetBreakdown(request.days, request.budget, place, departure, request.transport);
  const totalCost = budgetBreakdown
    .map((item) => Number(item.amount.replace(/[^\d]/g, '')))
    .reduce((sum, value) => sum + value, 0);
  const travelerMultiplier = Math.max(1, request.travelers);
  const scaledBreakdown = budgetBreakdown.map((item) => ({
    ...item,
    amount: `₹${Math.round(Number(item.amount.replace(/[^\d]/g, '')) * travelerMultiplier).toLocaleString('en-IN')}`
  }));
  const scaledTotalCost = scaledBreakdown
    .map((item) => Number(item.amount.replace(/[^\d]/g, '')))
    .reduce((sum, value) => sum + value, 0);
  const suggestedPlaces = place.nearbyAttractions.length
    ? place.nearbyAttractions.slice(0, 5)
    : [place.whyFamous, place.bestTimeToVisit].filter(Boolean).slice(0, 3);

  return {
    destination: place.name,
    state: place.state || 'Custom destination',
    category: place.state ? place.category : 'Custom',
    bestTimeToVisit: place.bestTimeToVisit,
    nearbyAttractions: place.nearbyAttractions,
    suggestedPlaces,
    summary: `${request.days}-day ${request.style.toLowerCase()} trip to ${place.name} with a ${request.budget.toLowerCase()} budget.`,
    bestFor: interests,
    totalCost: `₹${scaledTotalCost.toLocaleString('en-IN')}`,
    budgetBreakdown: scaledBreakdown,
    itinerary: buildItinerary(place, request),
    chatSuggestions: [
      `Make the trip more ${request.style.toLowerCase()}.`,
      `Optimize this for ${request.transport ?? 'Train'} travel.`,
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
