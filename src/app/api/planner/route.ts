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
          content: 'You are a travel planner. Return only valid JSON. Keep the plan practical, concise, and specific.'
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
            departureCity: request.departureCity
          })
        }
      ],
      temperature: 0.6,
      response_format: { type: 'json_object' }
    })
  });

  if (!response.ok) return generateTripPlan(request);

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) return generateTripPlan(request);

  try {
    return JSON.parse(content) as TripPlan;
  } catch {
    return generateTripPlan(request);
  }
}

export async function POST(request: Request) {
  const body = (await request.json()) as { mode?: 'plan' | 'chat'; trip: TripPlannerRequest; question?: string; plan?: TripPlan };

  if (body.mode === 'chat') {
    if (!body.question || !body.plan) {
      return NextResponse.json({ error: 'Missing question or plan' }, { status: 400 });
    }

    const answer = answerTripQuestion(body.trip, body.question, body.plan);
    return NextResponse.json({ answer });
  }

  const plan = process.env.OPENAI_API_KEY ? await generateWithOpenAI(body.trip) : await generateTripPlan(body.trip);
  return NextResponse.json({ plan });
}
