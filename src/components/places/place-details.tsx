'use client';

import { useEffect, useMemo, useState } from 'react';
import { Bookmark, BookmarkCheck, ChevronLeft, ChevronRight, Clock3, MapPinned, Sparkles, Star, Ticket } from 'lucide-react';
import type { Place } from '@/types/travel';
import { createGoogleMapsEmbedUrl } from '@/services/maps';
import { useSavedPlaces } from '@/context/saved-places-context';
import { Button } from '@/components/ui/button';
import { getEatRecommendations, getStayRecommendations } from '@/services/local-recommendations';

export function PlaceDetails({ place }: { place: Place }) {
  const mapUrl = createGoogleMapsEmbedUrl(place.latitude, place.longitude);
  const { isSaved, toggleSavedPlace } = useSavedPlaces();
  const [saved, setSaved] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const stays = getStayRecommendations(place);
  const eats = getEatRecommendations(place);
  const heroImages = useMemo(() => getHeroImages(place), [place]);

  useEffect(() => {
    setSaved(isSaved(place.id));
  }, [isSaved, place.id]);

  useEffect(() => {
    if (heroImages.length <= 1) return undefined;
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroImages.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [heroImages.length]);

  async function handleSaveToggle() {
    toggleSavedPlace(place.id);
    setSaved((current) => !current);
  }

  function goPrev() {
    setActiveSlide((current) => (current - 1 + heroImages.length) % heroImages.length);
  }

  function goNext() {
    setActiveSlide((current) => (current + 1) % heroImages.length);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[2rem] border border-[#c8d7f2] bg-white shadow-[0_30px_100px_rgba(29,78,216,0.10)]">
        <div className="relative isolate overflow-hidden">
          <div className="relative h-[26rem] bg-slate-950">
            {heroImages.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
                  index === activeSlide ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ backgroundImage: `url(${image})` }}
              />
            ))}
            
            <div className="absolute inset-0 flex items-end p-6 sm:p-8">
              <div className="max-w-3xl space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-[#bfd0f7] bg-[#eaf2ff] px-3 py-1 text-xs uppercase tracking-[0.25em] text-[#1d4ed8]">
                    {place.category}
                  </span>
                  <span className="flex items-center gap-1 rounded-full border border-[#c8d7f2] bg-white/85 px-3 py-1 text-sm text-[#1d4ed8] backdrop-blur">
                    <Star className="h-4 w-4" /> {place.rating}
                  </span>
                  <span className="rounded-full border border-[#c8d7f2] bg-white/85 px-3 py-1 text-sm text-slate-700 backdrop-blur">
                    {place.state}
                  </span>
                </div>
                <h1 className="text-4xl font-semibold text-white sm:text-5xl">{place.name}</h1>
                <p className="max-w-2xl text-base leading-7 text-stone-100 sm:text-lg">{place.shortDescription}</p>
                <div className="flex items-center justify-center gap-2">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setActiveSlide(index)}
                      className={`h-2.5 rounded-full transition-all ${
                        index === activeSlide ? 'w-8 bg-white' : 'w-2.5 bg-white/50 hover:bg-white/75'
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 p-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              <Button type="button" variant="outline" onClick={handleSaveToggle} className="w-fit">
                {saved ? <BookmarkCheck className="mr-2 h-4 w-4" /> : <Bookmark className="mr-2 h-4 w-4" />}
                {saved ? 'Saved' : 'Save place'}
              </Button>
              <div className="inline-flex items-center gap-2 rounded-xl border border-[#c8d7f2] bg-white px-4 py-2 text-sm text-slate-700">
                <MapPinned className="h-4 w-4 text-[#1d4ed8]" />
                Scenic travel highlight
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Info icon={Sparkles} label="Why it is famous" value={place.whyFamous} />
              <Info icon={Clock3} label="Best time to visit" value={place.bestTimeToVisit} />
              <Info icon={Clock3} label="Timings" value={place.timings} />
              <Info icon={Ticket} label="Entry fee" value={place.entryFee} />
            </div>
            <div className="rounded-3xl border border-[#c8d7f2] bg-white p-4">
              <h2 className="text-lg font-semibold text-slate-950">Nearby attractions</h2>
              <ul className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                {place.nearbyAttractions.map((item) => (
                  <li key={item} className="rounded-xl border border-[#c8d7f2] bg-[#eff6ff] px-3 py-2">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-[#c8d7f2] bg-white p-4">
              <h2 className="text-lg font-semibold text-slate-950">Map</h2>
              <iframe title={`${place.name} map`} src={mapUrl} className="mt-3 h-64 w-full rounded-2xl border border-[#c8d7f2]" loading="lazy" />
            </div>
          </div>
          <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="grid gap-4">
              <RecommendationList title="Best places to stay" items={stays} />
              <RecommendationList title="Best places to eat" items={eats} />
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

function RecommendationList({
  title,
  items
}: {
  title: string;
  items: { name: string; type: string; description: string }[];
}) {
  return (
    <div className="rounded-2xl border border-[#c8d7f2] bg-[#f8fbff] p-5">
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      <div className="mt-3 space-y-3">
        {items.map((item) => (
          <div key={item.name} className="rounded-xl border border-[#c8d7f2] bg-[#eff6ff] p-4">
            <p className="font-medium text-slate-950">{item.name}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-[#1d4ed8]">{item.type}</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Info({
  icon: Icon,
  label,
  value
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#c8d7f2] bg-white p-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-[#1d4ed8]" />
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      </div>
      <p className="mt-2 text-sm text-slate-700">{value}</p>
    </div>
  );
}

function getHeroImages(place: Place) {
  const imagesBySlug: Record<string, string[]> = {
    'hyderabad': [
      'https://images.unsplash.com/photo-1595658658481-d53d3f999875',
      'https://images.unsplash.com/photo-1604187351574-c75ca79f5807',
      'https://images.unsplash.com/photo-1624009062994-0c2a2d9f3f6e',
      'https://images.unsplash.com/photo-1548013146-72479768bada'
    ],
    'tirupati': [
      'https://images.unsplash.com/photo-1593691509543-c55fb32a5a5d',
      'https://images.unsplash.com/photo-1548013146-72479768bada',
      'https://images.unsplash.com/photo-1503264116251-35a269479413',
      'https://images.unsplash.com/photo-1524492449090-aaf5f2271f33'
    ],
    'hampi': [
      'https://images.unsplash.com/photo-1579684453423-f84349ef60b0',
      'https://images.unsplash.com/photo-1477587458883-47145ed94245',
      'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7',
      'https://images.unsplash.com/photo-1467269204594-9661b134dd2b'
    ],
    'jaipur': [
      'https://images.unsplash.com/photo-1477587458883-47145ed94245',
      'https://images.unsplash.com/photo-1599661046289-e31897846e41',
      'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7',
      'https://images.unsplash.com/photo-1519817650390-64a93db51149'
    ],
    'goa-beaches': [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206',
      'https://images.unsplash.com/photo-1493558103817-58b2924bce98',
      'https://images.unsplash.com/photo-1472396961693-142e6e269027'
    ],
    'manali': [
      'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      'https://images.unsplash.com/photo-1465311440653-ba9b1d9b0f5b',
      'https://images.unsplash.com/photo-1504198453319-5ce911bafcde'
    ],
    'varanasi': [
      'https://images.unsplash.com/photo-1548013146-72479768bada',
      'https://images.unsplash.com/photo-1593691509543-c55fb32a5a5d',
      'https://images.unsplash.com/photo-1524492449090-aaf5f2271f33',
      'https://images.unsplash.com/photo-1503264116251-35a269479413'
    ],
    'mysore': [
      'https://images.unsplash.com/photo-1590050752117-238cb6856c9d',
      'https://images.unsplash.com/photo-1477587458883-47145ed94245',
      'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7',
      'https://images.unsplash.com/photo-1599661046289-e31897846e41'
    ],
    'ooty': [
      'https://images.unsplash.com/photo-1465311440653-ba9b1d9b0f5b',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e',
      'https://images.unsplash.com/photo-1504198453319-5ce911bafcde'
    ],
    'amritsar': [
      'https://images.unsplash.com/photo-1582553382062-3c8b9b3a3b62',
      'https://images.unsplash.com/photo-1548013146-72479768bada',
      'https://images.unsplash.com/photo-1524492449090-aaf5f2271f33',
      'https://images.unsplash.com/photo-1503264116251-35a269479413'
    ],
    'udaipur': [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41',
      'https://images.unsplash.com/photo-1477587458883-47145ed94245',
      'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7',
      'https://images.unsplash.com/photo-1468276311594-df7cb65d8df6'
    ],
    'coorg': [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      'https://images.unsplash.com/photo-1493246507139-91e8fad9978e',
      'https://images.unsplash.com/photo-1465311440653-ba9b1d9b0f5b',
      'https://images.unsplash.com/photo-1504198453319-5ce911bafcde'
    ],
    'rishikesh': [
      'https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      'https://images.unsplash.com/photo-1589308078059-be1415eab4c3',
      'https://images.unsplash.com/photo-1431274172761-fca41d930114'
    ],
    'darjeeling': [
      'https://images.unsplash.com/photo-1504198453319-5ce911bafcde',
      'https://images.unsplash.com/photo-1465311440653-ba9b1d9b0f5b',
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb'
    ],
    'bodh-gaya': [
      'https://images.unsplash.com/photo-1524492449090-aaf5f2271f33',
      'https://images.unsplash.com/photo-1548013146-72479768bada',
      'https://images.unsplash.com/photo-1503264116251-35a269479413',
      'https://images.unsplash.com/photo-1593691509543-c55fb32a5a5d'
    ],
    'somnath': [
      'https://images.unsplash.com/photo-1514222134-b57cbb8ce073',
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'
    ],
    'puri': [
      'https://images.unsplash.com/photo-1519821172141-b5d8c8b9b0c2',
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'
    ],
    'gangtok': [
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      'https://images.unsplash.com/photo-1465311440653-ba9b1d9b0f5b'
    ],
    'yadadri-laxmi-narasimha-temple': [
      'https://images.unsplash.com/photo-1593691509543-c55fb32a5a5d',
      'https://images.unsplash.com/photo-1548013146-72479768bada',
      'https://images.unsplash.com/photo-1524492449090-aaf5f2271f33',
      'https://images.unsplash.com/photo-1503264116251-35a269479413'
    ],
    'bhadrachalam-temple': [
      'https://images.unsplash.com/photo-1548013146-72479768bada',
      'https://images.unsplash.com/photo-1524492449090-aaf5f2271f33',
      'https://images.unsplash.com/photo-1593691509543-c55fb32a5a5d',
      'https://images.unsplash.com/photo-1503264116251-35a269479413'
    ],
    'sanghi-temple': [
      'https://images.unsplash.com/photo-1524492449090-aaf5f2271f33',
      'https://images.unsplash.com/photo-1548013146-72479768bada',
      'https://images.unsplash.com/photo-1593691509543-c55fb32a5a5d',
      'https://images.unsplash.com/photo-1503264116251-35a269479413'
    ]
  };

  const fallbackImages = [
    place.image,
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    'https://images.unsplash.com/photo-1477587458883-47145ed94245'
  ];

  const categoryFallbacks: Record<string, string[]> = {
    Religious: [
      'https://images.unsplash.com/photo-1548013146-72479768bada',
      'https://images.unsplash.com/photo-1524492449090-aaf5f2271f33',
      'https://images.unsplash.com/photo-1593691509543-c55fb32a5a5d',
      'https://images.unsplash.com/photo-1503264116251-35a269479413'
    ],
    Historical: [
      'https://images.unsplash.com/photo-1477587458883-47145ed94245',
      'https://images.unsplash.com/photo-1599661046289-e31897846e41',
      'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7',
      'https://images.unsplash.com/photo-1468276311594-df7cb65d8df6'
    ],
    Beaches: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
      'https://images.unsplash.com/photo-1489493887464-08270298a6e9',
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29',
      'https://images.unsplash.com/photo-1519821172141-b5d8c8b9b0c2'
    ],
    'Hill Stations': [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      'https://images.unsplash.com/photo-1465311440653-ba9b1d9b0f5b',
      'https://images.unsplash.com/photo-1504198453319-5ce911bafcde',
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e'
    ],
    Adventure: [
      'https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf',
      'https://images.unsplash.com/photo-1589308078059-be1415eab4c3',
      'https://images.unsplash.com/photo-1431274172761-fca41d930114',
      'https://images.unsplash.com/photo-1549366021-9f761d040a94'
    ],
    'Food & Culture': [
      'https://images.unsplash.com/photo-1595658658481-d53d3f999875',
      'https://images.unsplash.com/photo-1590050752117-238cb6856c9d',
      'https://images.unsplash.com/photo-1582553382062-3c8b9b3a3b62',
      'https://images.unsplash.com/photo-1593691509543-c55fb32a5a5d'
    ]
  };

  const combined = [place.image, ...(imagesBySlug[place.slug] ?? categoryFallbacks[place.category] ?? fallbackImages), ...(place.gallery ?? [])];
  return Array.from(new Set(combined)).slice(0, 5);
}
