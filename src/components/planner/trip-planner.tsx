'use client';

import { useMemo, useState } from 'react';
import { Bot, CalendarDays, Coins, MessageCircle, Sparkles } from 'lucide-react';
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

  async function handleGenerate() {
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="space-y-6 rounded-3xl border border-[#c8d7f2] bg-white p-6 shadow-[0_20px_60px_rgba(29,78,216,0.08)]">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-[#1d4ed8]">AI trip planner</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">Build a trip in seconds</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Generate an itinerary, budget estimate, and trip chat from one clean form.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Destination">
              <Input value={request.destination} onChange={(event) => setRequest((current) => ({ ...current, destination: event.target.value }))} />
            </Field>
            <Field label="From">
              <Input value={request.departureCity ?? ''} onChange={(event) => setRequest((current) => ({ ...current, departureCity: event.target.value }))} />
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

          <Button onClick={handleGenerate} className="w-full" disabled={loading}>
            <Sparkles className="mr-2 h-4 w-4" />
            {loading ? 'Generating plan...' : 'Generate trip plan'}
          </Button>
        </section>

        <section className="space-y-6">
          {plan ? (
            <>
              <div className="rounded-3xl border border-[#c8d7f2] bg-[#f8fbff] p-6">
                <p className="text-sm uppercase tracking-[0.25em] text-[#1d4ed8]">Trip summary</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">{plan.destination}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-700">{plan.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {plan.bestFor.map((item) => (
                    <span key={item} className="rounded-full border border-[#c8d7f2] bg-white px-3 py-1 text-xs text-[#1d4ed8]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <MiniCard icon={Coins} title="Budget" value={plan.totalCost} />
                <MiniCard icon={CalendarDays} title="Days" value={`${request.days}`} />
              </div>

              <div className="rounded-3xl border border-[#c8d7f2] bg-white p-6">
                <h3 className="text-lg font-semibold text-slate-950">Budget breakdown</h3>
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

              <div className="rounded-3xl border border-[#c8d7f2] bg-white p-6">
                <h3 className="text-lg font-semibold text-slate-950">Itinerary</h3>
                <div className="mt-4 space-y-4">
                  {plan.itinerary.map((day) => (
                    <div key={day.day} className="rounded-2xl border border-[#c8d7f2] bg-[#f8fbff] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.25em] text-[#1d4ed8]">Day {day.day}</p>
                          <h4 className="mt-1 text-base font-semibold text-slate-950">{day.title}</h4>
                        </div>
                      </div>
                      <div className="mt-3 grid gap-3 text-sm text-slate-700">
                        <p><strong>Morning:</strong> {day.morning}</p>
                        <p><strong>Afternoon:</strong> {day.afternoon}</p>
                        <p><strong>Evening:</strong> {day.evening}</p>
                        <p><strong>Stay:</strong> {day.staySuggestion}</p>
                        <p><strong>Food:</strong> {day.foodSuggestion}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-[#c8d7f2] bg-white p-6">
                <h3 className="text-lg font-semibold text-slate-950">Travel chat</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {suggestions.map((item) => (
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
                    <p className="text-sm text-slate-500">Ask about food, budget, pace, or hotel choices.</p>
                  ) : (
                    messages.map((message) => (
                      <div key={message.id} className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                        message.role === 'user' ? 'ml-auto bg-[#1d4ed8] text-white' : 'bg-white text-slate-800'
                      }`}>
                        {message.content}
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-4 flex gap-3">
                  <Input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask anything about the trip" />
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
      <p className="mt-2 text-lg font-semibold text-slate-950">{value}</p>
    </div>
  );
}
