import { NextResponse } from 'next/server';
import { answerTripQuestion, generateTripPlan } from '@/services/ai-trip-planner';
import type { TripPlannerRequest, TripPlan } from '@/types/travel';

async function generateWithOpenAI(request: TripPlannerRequest): Promise<TripPlan> {
  const model = process.env.OPENAI_TRIP_PLANNER_MODEL ?? 'gpt-5.4-mini';
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content:
            'You are a travel planner. Return only valid JSON. Make the itinerary specific to the destination, departure city, budget, travel style, and transport. If the destination is not in a static catalog, still generate a realistic custom plan. Invent destination-specific suggested places and nearby attractions based on the city or town, instead of relying on app data. Vary costs and activities by trip. Do not use the same budget amount for every category. Ensure each day is meaningfully different. Include suggestedPlaces as a short list of the most relevant places for the requested destination.'
        },
        {
          role: 'user',
          content: JSON.stringify({
            destination: request.destination,
            days: request.days,
            budget: request.budget,
            interests: request.interests,
            style: request.style,
            travelers: request.travelers,
            departureCity: request.departureCity,
            transport: request.transport
          })
        }
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' }
    })
  });

  if (!response.ok) return generateTripPlan(request);

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) return generateTripPlan(request);

  try {
    return normalizePlan(JSON.parse(content) as Partial<TripPlan>, request);
  } catch {
    return generateTripPlan(request);
  }
}

function normalizePlan(plan: Partial<TripPlan>, request: TripPlannerRequest): TripPlan {
  const fallback = {
    destination: request.destination,
    state: '',
    category: 'Custom' as const,
    bestTimeToVisit: 'Varies',
    nearbyAttractions: [],
    suggestedPlaces: [],
    summary: '',
    bestFor: [],
    totalCost: '',
    budgetBreakdown: [],
    itinerary: [],
    chatSuggestions: []
  };

  const itinerary = Array.isArray(plan.itinerary) && plan.itinerary.length ? plan.itinerary : fallback.itinerary;
  const budgetBreakdown = Array.isArray(plan.budgetBreakdown) && plan.budgetBreakdown.length ? plan.budgetBreakdown : fallback.budgetBreakdown;

  return {
    destination: plan.destination || fallback.destination,
    state: plan.state || fallback.state,
    category: plan.category || fallback.category,
    bestTimeToVisit: plan.bestTimeToVisit || fallback.bestTimeToVisit,
    nearbyAttractions: Array.isArray(plan.nearbyAttractions) ? plan.nearbyAttractions.slice(0, 5) : fallback.nearbyAttractions,
    suggestedPlaces: Array.isArray((plan as { suggestedPlaces?: string[] }).suggestedPlaces)
      ? (plan as { suggestedPlaces?: string[] }).suggestedPlaces!.slice(0, 5)
      : fallback.suggestedPlaces,
    summary: plan.summary || `${request.days}-day ${request.style.toLowerCase()} trip to ${request.destination}.`,
    bestFor: Array.isArray(plan.bestFor) ? Array.from(new Set(plan.bestFor)).slice(0, 5) : fallback.bestFor,
    totalCost: plan.totalCost || 'Varies',
    budgetBreakdown: budgetBreakdown.map((item, index) => ({
      label: item.label || `Cost ${index + 1}`,
      amount: item.amount || 'Varies',
      note: item.note || 'Custom estimate'
    })),
    itinerary: itinerary.map((day, index) => ({
      day: day.day || index + 1,
      title: day.title || `Day ${index + 1}`,
      morning: day.morning || 'Morning plan varies by destination.',
      afternoon: day.afternoon || 'Afternoon plan varies by destination.',
      evening: day.evening || 'Evening plan varies by destination.',
      staySuggestion: day.staySuggestion || 'Stay near the main area.',
      foodSuggestion: day.foodSuggestion || 'Choose a nearby local restaurant.'
    })),
    chatSuggestions: Array.isArray(plan.chatSuggestions) ? plan.chatSuggestions.slice(0, 5) : fallback.chatSuggestions
  };
}

export async function POST(request: Request) {
  const body = (await request.json()) as { mode?: 'plan' | 'chat'; trip: TripPlannerRequest; question?: string; plan?: TripPlan };

  if (body.mode === 'chat') {
    if (!body.question || !body.plan) {
      return NextResponse.json({ error: 'Missing question or plan' }, { status: 400 });
    }

    const answer = process.env.OPENAI_API_KEY
      ? await generateChatAnswer(body.trip, body.question, body.plan)
      : answerTripQuestion(body.trip, body.question, body.plan);
    return NextResponse.json({ answer });
  }

  const plan = process.env.OPENAI_API_KEY ? await generateWithOpenAI(body.trip) : await generateTripPlan(body.trip);
  return NextResponse.json({ plan });
}

async function generateChatAnswer(request: TripPlannerRequest, question: string, plan: TripPlan) {
  const model = process.env.OPENAI_TRIP_PLANNER_MODEL ?? 'gpt-5.4-mini';
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content:
            'You are a concise travel assistant. Answer the user question using the provided trip plan. Keep the answer practical and specific.'
        },
        {
          role: 'user',
          content: JSON.stringify({ trip: request, question, plan })
        }
      ],
      temperature: 0.7
    })
  });

  if (!response.ok) return answerTripQuestion(request, question, plan);

  const data = await response.json();
  const answer = data?.choices?.[0]?.message?.content;
  return answer?.trim() || answerTripQuestion(request, question, plan);
}
