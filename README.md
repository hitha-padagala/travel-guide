# TravelNest

Curated India travel guide built with Next.js 15, React 19, TypeScript, Tailwind CSS, and Supabase.

## Overview

TravelNest presents a hand-curated catalog of Indian destinations with:

- Search and filter controls for category, budget, distance, and family-friendly trips
- Detail pages with highlights, timings, entry fee, nearby attractions, and map support
- A browser shortlist for saving places locally
- Supabase-backed destination data with a seed fallback when the database is unavailable

## Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Supabase
- Lucide React icons

## Setup

1. Copy `.env.example` to `.env.local`
2. Set the Supabase values:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Optionally set `GOOGLE_MAPS_API_KEY` if you want the map embed helper to prefer the embed URL

## Database

Run [`supabase/schema.sql`](./supabase/schema.sql) in Supabase to create and seed the `places` table.

The seed data in [`src/data/travel-data.ts`](./src/data/travel-data.ts) is used as the local fallback and also serves as the source of truth for the curated catalog.

## Images

Destination and category images currently use remote Unsplash URLs. The app is configured to allow those images in [`next.config.mjs`](./next.config.mjs).

If you update a destination image in [`src/data/travel-data.ts`](./src/data/travel-data.ts), keep [`supabase/schema.sql`](./supabase/schema.sql) in sync so the database seed matches the app fallback data.

## Scripts

- `npm run dev` - start the development server
- `npm run build` - build the app for production
- `npm run start` - run the production server
- `npm run lint` - run linting

## Included Destinations

The seed data currently includes:

- Araku Valley
- Goa Beaches
- Tirupati
- Hampi
- Jaipur
- Manali
- Varanasi
- Kashi Vishwanath Temple
- Ayodhya
- Agra
- Lucknow
- Sarnath
- Mathura
- Prayagraj
- Fatehpur Sikri
- Vrindavan
- Mysore
- Kerala Backwaters
- Sabarimala
- Guruvayur Temple
- Padmanabhaswamy Temple
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
- Tawang Monastery
- Kaziranga National Park
- Bodh Gaya
- Chitrakote Falls
- Somnath
- Kurukshetra
- Deoghar
- Gateway of India
- Loktak Lake
- Shillong
- Aizawl
- Kohima
- Puri
- Gangtok
- Hyderabad
- Ujjayanta Palace
- Konark Sun Temple
- Gulmarg
- Bhandardara
- Cherrapunji
- Aurangabad Caves
- Tirumala
- Gaya
- Patna
- Vitthala Temple
- Fort Kochi
- Alleppey
- Bhimbetka Rock Shelters
- City Palace Udaipur
- Charminar
- Kamakhya Temple
- Majuli
- Dwarka
- Gir National Park
- Modhera Sun Temple
- Kullu
- Gokarna
- Wayanad
- Ranthambore

## Notes

- Auth flows are not part of the visible app experience.
- Saved places are stored locally in the browser shortlist.
- The UI is tuned for a light green travel-guide aesthetic.
