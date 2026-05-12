export function Card({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-[#c8d7f2] bg-white/90 p-5 transition duration-300 hover:-translate-y-1 hover:bg-[#eff6ff] hover:shadow-[0_20px_60px_rgba(29,78,216,0.08)]">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-700">{description}</p>
    </div>
  );
}
