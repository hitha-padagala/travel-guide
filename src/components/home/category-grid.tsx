import type { Category } from '@/types/travel';

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {categories.map((category, index) => (
        <div
          key={category.name}
          className="animate-fade-up"
          style={{ animationDelay: `${Math.min((index + 1) * 100, 500)}ms` }}
        >
          <div className="overflow-hidden rounded-3xl border border-[#c8d7f2] bg-white/90 shadow-[0_20px_60px_rgba(29,78,216,0.08)] transition duration-300 hover:-translate-y-1 hover:bg-[#eff6ff]">
            <div className="relative h-44 overflow-hidden">
              <img
                src={category.image ?? 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21'}
                alt={category.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/10 to-transparent" />
              <div className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/90 px-3 py-1 text-xs font-medium text-[#1d4ed8] backdrop-blur">
                {category.icon}
              </div>
              <div className="absolute inset-x-4 bottom-4">
                <h3 className="text-lg font-semibold text-white">{category.name}</h3>
              </div>
            </div>
            <div className="p-5">
              <p className="text-sm leading-6 text-slate-700">{category.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
