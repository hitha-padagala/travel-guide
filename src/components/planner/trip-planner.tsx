'use client';

import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Bot,
  CalendarDays,
  Clock3,
  Coins,
  Luggage,
  MapPinned,
  MessageCircle,
  MessageSquare,
  Sparkles,
  Star,
  Ticket,
  UtensilsCrossed,
  WandSparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { answerTripQuestion, createPlannerGreeting } from '@/services/ai-trip-planner';
import type { TripPlan, TripPlannerRequest, TravelChatMessage } from '@/types/travel';

const defaultRequest: TripPlannerRequest = {
  destination: 'Hyderabad',
  days: 3,
  budget: 'Medium',
  interests: ['food'],
  style: 'Food & Culture',
  travelers: 2,
  departureCity: 'Bengaluru'
};

export function TripPlanner() {
  const [request, setRequest] = useState<TripPlannerRequest>(defaultRequest);
  const [plan, setPlan] = useState<TripPlan | null>(null);
  const [messages, setMessages] = useState<TravelChatMessage[]>([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const destinationStatus =
    request.destination.trim().length === 0
      ? { tone: 'idle' as const, text: 'Enter a destination to generate a plan.' }
      : { tone: 'success' as const, text: 'AI will generate destination-specific places and itinerary.' };

  const departureStatus =
    request.departureCity?.trim().length === 0
      ? { tone: 'idle' as const, text: 'Enter a departure city for route-based costs.' }
      : { tone: 'success' as const, text: 'AI will adapt travel cost for this route.' };

  async function handleGenerate() {
    if (!request.destination.trim()) {
      return;
    }

    setLoading(true);
    const response = await fetch('/api/planner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'plan', trip: request })
    });
    const data = (await response.json()) as { plan?: TripPlan };
    const nextPlan = data.plan ?? null;
    if (!nextPlan) {
      setLoading(false);
      return;
    }
    setPlan(nextPlan);
    setMessages([createPlannerGreeting(nextPlan)]);
    setLoading(false);
  }

  function sendQuestion() {
    if (!plan || !question.trim()) return;
    const ask = async () => {
      const userMessage: TravelChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: question.trim()
      };
      setMessages((current) => [...current, userMessage]);
      const response = await fetch('/api/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'chat', trip: request, question: question.trim(), plan })
      });
      const data = (await response.json()) as { answer?: string };
      const assistantMessage: TravelChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.answer ?? answerTripQuestion(request, question, plan)
      };
      setMessages((current) => [...current, assistantMessage]);
      setQuestion('');
    };

    void ask();
  }

  const suggestions = useMemo(() => plan?.chatSuggestions ?? [], [plan]);
  const dynamicSuggestions = useMemo(() => {
    if (!plan) return [];

    const placeName = plan.destination;
    const city = plan.state || placeName;
    const firstAttraction = plan.nearbyAttractions[0] ?? placeName;
    const secondAttraction = plan.nearbyAttractions[1] ?? firstAttraction;

    return [
      ...plan.chatSuggestions,
      `Make this ${request.style.toLowerCase()} trip more focused on ${firstAttraction}.`,
      `Add food stops around ${city}.`,
      `Adjust the plan for a ${request.budget.toLowerCase()} budget.`,
      `Suggest a slower day around ${secondAttraction}.`
    ].filter(Boolean).slice(0, 5);
  }, [plan, request.budget, request.style]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[2rem] border border-[#c8d7f2] bg-gradient-to-br from-white via-[#f7fbff] to-[#eef4ff] shadow-[0_24px_80px_rgba(29,78,216,0.10)]">
        <div className="border-b border-[#d8e3f7] px-6 py-6 sm:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#c8d7f2] bg-white px-3 py-1 text-xs uppercase tracking-[0.25em] text-[#1d4ed8]">
              <WandSparkles className="h-3.5 w-3.5" />
              AI Trip Planner
            </span>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">Build a trip that changes by destination</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              The plan, budget, and chat are generated for your route, budget, style, and days. Each itinerary is different instead of repeating the same template.
            </p>
          </div>
        </div>

        <div className="grid gap-6 px-6 py-6 lg:grid-cols-[440px_minmax(0,1fr)] lg:items-start lg:px-8">
          <section className="h-fit self-start justify-self-start space-y-4 rounded-3xl border border-[#c8d7f2] bg-white p-4 shadow-[0_20px_60px_rgba(29,78,216,0.08)] sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-[#1d4ed8]">Trip inputs</p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-950">Tell the planner what you want</h2>
              </div>
              <span className="whitespace-nowrap rounded-full border border-[#c8d7f2] bg-[#eff6ff] px-3 py-1 text-[11px] font-medium text-[#1d4ed8]">
                AI generated
              </span>
            </div>

            <div className="grid gap-3">
              <Field label="Destination">
                <Input
                  value={request.destination}
                  onChange={(event) => setRequest((current) => ({ ...current, destination: event.target.value }))}
                />
                <FieldHint tone={destinationStatus.tone}>{destinationStatus.text}</FieldHint>
              </Field>
              <Field label="From">
                <Input
                  value={request.departureCity ?? ''}
                  onChange={(event) => setRequest((current) => ({ ...current, departureCity: event.target.value }))}
                />
                <FieldHint tone={departureStatus.tone}>{departureStatus.text}</FieldHint>
              </Field>
              <Field label="Days">
                <Select value={String(request.days)} onChange={(event) => setRequest((current) => ({ ...current, days: Number(event.target.value) }))}>
                  {[2, 3, 4, 5, 6].map((day) => (
                    <option key={day} value={day}>
                      {day} days
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Budget">
                <Select value={request.budget} onChange={(event) => setRequest((current) => ({ ...current, budget: event.target.value as TripPlannerRequest['budget'] }))}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Flexible">Flexible</option>
                </Select>
              </Field>
              <Field label="Travel style">
                <Select value={request.style} onChange={(event) => setRequest((current) => ({ ...current, style: event.target.value as TripPlannerRequest['style'] }))}>
                  <option value="Family">Family</option>
                  <option value="Solo">Solo</option>
                  <option value="Couple">Couple</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Religious">Religious</option>
                  <option value="Food & Culture">Food & Culture</option>
                </Select>
              </Field>
              <Field label="Transport">
                <Select
                  value={request.transport ?? 'Train'}
                  onChange={(event) => setRequest((current) => ({ ...current, transport: event.target.value as TripPlannerRequest['transport'] }))}
                >
                  <option value="Car">Car</option>
                  <option value="Train">Train</option>
                  <option value="Plane">Plane</option>
                </Select>
              </Field>
              <Field label="Travelers">
                <Select value={String(request.travelers)} onChange={(event) => setRequest((current) => ({ ...current, travelers: Number(event.target.value) }))}>
                  {[1, 2, 3, 4, 5, 6].map((count) => (
                    <option key={count} value={count}>
                      {count}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            <Field label="Interests">
              <Textarea
                value={request.interests.join(', ')}
                onChange={(event) =>
                  setRequest((current) => ({
                    ...current,
                    interests: event.target.value
                      .split(',')
                      .map((value) => value.trim())
                      .filter(Boolean)
                  }))
                }
                placeholder="food, temples, history"
              />
            </Field>

            <Button onClick={handleGenerate} className="w-full" disabled={loading || !request.destination.trim()}>
              <Sparkles className="mr-2 h-4 w-4" />
              {loading ? 'Generating plan...' : 'Generate trip plan'}
            </Button>

            {plan ? (
              <div className="grid gap-3 rounded-3xl border border-[#c8d7f2] bg-[#f8fbff] p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-950">Trip snapshot</h3>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#c8d7f2] bg-white px-3 py-1 text-[11px] font-medium text-[#1d4ed8]">
                    <WandSparkles className="h-3.5 w-3.5" />
                    AI generated
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <MiniCard icon={MapPinned} title="Destination" value={plan.destination} />
                  <MiniCard icon={Luggage} title="Style" value={request.style} />
                  <MiniCard icon={UtensilsCrossed} title="Food focus" value={request.interests.join(', ') || 'General'} />
                  <MiniCard icon={CalendarDays} title="Travelers" value={`${request.travelers}`} />
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <MiniCard icon={Star} title="Category" value={plan.category} />
                  <MiniCard icon={Clock3} title="Best time" value={plan.bestTimeToVisit} />
                  <MiniCard icon={Ticket} title="State" value={plan.state} />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <MiniCard icon={MapPinned} title="Top spot" value={plan.nearbyAttractions[0] ?? plan.destination} />
                  <MiniCard icon={Coins} title="Trip cost" value={plan.totalCost} />
                </div>
                <div className="rounded-2xl border border-[#c8d7f2] bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#1d4ed8]">Suggested places</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(plan.suggestedPlaces ?? plan.nearbyAttractions).slice(0, 5).map((item) => (
                      <span key={item} className="rounded-full border border-[#c8d7f2] bg-[#eff6ff] px-3 py-1 text-xs text-slate-700">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-[#c8d7f2] bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#1d4ed8]">Transport</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {request.transport ?? 'Train'} travel is shaping this itinerary, so arrival pace and day one timing are adjusted for the route.
                  </p>
                </div>
                <div className="rounded-2xl border border-[#c8d7f2] bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#1d4ed8]">Quick note</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    This plan is tailored to your destination, departure city, and budget, so travel expenditure shifts with the route.
                  </p>
                  {plan.nearbyAttractions.length ? (
                    <div className="mt-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-[#1d4ed8]">Nearby attractions</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {plan.nearbyAttractions.slice(0, 3).map((item) => (
                          <span key={item} className="rounded-full border border-[#c8d7f2] bg-[#eff6ff] px-3 py-1 text-xs text-slate-700">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </section>

          <section className="space-y-5">
            {plan ? (
              <>
                <div className="overflow-hidden rounded-3xl border border-[#c8d7f2] bg-white shadow-[0_18px_50px_rgba(29,78,216,0.06)]">
                  <div className="bg-gradient-to-r from-[#1d4ed8] to-[#4f7cff] px-6 py-5 text-white">
                    <p className="text-sm uppercase tracking-[0.25em] text-white/80">Trip summary</p>
                    <h2 className="mt-2 text-2xl font-semibold">{plan.destination}</h2>
                    <p className="mt-2 text-sm leading-6 text-white/90">{plan.summary}</p>
                  </div>
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-wrap gap-2">
                      {plan.bestFor.map((item) => (
                        <span key={item} className="rounded-full border border-[#c8d7f2] bg-[#eff6ff] px-3 py-1 text-xs text-[#1d4ed8]">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <MiniCard icon={Coins} title="Budget" value={plan.totalCost} />
                  <MiniCard icon={CalendarDays} title="Days" value={`${request.days}`} />
                </div>
                <div className="rounded-3xl border border-[#c8d7f2] bg-white p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-slate-950">Places from AI</h3>
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#c8d7f2] bg-[#eff6ff] px-3 py-1 text-xs text-[#1d4ed8]">
                      <WandSparkles className="h-3.5 w-3.5" />
                      Dynamic
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(plan.suggestedPlaces ?? plan.nearbyAttractions).slice(0, 5).map((item) => (
                      <span key={item} className="rounded-full border border-[#c8d7f2] bg-[#eff6ff] px-3 py-1 text-xs text-[#1d4ed8]">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-[#c8d7f2] bg-white p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-slate-950">Budget breakdown</h3>
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#c8d7f2] bg-[#eff6ff] px-3 py-1 text-xs text-[#1d4ed8]">
                      <Coins className="h-3.5 w-3.5" />
                      Dynamic
                    </span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {plan.budgetBreakdown.map((item) => (
                      <div key={item.label} className="flex items-center justify-between rounded-2xl border border-[#c8d7f2] bg-[#eff6ff] px-4 py-3">
                        <div>
                          <p className="font-medium text-slate-950">{item.label}</p>
                          <p className="text-xs text-slate-500">{item.note}</p>
                        </div>
                        <p className="font-semibold text-slate-900">{item.amount}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-[#c8d7f2] bg-white p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-slate-950">Itinerary</h3>
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#c8d7f2] bg-[#eff6ff] px-3 py-1 text-xs text-[#1d4ed8]">
                      <ArrowRight className="h-3.5 w-3.5" />
                      AI planned
                    </span>
                  </div>
                  <div className="mt-4 space-y-4">
                    {plan.itinerary.map((day) => (
                      <div key={day.day} className="rounded-2xl border border-[#c8d7f2] bg-[#f8fbff] p-4 shadow-[0_10px_30px_rgba(29,78,216,0.04)]">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.25em] text-[#1d4ed8]">Day {day.day}</p>
                            <h4 className="mt-1 text-base font-semibold text-slate-950">{day.title}</h4>
                          </div>
                          <span className="rounded-full border border-[#c8d7f2] bg-white px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                            Generated
                          </span>
                        </div>
                        <div className="mt-3 grid gap-2 text-sm leading-6 text-slate-700">
                          <p>
                            <strong>Morning:</strong> {day.morning}
                          </p>
                          <p>
                            <strong>Afternoon:</strong> {day.afternoon}
                          </p>
                          <p>
                            <strong>Evening:</strong> {day.evening}
                          </p>
                          <p>
                            <strong>Stay:</strong> {day.staySuggestion}
                          </p>
                          <p>
                            <strong>Food:</strong> {day.foodSuggestion}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-[#c8d7f2] bg-white p-5 sm:p-6 shadow-[0_18px_50px_rgba(29,78,216,0.06)]">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-slate-950">Travel chat</h3>
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#c8d7f2] bg-[#eff6ff] px-3 py-1 text-xs text-[#1d4ed8]">
                      <MessageSquare className="h-3.5 w-3.5" />
                      Ask anything
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {dynamicSuggestions.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setQuestion(item)}
                        className="rounded-full border border-[#c8d7f2] bg-[#eff6ff] px-3 py-1 text-xs text-[#1d4ed8] transition hover:bg-white"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 h-64 space-y-3 overflow-y-auto rounded-2xl border border-[#c8d7f2] bg-[#f8fbff] p-4">
                    {messages.length === 0 ? (
                      <div className="space-y-2">
                        <p className="text-sm text-slate-500">Ask about food, budget, pace, or hotel choices.</p>
                        {plan ? (
                          <div className="rounded-2xl border border-dashed border-[#c8d7f2] bg-white px-4 py-3">
                            <p className="text-xs uppercase tracking-[0.2em] text-[#1d4ed8]">AI ready</p>
                            <p className="mt-1 text-sm text-slate-700">
                              Try asking about {plan.destination}, {plan.nearbyAttractions[0] ?? 'local spots'}, or the best way to stretch your budget.
                            </p>
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                            message.role === 'user' ? 'ml-auto bg-[#1d4ed8] text-white' : 'bg-white text-slate-800'
                          }`}
                        >
                          {message.content}
                        </div>
                      ))
                    )}
                  </div>
                  <div className="mt-4 flex gap-3">
                    <Input
                      value={question}
                      onChange={(event) => setQuestion(event.target.value)}
                      placeholder={plan ? `Ask about ${plan.destination}` : 'Ask anything about the trip'}
                    />
                    <Button type="button" onClick={sendQuestion}>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Ask
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-3xl border border-dashed border-[#c8d7f2] bg-white p-10 text-center">
                <Bot className="mx-auto h-10 w-10 text-[#1d4ed8]" />
                <h2 className="mt-4 text-2xl font-semibold text-slate-950">Your plan will appear here</h2>
                <p className="mt-2 text-sm text-slate-600">Generate a trip to see itinerary, budget, and travel chat.</p>
              </div>
            )}
          </section>
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-2 text-sm text-slate-700">
      <span className="block text-xs uppercase tracking-[0.2em] text-[#1d4ed8]">{label}</span>
      {children}
    </label>
  );
}

function FieldHint({
  tone,
  children
}: {
  tone: 'idle' | 'success' | 'error';
  children: string;
}) {
  const styles =
    tone === 'success'
      ? 'text-emerald-600'
      : tone === 'error'
        ? 'text-rose-600'
        : 'text-slate-500';

  return <p className={`text-xs leading-5 ${styles}`}>{children}</p>;
}

function MiniCard({
  icon: Icon,
  title,
  value
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#c8d7f2] bg-white p-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-[#1d4ed8]" />
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{title}</p>
      </div>
      <p className="mt-2 text-base font-semibold leading-6 text-slate-950 sm:text-lg">{value}</p>
    </div>
  );
}
