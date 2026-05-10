import { Card } from '@/components/ui/card';
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
          <Card title={`${category.icon} ${category.name}`} description={category.description} />
        </div>
      ))}
    </div>
  );
}
