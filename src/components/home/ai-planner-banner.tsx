import Link from 'next/link';

export function AiPlannerBanner() {
  return (
    <div className="rounded-3xl border border-dashed border-[#c8d7f2] bg-[#eff6ff] p-6">
      <p className="text-sm uppercase tracking-[0.3em] text-[#1d4ed8]">AI Trip Planner</p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900">Build itineraries, budgets, and trip chat.</h2>
      <p className="mt-2 max-w-3xl text-slate-700">
        Generate a plan from a destination, then refine it with a lightweight travel chat.
      </p>
      <Link
        href="/planner"
        className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#1d4ed8] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1e40af]"
      >
        Open planner
      </Link>
    </div>
  );
}
