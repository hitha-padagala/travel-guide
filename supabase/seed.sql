create table if not exists public.places (
  id text primary key,
  slug text unique not null,
  name text not null,
  category text not null,
  rating numeric not null,
  distance_km numeric not null,
  budget text not null,
  family_friendly boolean not null default true,
  short_description text not null,
  why_famous text not null,
  best_time_to_visit text not null,
  timings text not null,
  entry_fee text not null,
  image text not null,
  gallery text[] not null default '{}',
  nearby_attractions text[] not null default '{}',
  latitude numeric not null,
  longitude numeric not null,
  created_at timestamptz not null default now()
);

insert into public.places (
  id, slug, name, category, rating, distance_km, budget, family_friendly,
  short_description, why_famous, best_time_to_visit, timings, entry_fee,
  image, gallery, nearby_attractions, latitude, longitude
) values
('1', 'araku-valley', 'Araku Valley', 'Hill Stations', 4.7, 18, 'Medium', true, 'A lush Eastern Ghats valley known for coffee estates, viewpoints, and caves.', 'Coffee plantations, tribal culture, and scenic rail routes.', 'October to February', '6:00 AM - 6:00 PM', 'Varies by attraction', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb', '{}', '{Borra Caves,Tribal Museum,Coffee Museum}', 18.6727, 82.8769),
('2', 'goa-beaches', 'Goa Beaches', 'Beaches', 4.8, 12, 'High', true, 'From calm family beaches to vibrant nightlife and water sports.', 'Golden sands, seafood, Portuguese influence, and beach culture.', 'November to March', 'Open 24/7', 'Free', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', '{}', '{Baga Beach,Basilica of Bom Jesus,Fort Aguada}', 15.2993, 74.1240)
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  category = excluded.category,
  rating = excluded.rating,
  distance_km = excluded.distance_km,
  budget = excluded.budget,
  family_friendly = excluded.family_friendly,
  short_description = excluded.short_description,
  why_famous = excluded.why_famous,
  best_time_to_visit = excluded.best_time_to_visit,
  timings = excluded.timings,
  entry_fee = excluded.entry_fee,
  image = excluded.image,
  gallery = excluded.gallery,
  nearby_attractions = excluded.nearby_attractions,
  latitude = excluded.latitude,
  longitude = excluded.longitude;
