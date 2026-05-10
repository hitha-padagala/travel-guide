import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { ThemeProvider } from '@/context/theme-context';
import { SavedPlacesProvider } from '@/context/saved-places-context';

export const metadata: Metadata = {
  title: 'TravelNest',
  description: 'AI-ready travel discovery platform for nearby places and future trip planning.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <SavedPlacesProvider>
            <div className="min-h-screen bg-hero-gradient text-slate-900">
              <SiteHeader />
              <main>{children}</main>
              <SiteFooter />
            </div>
          </SavedPlacesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
