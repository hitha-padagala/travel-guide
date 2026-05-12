export function AiPlannerBanner() {
  return (
    <div className="rounded-3xl border border-dashed border-[#c8d7f2] bg-[#eff6ff] p-6">
      <p className="text-sm uppercase tracking-[0.3em] text-[#1d4ed8]">AI Trip Planner (Coming Soon)</p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900">Ready for itinerary generation, budget planning, and travel chat.</h2>
      <p className="mt-2 max-w-3xl text-slate-700">
        The architecture already separates place data, services, and UI so AI recommendations can be plugged in later without rewriting the app.
      </p>
    </div>
  );
}
