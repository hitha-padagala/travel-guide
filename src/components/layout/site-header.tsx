'use client';

import Link from 'next/link';
import { Compass, MoonStar } from 'lucide-react';
import { useTheme } from '@/context/theme-context';
import { Button } from '@/components/ui/button';

export function SiteHeader() {
  const { toggleTheme } = useTheme();
  return (
    <header className="sticky top-0 z-50 border-b border-emerald-200 bg-[#f4f8ef]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <Compass className="h-5 w-5 text-emerald-700" />
            TravelNest
          </Link>
        </div>
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/saved" className="text-sm text-slate-700 hover:text-slate-900">
            Travel Shortlist
          </Link>
          <Button variant="outline" onClick={toggleTheme}>
            <MoonStar className="mr-2 h-4 w-4" /> Theme
          </Button>
        </nav>
      </div>
    </header>
  );
}
