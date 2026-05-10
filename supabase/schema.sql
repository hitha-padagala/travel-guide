create table if not exists public.places (
  id text primary key,
  slug text unique not null,
  name text not null,
  category text not null,
  rating numeric not null,
  distance_km numeric not null default 0,
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

create table if not exists public.saved_places (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  place_id text not null references public.places(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, place_id)
);

insert into public.places (
  id, slug, name, category, rating, distance_km, budget, family_friendly,
  short_description, why_famous, best_time_to_visit, timings, entry_fee,
  image, gallery, nearby_attractions, latitude, longitude
) values
('1', 'tirupati', 'Tirupati', 'Religious', 4.9, 0, 'Low', true, 'One of India''s most visited pilgrimage destinations.', 'Sri Venkateswara Temple and spiritual significance.', 'September to March', 'Varies by temple', 'Free / donation based', 'https://images.unsplash.com/photo-1593691509543-c55fb32a5a5d', '{}', '{Sri Padmavathi Temple,Talakona Waterfalls,Kapila Theertham}', 13.6288, 79.4192),
('2', 'hampi', 'Hampi', 'Historical', 4.8, 0, 'Low', true, 'A UNESCO heritage site of stunning ruins, temples, and boulder landscapes.', 'Vijayanagara Empire history and iconic architecture.', 'October to February', 'Sunrise to sunset', 'Nominal', 'https://images.unsplash.com/photo-1579684453423-f84349ef60b0', '{}', '{Virupaksha Temple,Vittala Temple,Hemakuta Hill}', 15.335, 76.46),
('3', 'jaipur', 'Jaipur', 'Historical', 4.7, 0, 'Medium', true, 'The Pink City with forts, palaces, markets, and rich cultural heritage.', 'Amber Fort, Hawa Mahal, and royal architecture.', 'October to March', 'Varies by attraction', 'Varies', 'https://images.unsplash.com/photo-1477587458883-47145ed94245', '{}', '{City Palace,Nahargarh Fort,Jantar Mantar}', 26.9124, 75.7873),
('4', 'goa-beaches', 'Goa Beaches', 'Beaches', 4.8, 0, 'High', true, 'From calm family beaches to vibrant nightlife and water sports.', 'Golden sands, seafood, Portuguese influence, and beach culture.', 'November to March', 'Open 24/7', 'Free', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', '{}', '{Baga Beach,Basilica of Bom Jesus,Fort Aguada}', 15.2993, 74.124),
('5', 'manali', 'Manali', 'Hill Stations', 4.8, 0, 'Medium', true, 'A popular mountain escape for snow, adventure, and river views.', 'Adventure sports, scenic valleys, and winter charm.', 'March to June, December to February', 'Open 24/7', 'Free', 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d', '{}', '{Solang Valley,Rohtang Pass,Hadimba Temple}', 32.2396, 77.1887),
('6', 'araku-valley', 'Araku Valley', 'Hill Stations', 4.7, 0, 'Medium', true, 'A lush Eastern Ghats valley known for coffee estates, viewpoints, and caves.', 'Coffee plantations, tribal culture, and scenic rail routes.', 'October to February', '6:00 AM - 6:00 PM', 'Varies by attraction', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb', '{}', '{Borra Caves,Tribal Museum,Coffee Museum}', 18.6727, 82.8769),
('7', 'varanasi', 'Varanasi', 'Religious', 4.9, 0, 'Low', true, 'One of the oldest living cities in the world, known for ghats and sacred rituals.', 'Ganga aarti, temples, and timeless spiritual atmosphere.', 'October to March', 'Open 24/7', 'Free', 'https://images.unsplash.com/photo-1548013146-72479768bada', '{}', '{Dashashwamedh Ghat,Kashi Vishwanath Temple,Sarnath}', 25.3176, 82.9739),
('8', 'mysore', 'Mysore', 'Historical', 4.7, 0, 'Medium', true, 'A royal city celebrated for palaces, heritage walks, and festivals.', 'Mysore Palace, Dasara celebrations, and silk traditions.', 'October to March', 'Varies by attraction', 'Varies', 'https://images.unsplash.com/photo-1590050752117-238cb6856c9d', '{}', '{Mysore Palace,Chamundi Hills,St. Philomena''s Church}', 12.2958, 76.6394),
('9', 'kerala-backwaters', 'Kerala Backwaters', 'Beaches', 4.8, 0, 'Medium', true, 'A tranquil network of lagoons, lakes, and canals perfect for houseboats.', 'Houseboat cruises, palm-lined waters, and serene landscapes.', 'November to February', 'Open 24/7', 'Varies', 'https://images.unsplash.com/photo-1489493887464-08270298a6e9', '{}', '{Alleppey, Kumarakom, Vembanad Lake}', 9.4981, 76.3388),
('10', 'ooty', 'Ooty', 'Hill Stations', 4.6, 0, 'Medium', true, 'A classic hill station with tea gardens, lakes, and cool mountain air.', 'Nilgiri Railway, Botanical Garden, and scenic viewpoints.', 'March to June', 'Open 24/7', 'Nominal', 'https://images.unsplash.com/photo-1465311440653-ba9b1d9b0f5b', '{}', '{Botanical Garden,Ooty Lake,Doddabetta Peak}', 11.4064, 76.6932),
('11', 'amritsar', 'Amritsar', 'Religious', 4.9, 0, 'Low', true, 'A sacred city known for the Golden Temple and rich Punjabi heritage.', 'Golden Temple, langar, and patriotic history.', 'October to March', 'Open 24/7', 'Free', 'https://images.unsplash.com/photo-1582553382062-3c8b9b3a3b62', '{}', '{Golden Temple,Jallianwala Bagh,Wagah Border}', 31.634, 74.8723),
('12', 'leh-ladakh', 'Leh Ladakh', 'Adventure', 4.9, 0, 'High', true, 'A dramatic high-altitude landscape of monasteries, passes, and lakes.', 'Breathtaking roads, monasteries, and adventure travel.', 'May to September', 'Open 24/7', 'Varies', 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3', '{}', '{Pangong Lake,Nubra Valley,Khardung La}', 34.1526, 77.5771),
('13', 'udayipur', 'Udaipur', 'Historical', 4.8, 0, 'Medium', true, 'The City of Lakes with palaces, waterfronts, and romantic sunset views.', 'City Palace, Lake Pichola, and royal charm.', 'October to March', 'Varies by attraction', 'Varies', 'https://images.unsplash.com/photo-1599661046289-e31897846e41', '{}', '{Lake Pichola,City Palace,Jagdish Temple}', 24.5854, 73.7125),
('14', 'coorg', 'Coorg', 'Hill Stations', 4.7, 0, 'Medium', true, 'A coffee-covered hillside region with waterfalls and misty trails.', 'Coffee estates, scenic drives, and Abbey Falls.', 'October to May', 'Open 24/7', 'Varies', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', '{}', '{Abbey Falls,Raja''s Seat,Madikeri Fort}', 12.3375, 75.8069),
('15', 'rishikesh', 'Rishikesh', 'Adventure', 4.8, 0, 'Low', true, 'A spiritual river town known for yoga, rafting, and Himalayan gateways.', 'Ganges riverfront, ashrams, and adventure sports.', 'September to April', 'Open 24/7', 'Free', 'https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf', '{}', '{Laxman Jhula,Triveni Ghat,Neelkanth Mahadev Temple}', 30.0869, 78.2676),
('16', 'jaisalmer', 'Jaisalmer', 'Historical', 4.7, 0, 'Medium', true, 'A golden desert city with forts, havelis, and sand dunes.', 'Jaisalmer Fort, desert safaris, and Rajasthani architecture.', 'October to March', 'Varies by attraction', 'Varies', 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073', '{}', '{Jaisalmer Fort,Patwon Ki Haveli,Sam Sand Dunes}', 26.9157, 70.9083),
('17', 'darjeeling', 'Darjeeling', 'Hill Stations', 4.7, 0, 'Medium', true, 'A Himalayan hill town famous for tea gardens and mountain views.', 'Toy train, tea estates, and sunrise over Kanchenjunga.', 'March to May, October to December', 'Open 24/7', 'Varies', 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde', '{}', '{Tiger Hill,Batasia Loop,Darjeeling Himalayan Railway}', 27.041, 88.2663),
('18', 'khajuraho', 'Khajuraho', 'Historical', 4.6, 0, 'Low', true, 'A heritage town with exquisite temple architecture and carvings.', 'UNESCO-listed temples and artistic stone sculpture.', 'October to March', 'Sunrise to sunset', 'Nominal', 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b', '{}', '{Western Group of Temples,Raneh Falls,Ken Gharial Sanctuary}', 24.8318, 79.9199),
('19', 'shimla', 'Shimla', 'Hill Stations', 4.6, 0, 'Medium', true, 'A classic mountain retreat with colonial charm and mall-road views.', 'Toy train, Ridge, and summer capital history.', 'March to June, December to February', 'Open 24/7', 'Varies', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', '{}', '{The Ridge,Mall Road,Jakhoo Temple}', 31.1048, 77.1734),
('20', 'kanyakumari', 'Kanyakumari', 'Beaches', 4.7, 0, 'Low', true, 'The southernmost tip of India, known for ocean views and sunrise points.', 'Three-sea confluence and iconic memorials.', 'October to March', 'Open 24/7', 'Free', 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29', '{}', '{Vivekananda Rock Memorial,Thiruvalluvar Statue,Sunrise View Point}', 8.0883, 77.5385)
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
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

alter table public.places enable row level security;
alter table public.saved_places enable row level security;

drop policy if exists "Public can read places" on public.places;
create policy "Public can read places"
on public.places
for select
using (true);

drop policy if exists "Users can read own saved places" on public.saved_places;
create policy "Users can read own saved places"
on public.saved_places
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own saved places" on public.saved_places;
create policy "Users can insert own saved places"
on public.saved_places
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own saved places" on public.saved_places;
create policy "Users can delete own saved places"
on public.saved_places
for delete
using (auth.uid() = user_id);
