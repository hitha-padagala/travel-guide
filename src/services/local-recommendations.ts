import type { Place, Recommendation } from '@/types/travel';

const baseStays: Record<string, Recommendation[]> = {
  Goa: [
    { name: 'Taj Holiday Village Resort & Spa', type: 'Luxury stay', description: 'Beachfront resort feel with easy access to North Goa.' },
    { name: 'The Park Calangute', type: 'Boutique hotel', description: 'Good for travelers who want nightlife and the beach in one area.' },
    { name: 'Amritara The Beach Front', type: 'Comfort stay', description: 'A relaxed stay close to the shoreline and eateries.' }
  ],
  Karnataka: [
    { name: 'Evolve Back Coorg', type: 'Luxury retreat', description: 'A scenic plantation-style stay for slower, quieter trips.' },
    { name: 'Radisson Blu Plaza Mysore', type: 'Full-service hotel', description: 'Reliable for city access and family travel.' },
    { name: 'Misty Hills Resort', type: 'Nature stay', description: 'Great when the goal is views, weather, and a calm base.' }
  ],
  Rajasthan: [
    { name: 'Taj Lake Palace', type: 'Heritage luxury', description: 'Iconic for a memorable royal-style stay near major sights.' },
    { name: 'Ramada by Wyndham Jaipur', type: 'City hotel', description: 'Convenient when you want central access and easy transport.' },
    { name: 'Suryagarh Jaisalmer', type: 'Desert stay', description: 'Best for a dramatic desert-trip experience.' }
  ],
  'Himachal Pradesh': [
    { name: 'The Oberoi Cecil', type: 'Heritage stay', description: 'Classic mountain stay with polished service.' },
    { name: 'Taj Theog Resort & Spa', type: 'Resort stay', description: 'Works well for scenic breaks and longer hill holidays.' },
    { name: 'Snow Valley Resorts', type: 'Comfort stay', description: 'A practical base near popular hill-town attractions.' }
  ],
  Telangana: [
    { name: 'ITC Kohenur, Hyderabad', type: 'Luxury stay', description: 'A polished base for Hyderabad sightseeing and temple day trips.' },
    { name: 'Taj Banjara', type: 'City hotel', description: 'Convenient for central access, especially if you are visiting multiple sites.' },
    { name: 'Haritha Hotel Yadagirigutta', type: 'Pilgrimage stay', description: 'Useful for an overnight stop near the Yadadri temple area.' }
  ]
};

const baseEats: Record<string, Recommendation[]> = {
  Goa: [
    { name: 'Britto\'s', type: 'Seafood favorite', description: 'Well known for beachside seafood and lively atmosphere.' },
    { name: 'Fisherman\'s Wharf', type: 'Goan cuisine', description: 'Good pick for curry, crab, and regional flavors.' },
    { name: 'Mum\'s Kitchen', type: 'Local dining', description: 'Useful for traditional Goan dishes in a sit-down setting.' }
  ],
  Karnataka: [
    { name: 'Rasa India', type: 'Regional cuisine', description: 'A strong choice for Karnataka and South Indian flavors.' },
    { name: 'Mylari Hotel', type: 'Breakfast spot', description: 'Popular for dosas and a simple local meal.' },
    { name: 'Coorg Cuisine', type: 'Home-style food', description: 'Good when the area calls for peppery, regional cooking.' }
  ],
  Rajasthan: [
    { name: 'Chokhi Dhani', type: 'Rajasthani thali', description: 'Best for a traditional spread and cultural dining experience.' },
    { name: 'Laxmi Misthan Bhandar', type: 'Classic sweets', description: 'A dependable stop for snacks, sweets, and local bites.' },
    { name: 'Ambrai', type: 'Lake-view dining', description: 'Strong option for a scenic meal with regional favorites.' }
  ],
  'Himachal Pradesh': [
    { name: 'Cafe Sol', type: 'Cafe and grill', description: 'Good for relaxed meals after sightseeing.' },
    { name: 'Sher-e-Punjab', type: 'North Indian food', description: 'Comfort food that suits mountain travel very well.' },
    { name: 'Woodstock Inn Restaurant', type: 'Hill station dining', description: 'Handy for a sit-down meal with local comfort dishes.' }
  ],
  Telangana: [
    { name: 'Paradise Biryani', type: 'Hyderabadi classic', description: 'A dependable pick for biryani and regional favorites.' },
    { name: 'Pista House', type: 'Local specialty', description: 'Known for snacks, haleem, and popular Telangana flavors.' },
    { name: 'Shadab Hotel', type: 'Traditional dining', description: 'Good for a classic Hyderabad meal near major city sights.' }
  ]
};

function fallBackRecommendations(place: Place, kind: 'stay' | 'eat'): Recommendation[] {
  const label = kind === 'stay' ? 'stay' : 'eat';
  const area = place.category.toLowerCase();
  return [
    {
      name: `${place.name} Central ${kind === 'stay' ? 'Stay' : 'Dining'}`,
      type: `Best for ${area}`,
      description: `A convenient ${label} option near the main sights in ${place.name}.`
    },
    {
      name: `${place.state} Signature ${kind === 'stay' ? 'Hotel' : 'Restaurant'}`,
      type: 'Popular choice',
      description: `A good all-round pick for visitors exploring ${place.state}.`
    },
    {
      name: `${place.name} Local ${kind === 'stay' ? 'Inn' : 'Eatery'}`,
      type: 'Local favorite',
      description: `Useful when you want something familiar and close to the destination.`
    }
  ];
}

export function getStayRecommendations(place: Place) {
  return baseStays[place.state] ?? fallBackRecommendations(place, 'stay');
}

export function getEatRecommendations(place: Place) {
  return baseEats[place.state] ?? fallBackRecommendations(place, 'eat');
}
