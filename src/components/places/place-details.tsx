'use client';

import { useEffect, useState } from 'react';
import { Bookmark, BookmarkCheck, Star, MapPinned, Clock3, Ticket, Sparkles } from 'lucide-react';
import type { Place } from '@/types/travel';
import { createGoogleMapsEmbedUrl } from '@/services/maps';
import { useSavedPlaces } from '@/context/saved-places-context';
import { Button } from '@/components/ui/button';
import { getEatRecommendations, getStayRecommendations } from '@/services/local-recommendations';

export function PlaceDetails({ place }: { place: Place }) {
  const mapUrl = createGoogleMapsEmbedUrl(place.latitude, place.longitude);
  const { isSaved, toggleSavedPlace } = useSavedPlaces();
  const [saved, setSaved] = useState(false);
  const stays = getStayRecommendations(place);
  const eats = getEatRecommendations(place);

  useEffect(() => {
    setSaved(isSaved(place.id));
  }, [isSaved, place.id]);

  async function handleSaveToggle() {
    toggleSavedPlace(place.id);
    setSaved((current) => !current);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[2rem] border border-[#c8d7f2] bg-white shadow-[0_30px_100px_rgba(29,78,216,0.10)]">
        <div className="relative isolate overflow-hidden">
          <div className="h-[26rem] bg-cover bg-center" style={{ backgroundImage: `url(${place.image})` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/60 to-transparent" />
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
                  {place.distanceKm} km away
                </span>
              </div>
              <h1 className="text-4xl font-semibold text-white sm:text-5xl">{place.name}</h1>
              <p className="max-w-2xl text-base leading-7 text-stone-100 sm:text-lg">{place.shortDescription}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 p-6 lg:grid-cols-[1.25fr_0.75fr] lg:p-8">
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
              <h2 className="text-lg font-semibold text-slate-950">Map</h2>
              <iframe title={`${place.name} map`} src={mapUrl} className="mt-3 h-80 w-full rounded-2xl border border-[#c8d7f2]" loading="lazy" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-[#c8d7f2] bg-white p-5">
              <h2 className="text-lg font-semibold text-slate-950">Nearby attractions</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {place.nearbyAttractions.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </div>
            <RecommendationList title="Best places to stay" items={stays} />
            <RecommendationList title="Best places to eat" items={eats} />
            <div className="rounded-2xl border border-[#c8d7f2] bg-white p-5">
              <h2 className="text-lg font-semibold text-slate-950">Gallery</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[place.image, place.image, place.image, place.image].map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square overflow-hidden rounded-2xl bg-cover bg-center"
                    style={{ backgroundImage: `url(${image})` }}
                  />
                ))}
              </div>
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
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-slate-950">{item.name}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-[#1d4ed8]">{item.type}</p>
              </div>
            </div>
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
