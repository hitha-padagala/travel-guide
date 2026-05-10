# TravelNest

Curated India travel guide built with Next.js 15, React, TypeScript, Tailwind CSS, and a warm green travel-magazine style.

## What It Does

- Shows a curated set of famous Indian destinations
- Lets users search and filter places by category, budget, distance, and family-friendly preference
- Opens detailed destination pages with story, timings, entry fee, nearby attractions, and map view
- Keeps a local shortlist of saved places in the browser
- Uses Supabase for the places catalog

## Setup

1. Copy `.env.example` to `.env.local`
2. Set the Supabase values:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Optionally set `GOOGLE_MAPS_API_KEY` if you want the map embed helper to prefer the embed URL

## Database

Run [`supabase/schema.sql`](./supabase/schema.sql) in Supabase to create and seed the `places` table with a curated India catalog.

## Included Destinations

The seed data currently includes:

- Tirupati
- Hampi
- Jaipur
- Goa Beaches
- Manali
- Araku Valley
- Varanasi
- Mysore
- Kerala Backwaters
- Ooty
- Amritsar
- Leh Ladakh
- Udaipur
- Coorg
- Rishikesh
- Jaisalmer
- Darjeeling
- Khajuraho
- Shimla
- Kanyakumari

## Notes

- Login/auth flows were intentionally removed from the visible app experience.
- Saved places are stored locally in the browser shortlist.
- The UI is tuned for a light green, travel-guide aesthetic.
