create table if not exists public.places (
  id text primary key,
  slug text unique not null,
  name text not null,
  state text not null,
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

alter table public.places
add column if not exists state text;

create table if not exists public.saved_places (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  place_id text not null references public.places(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, place_id)
);

insert into public.places (
  id, slug, name, state, category, rating, distance_km, budget, family_friendly,
  short_description, why_famous, best_time_to_visit, timings, entry_fee,
  image, gallery, nearby_attractions, latitude, longitude
) values
('1', 'araku-valley', 'Araku Valley', 'Andhra Pradesh', 'Hill Stations', 4.7, 0, 'Medium', true, 'A lush Eastern Ghats valley known for coffee estates, viewpoints, and caves.', 'Coffee plantations, tribal culture, and scenic rail routes.', 'October to February', '6:00 AM - 6:00 PM', 'Varies by attraction', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb', '{}', '{Borra Caves,Tribal Museum,Coffee Museum}', 18.6727, 82.8769),
('2', 'goa-beaches', 'Goa Beaches', 'Goa', 'Beaches', 4.8, 0, 'High', true, 'From calm family beaches to vibrant nightlife and water sports.', 'Golden sands, seafood, Portuguese influence, and beach culture.', 'November to March', 'Open 24/7', 'Free', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', '{}', '{Baga Beach,Basilica of Bom Jesus,Fort Aguada}', 15.2993, 74.124),
('3', 'tirupati', 'Tirupati', 'Andhra Pradesh', 'Religious', 4.9, 0, 'Low', true, 'One of India''s most visited pilgrimage destinations.', 'Sri Venkateswara Temple and spiritual significance.', 'September to March', 'Varies by temple', 'Free / donation based', 'https://images.unsplash.com/photo-1593691509543-c55fb32a5a5d', '{}', '{Sri Padmavathi Temple,Talakona Waterfalls,Kapila Theertham}', 13.6288, 79.4192),
('4', 'hampi', 'Hampi', 'Karnataka', 'Historical', 4.8, 0, 'Low', true, 'A UNESCO heritage site of stunning ruins, temples, and boulder landscapes.', 'Vijayanagara Empire history and iconic architecture.', 'October to February', 'Sunrise to sunset', 'Nominal', 'https://images.unsplash.com/photo-1579684453423-f84349ef60b0', '{}', '{Virupaksha Temple,Vittala Temple,Hemakuta Hill}', 15.335, 76.46),
('5', 'jaipur', 'Jaipur', 'Rajasthan', 'Historical', 4.7, 0, 'Medium', true, 'The Pink City with forts, palaces, markets, and rich cultural heritage.', 'Amber Fort, Hawa Mahal, and royal architecture.', 'October to March', 'Varies by attraction', 'Varies', 'https://images.unsplash.com/photo-1477587458883-47145ed94245', '{}', '{City Palace,Nahargarh Fort,Jantar Mantar}', 26.9124, 75.7873),
('6', 'manali', 'Manali', 'Himachal Pradesh', 'Hill Stations', 4.8, 0, 'Medium', true, 'A popular mountain escape for snow, adventure, and river views.', 'Adventure sports, scenic valleys, and winter charm.', 'March to June, December to February', 'Open 24/7', 'Free', 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d', '{}', '{Solang Valley,Rohtang Pass,Hadimba Temple}', 32.2396, 77.1887),
('7', 'varanasi', 'Varanasi', 'Uttar Pradesh', 'Religious', 4.9, 0, 'Low', true, 'One of the oldest living cities in the world, known for ghats and sacred rituals.', 'Ganga aarti, temples, and timeless spiritual atmosphere.', 'October to March', 'Open 24/7', 'Free', 'https://images.unsplash.com/photo-1548013146-72479768bada', '{}', '{Dashashwamedh Ghat,Kashi Vishwanath Temple,Sarnath}', 25.3176, 82.9739),
('8', 'mysore', 'Mysore', 'Karnataka', 'Historical', 4.7, 0, 'Medium', true, 'A royal city celebrated for palaces, heritage walks, and festivals.', 'Mysore Palace, Dasara celebrations, and silk traditions.', 'October to March', 'Varies by attraction', 'Varies', 'https://images.unsplash.com/photo-1590050752117-238cb6856c9d', '{}', '{Mysore Palace,Chamundi Hills,St. Philomena''s Church}', 12.2958, 76.6394),
('9', 'kerala-backwaters', 'Kerala Backwaters', 'Kerala', 'Beaches', 4.8, 0, 'Medium', true, 'A tranquil network of lagoons, lakes, and canals perfect for houseboats.', 'Houseboat cruises, palm-lined waters, and serene landscapes.', 'November to February', 'Open 24/7', 'Varies', 'https://images.unsplash.com/photo-1489493887464-08270298a6e9', '{}', '{Alleppey,Kumarakom,Vembanad Lake}', 9.4981, 76.3388),
('10', 'ooty', 'Ooty', 'Tamil Nadu', 'Hill Stations', 4.6, 0, 'Medium', true, 'A classic hill station with tea gardens, lakes, and cool mountain air.', 'Nilgiri Railway, Botanical Garden, and scenic viewpoints.', 'March to June', 'Open 24/7', 'Nominal', 'https://images.unsplash.com/photo-1465311440653-ba9b1d9b0f5b', '{}', '{Botanical Garden,Ooty Lake,Doddabetta Peak}', 11.4064, 76.6932),
('11', 'amritsar', 'Amritsar', 'Punjab', 'Religious', 4.9, 0, 'Low', true, 'A sacred city known for the Golden Temple and rich Punjabi heritage.', 'Golden Temple, langar, and patriotic history.', 'October to March', 'Open 24/7', 'Free', 'https://images.unsplash.com/photo-1582553382062-3c8b9b3a3b62', '{}', '{Golden Temple,Jallianwala Bagh,Wagah Border}', 31.634, 74.8723),
('12', 'leh-ladakh', 'Leh Ladakh', 'Ladakh', 'Adventure', 4.9, 0, 'High', true, 'A dramatic high-altitude landscape of monasteries, passes, and lakes.', 'Breathtaking roads, monasteries, and adventure travel.', 'May to September', 'Open 24/7', 'Varies', 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3', '{}', '{Pangong Lake,Nubra Valley,Khardung La}', 34.1526, 77.5771),
('13', 'udaipur', 'Udaipur', 'Rajasthan', 'Historical', 4.8, 0, 'Medium', true, 'The City of Lakes with palaces, waterfronts, and romantic sunset views.', 'City Palace, Lake Pichola, and royal charm.', 'October to March', 'Varies by attraction', 'Varies', 'https://images.unsplash.com/photo-1599661046289-e31897846e41', '{}', '{Lake Pichola,City Palace,Jagdish Temple}', 24.5854, 73.7125),
('14', 'coorg', 'Coorg', 'Karnataka', 'Hill Stations', 4.7, 0, 'Medium', true, 'A coffee-covered hillside region with waterfalls and misty trails.', 'Coffee estates, scenic drives, and Abbey Falls.', 'October to May', 'Open 24/7', 'Varies', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', '{}', '{Abbey Falls,Raja''s Seat,Madikeri Fort}', 12.3375, 75.8069),
('15', 'rishikesh', 'Rishikesh', 'Uttarakhand', 'Adventure', 4.8, 0, 'Low', true, 'A spiritual river town known for yoga, rafting, and Himalayan gateways.', 'Ganges riverfront, ashrams, and adventure sports.', 'September to April', 'Open 24/7', 'Free', 'https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf', '{}', '{Laxman Jhula,Triveni Ghat,Neelkanth Mahadev Temple}', 30.0869, 78.2676),
('16', 'jaisalmer', 'Jaisalmer', 'Rajasthan', 'Historical', 4.7, 0, 'Medium', true, 'A golden desert city with forts, havelis, and sand dunes.', 'Jaisalmer Fort, desert safaris, and Rajasthani architecture.', 'October to March', 'Varies by attraction', 'Varies', 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073', '{}', '{Jaisalmer Fort,Patwon Ki Haveli,Sam Sand Dunes}', 26.9157, 70.9083),
('17', 'darjeeling', 'Darjeeling', 'West Bengal', 'Hill Stations', 4.7, 0, 'Medium', true, 'A Himalayan hill town famous for tea gardens and mountain views.', 'Toy train, tea estates, and sunrise over Kanchenjunga.', 'March to May, October to December', 'Open 24/7', 'Varies', 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde', '{}', '{Tiger Hill,Batasia Loop,Darjeeling Himalayan Railway}', 27.041, 88.2663),
('18', 'khajuraho', 'Khajuraho', 'Madhya Pradesh', 'Historical', 4.6, 0, 'Low', true, 'A heritage town with exquisite temple architecture and carvings.', 'UNESCO-listed temples and artistic stone sculpture.', 'October to March', 'Sunrise to sunset', 'Nominal', 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b', '{}', '{Western Group of Temples,Raneh Falls,Ken Gharial Sanctuary}', 24.8318, 79.9199),
('19', 'shimla', 'Shimla', 'Himachal Pradesh', 'Hill Stations', 4.6, 0, 'Medium', true, 'A classic mountain retreat with colonial charm and mall-road views.', 'Toy train, Ridge, and summer capital history.', 'March to June, December to February', 'Open 24/7', 'Varies', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', '{}', '{The Ridge,Mall Road,Jakhoo Temple}', 31.1048, 77.1734),
('20', 'kanyakumari', 'Kanyakumari', 'Tamil Nadu', 'Beaches', 4.7, 0, 'Low', true, 'The southernmost tip of India, known for ocean views and sunrise points.', 'Three-sea confluence and iconic memorials.', 'October to March', 'Open 24/7', 'Free', 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29', '{}', '{Vivekananda Rock Memorial,Thiruvalluvar Statue,Sunrise View Point}', 8.0883, 77.5385),
('21', 'tawang-monastery', 'Tawang Monastery', 'Arunachal Pradesh', 'Religious', 4.8, 0, 'Low', true, 'A serene Himalayan monastery set against dramatic mountain views.', 'One of the largest monasteries in India and a major Buddhist pilgrimage site.', 'March to June, September to October', 'Morning to evening', 'Nominal', 'https://images.unsplash.com/photo-1503264116251-35a269479413', '{}', '{Tawang War Memorial,Sela Pass,Nuranang Falls}', 27.5861, 91.8649),
('22', 'kaziranga-national-park', 'Kaziranga National Park', 'Assam', 'Adventure', 4.8, 0, 'Medium', true, 'A famous wildlife reserve known for rhinos, grasslands, and safaris.', 'UNESCO-listed park and one-horned rhinoceros habitat.', 'November to April', 'Daylight hours', 'Varies', 'https://images.unsplash.com/photo-1549366021-9f761d040a94', '{}', '{Rhino Safari Zone,Kohora,Brahmaputra River}', 26.5775, 93.1711),
('23', 'bodh-gaya', 'Bodh Gaya', 'Bihar', 'Religious', 4.9, 0, 'Low', true, 'The sacred place where Buddha attained enlightenment.', 'Mahabodhi Temple and global Buddhist pilgrimage significance.', 'October to March', 'Open 24/7', 'Free', 'https://images.unsplash.com/photo-1524492449090-aaf5f2271f33', '{}', '{Mahabodhi Temple,Bodhi Tree,Great Buddha Statue}', 24.695, 84.991),
('24', 'chitrakote-falls', 'Chitrakote Falls', 'Chhattisgarh', 'Adventure', 4.7, 0, 'Low', true, 'A dramatic horseshoe waterfall surrounded by forested scenery.', 'Often called the Niagara of India for its wide, thunderous flow.', 'July to October', 'Morning to evening', 'Nominal', 'https://images.unsplash.com/photo-1431274172761-fca41d930114', '{}', '{Bastar,Tirathgarh Falls,Kanger Valley National Park}', 19.2, 81.25),
('25', 'somnath', 'Somnath', 'Gujarat', 'Religious', 4.8, 0, 'Low', true, 'A revered coastal temple town with a powerful spiritual presence.', 'The Somnath Temple and the Arabian Sea shoreline.', 'October to March', 'Open 24/7', 'Free', 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073', '{}', '{Somnath Temple,Triveni Sangam,Prabhas Patan Museum}', 20.888, 70.401),
('26', 'kurukshetra', 'Kurukshetra', 'Haryana', 'Religious', 4.6, 0, 'Low', true, 'An ancient city linked deeply with the Mahabharata.', 'Sacred ponds, temples, and historical-religious heritage.', 'October to March', 'Varies by site', 'Free / nominal', 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e', '{}', '{Brahma Sarovar,Jyotisar,Sannihit Sarovar}', 29.9695, 76.8784),
('27', 'deoghar', 'Deoghar', 'Jharkhand', 'Religious', 4.7, 0, 'Low', true, 'A pilgrimage town with temples, hills, and a calm spiritual rhythm.', 'Baidyanath Temple and sacred pilgrimage traditions.', 'October to March', 'Open 24/7', 'Free', 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e', '{}', '{Baidyanath Temple,Naulakha Temple,Trikuta Hills}', 24.4833, 86.7008),
('28', 'gateway-of-india', 'Gateway of India', 'Maharashtra', 'Historical', 4.7, 0, 'Low', true, 'Mumbai''s iconic waterfront monument and city landmark.', 'Colonial-era architecture and ferry access to the harbor.', 'November to February', 'Open 24/7', 'Free', 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7', '{}', '{Colaba Causeway,Taj Mahal Palace,Marine Drive}', 18.922, 72.8347),
('29', 'loktak-lake', 'Loktak Lake', 'Manipur', 'Beaches', 4.7, 0, 'Low', true, 'A beautiful freshwater lake famous for floating islands.', 'Unique phumdis and scenic boating experiences.', 'October to March', 'Open 24/7', 'Nominal', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee', '{}', '{Sendra Island,Keibul Lamjao National Park,Imphal}', 24.53, 93.83),
('30', 'shillong', 'Shillong', 'Meghalaya', 'Hill Stations', 4.7, 0, 'Medium', true, 'A cool, green hill station known for waterfalls and music culture.', 'Scenic viewpoints, living-root traditions, and pleasant weather.', 'March to June', 'Open 24/7', 'Free', 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e', '{}', '{Elephant Falls,Ward''s Lake,Shillong Peak}', 25.5788, 91.8933),
('31', 'aizawl', 'Aizawl', 'Mizoram', 'Hill Stations', 4.6, 0, 'Medium', true, 'A hill city with panoramic views and a calm North-East vibe.', 'Misty hills, local culture, and viewpoint scenery.', 'October to March', 'Open 24/7', 'Free', 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21', '{}', '{Durtlang Hills,Mizoram State Museum,Reiek}', 23.7271, 92.7176),
('32', 'kohima', 'Kohima', 'Nagaland', 'Historical', 4.6, 0, 'Medium', true, 'A mountain capital with heritage, culture, and striking scenery.', 'World War II history and rich Naga traditions.', 'October to May', 'Open 24/7', 'Free', 'https://images.unsplash.com/photo-1501785888041-af3ef285b470', '{}', '{Kohima War Cemetery,Dzükou Valley,Naga Heritage Village}', 25.67, 94.12),
('33', 'puri', 'Puri', 'Odisha', 'Religious', 4.8, 0, 'Low', true, 'A sacred temple and beach town on the Bay of Bengal.', 'Jagannath Temple and the Rath Yatra festival.', 'October to March', 'Open 24/7', 'Free', 'https://images.unsplash.com/photo-1519821172141-b5d8c8b9b0c2', '{}', '{Jagannath Temple,Puri Beach,Konark Sun Temple}', 19.813, 85.831),
('34', 'gangtok', 'Gangtok', 'Sikkim', 'Hill Stations', 4.7, 0, 'Medium', true, 'A hill capital with monastery views and Himalayan scenery.', 'Peaceful slopes, ropeways, and Sikkimese culture.', 'March to June, September to December', 'Open 24/7', 'Varies', 'https://images.unsplash.com/photo-1501785888041-af3ef285b470', '{}', '{MG Marg,Rumtek Monastery,Tsomgo Lake}', 27.3389, 88.6065),
('35', 'hyderabad', 'Hyderabad', 'Telangana', 'Food & Culture', 4.8, 0, 'Medium', true, 'A lively city famous for palaces, markets, and biryani.', 'Charminar, pearls, cuisine, and a vibrant urban culture.', 'October to February', 'Varies by attraction', 'Varies', 'https://images.unsplash.com/photo-1595658658481-d53d3f999875', '{}', '{Charminar,Golconda Fort,Salar Jung Museum}', 17.385, 78.4867),
('36', 'ujjayanta-palace', 'Ujjayanta Palace', 'Tripura', 'Historical', 4.6, 0, 'Low', true, 'A grand palace and museum at the heart of Agartala.', 'Royal architecture and Tripura''s heritage collection.', 'October to March', 'Daytime hours', 'Nominal', 'https://images.unsplash.com/photo-1468276311594-df7cb65d8df6', '{}', '{Neermahal,Tripura State Museum,Heritage Park}', 23.84, 91.28),
('37', 'konark-sun-temple', 'Konark Sun Temple', 'Odisha', 'Historical', 4.8, 0, 'Low', true, 'A magnificent stone temple shaped like a celestial chariot.', 'UNESCO heritage and extraordinary temple sculpture.', 'October to March', 'Sunrise to sunset', 'Nominal', 'https://images.unsplash.com/photo-1501426026826-31c667bdf23d', '{}', '{Puri Beach,Chandrabhaga Beach,Archaeological Museum}', 19.8876, 86.0945),
('38', 'gulmarg', 'Gulmarg', 'Jammu and Kashmir', 'Hill Stations', 4.8, 0, 'High', true, 'A famous alpine meadow with snow sports and mountain views.', 'Cable cars, skiing, and Himalayan landscapes.', 'December to March, May to August', 'Open 24/7', 'Varies', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85', '{}', '{Gulmarg Gondola,Apharwat Peak,Alpather Lake}', 34.05, 74.38),
('39', 'bhandardara', 'Bhandardara', 'Maharashtra', 'Beaches', 4.5, 0, 'Low', true, 'A peaceful lake and waterfall destination in the Sahyadris.', 'Scenic camping, Arthur Lake, and seasonal waterfalls.', 'June to February', 'Open 24/7', 'Free', 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21', '{}', '{Arthur Lake,Randha Falls,Kalsubai Peak}', 19.548, 73.757),
('40', 'cherrapunji', 'Cherrapunji', 'Meghalaya', 'Adventure', 4.8, 0, 'Medium', true, 'One of the wettest places on Earth with waterfalls and living roots.', 'Dramatic caves, falls, and cloud-kissed landscapes.', 'October to May', 'Open 24/7', 'Varies', 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e', '{}', '{Nohkalikai Falls,Mawsmai Cave,Double Decker Living Root Bridge}', 25.275, 91.734),
('41', 'aurangabad-caves', 'Aurangabad Caves', 'Maharashtra', 'Historical', 4.6, 0, 'Low', true, 'Ancient rock-cut caves with a quieter heritage feel.', 'Buddhist cave architecture and historic carving detail.', 'October to March', 'Morning to evening', 'Nominal', 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b', '{}', '{Ellora Caves,Bibi Ka Maqbara,Daulatabad Fort}', 19.8762, 75.3433)
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  state = excluded.state,
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
