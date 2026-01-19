import type { ChatResponse } from '../types';

export const mockResponses: Record<string, ChatResponse> = {
  'romantic-destinations': {
    message: `# Romantic Destinations for Couples

If you're looking for the perfect romantic getaway, I'd highly recommend these enchanting destinations:

## European Charm
[Paris](#paris-001) is often called the "City of Love" and for good reason. The city's romantic ambiance, from candlelit dinners along the Seine to strolls through Montmartre, makes it an ideal choice for couples.

## Mediterranean Magic
For those who prefer seaside romance, [Santorini](#santorini-001) offers breathtaking sunsets over the caldera, whitewashed buildings, and intimate boutique hotels carved into the cliffs.

## Asian Elegance
[Kyoto](#kyoto-001) provides a more serene romantic experience with its traditional ryokans, peaceful bamboo groves, and beautiful temple gardens that are especially magical during cherry blossom season.

Each of these destinations offers unique experiences that will create lasting memories for you and your partner.`,
    sources: [
      {
        id: 'paris-001',
        name: 'Paris',
        description: 'The City of Light captivates visitors with its iconic landmarks, world-class museums, exquisite cuisine, and unmistakable romantic atmosphere. From the Eiffel Tower to charming café-lined streets, Paris embodies elegance and culture at every turn.',
        highlights: ['Eiffel Tower', 'Louvre Museum', 'Seine River Cruise', 'Montmartre', 'Champs-Élysées'],
        bestTime: 'April to June, September to October',
        imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
        country: 'France',
        averageCost: '$150-300/day',
        language: 'French',
        currency: 'Euro (EUR)'
      },
      {
        id: 'santorini-001',
        name: 'Santorini',
        description: 'This stunning Greek island is famous for its dramatic views, stunning sunsets, white-washed buildings with blue domes, and beautiful beaches with unique volcanic sand. The island offers a perfect blend of relaxation and exploration.',
        highlights: ['Oia Sunset', 'Caldera Views', 'Wine Tasting', 'Red Beach', 'Ancient Akrotiri'],
        bestTime: 'May to October',
        imageUrl: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800',
        country: 'Greece',
        averageCost: '$120-250/day',
        language: 'Greek',
        currency: 'Euro (EUR)'
      },
      {
        id: 'kyoto-001',
        name: 'Kyoto',
        description: 'Japan\'s cultural heart, Kyoto is home to over 2,000 temples and shrines, traditional wooden houses, stunning gardens, and geisha districts. The city beautifully preserves Japan\'s imperial past while embracing modern comforts.',
        highlights: ['Fushimi Inari Shrine', 'Arashiyama Bamboo Grove', 'Kinkaku-ji Temple', 'Gion District', 'Traditional Tea Ceremony'],
        bestTime: 'March to May, October to November',
        imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
        country: 'Japan',
        averageCost: '$100-200/day',
        language: 'Japanese',
        currency: 'Yen (JPY)'
      }
    ]
  },
  'adventure-travel': {
    message: `# Adventure Travel Destinations

For thrill-seekers and nature lovers, these destinations offer unforgettable adventures:

## South American Wonder
[Machu Picchu](#machu-picchu-001) stands as one of the most remarkable archaeological sites in the world. The ancient Incan citadel, perched high in the Andes Mountains, offers incredible hiking opportunities and a glimpse into a fascinating civilization.

## African Safari
[Serengeti National Park](#serengeti-001) in Tanzania is the ultimate wildlife destination. Witness the great migration, spot the Big Five, and experience the raw beauty of the African savanna.

## New Zealand Adventure
[Queenstown](#queenstown-001) is often called the "Adventure Capital of the World." From bungee jumping to jet boating, skiing to skydiving, this stunning lakeside town has it all.

**Pro tip:** Book guided tours in advance for these popular destinations, especially during peak seasons!`,
    sources: [
      {
        id: 'machu-picchu-001',
        name: 'Machu Picchu',
        description: 'This 15th-century Incan citadel sits on a mountain ridge above the Sacred Valley. A UNESCO World Heritage site and one of the New Seven Wonders of the World, it offers a mystical journey through history surrounded by breathtaking Andean landscapes.',
        highlights: ['Inca Trail Hike', 'Sun Gate', 'Temple of the Sun', 'Huayna Picchu Climb', 'Sacred Valley'],
        bestTime: 'April to October (dry season)',
        imageUrl: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800',
        country: 'Peru',
        averageCost: '$80-180/day',
        language: 'Spanish, Quechua',
        currency: 'Peruvian Sol (PEN)'
      },
      {
        id: 'serengeti-001',
        name: 'Serengeti National Park',
        description: 'One of Africa\'s most famous wildlife sanctuaries, the Serengeti hosts the largest terrestrial mammal migration in the world. Over 1.5 million wildebeest and hundreds of thousands of zebras make this annual journey.',
        highlights: ['Great Migration', 'Big Five Safari', 'Hot Air Balloon Rides', 'Maasai Cultural Visits', 'Sunrise Game Drives'],
        bestTime: 'June to October for migration, January to February for calving',
        imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
        country: 'Tanzania',
        averageCost: '$250-500/day',
        language: 'Swahili, English',
        currency: 'Tanzanian Shilling (TZS)'
      },
      {
        id: 'queenstown-001',
        name: 'Queenstown',
        description: 'Nestled on the shores of Lake Wakatipu and surrounded by the Remarkables mountain range, Queenstown offers world-class adventure activities year-round. In winter, it transforms into a premier ski destination.',
        highlights: ['Bungee Jumping', 'Milford Sound', 'Skiing & Snowboarding', 'Jet Boating', 'Skydiving'],
        bestTime: 'December to February for summer adventures, June to August for skiing',
        imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800',
        country: 'New Zealand',
        averageCost: '$150-300/day',
        language: 'English',
        currency: 'New Zealand Dollar (NZD)'
      }
    ]
  },
  'budget-friendly': {
    message: `# Budget-Friendly Travel Destinations

Traveling doesn't have to break the bank! Here are some amazing destinations that offer incredible value:

## Southeast Asian Gem
[Bali](#bali-001) offers an incredible mix of beautiful beaches, ancient temples, lush rice terraces, and vibrant culture—all at very affordable prices. You can enjoy luxury experiences on a backpacker budget.

## Eastern European Treasure
[Prague](#prague-001) is one of Europe's most affordable capitals while still offering stunning architecture, rich history, and an amazing food and beer scene. The medieval old town is like stepping back in time.

## Central American Paradise
[Costa Rica](#costa-rica-001) provides incredible biodiversity, beautiful beaches on two coasts, and plenty of adventure activities. With various accommodation options, it suits every budget level.

*Remember:* Travel during shoulder seasons for even better deals!`,
    sources: [
      {
        id: 'bali-001',
        name: 'Bali',
        description: 'This Indonesian island paradise offers an incredible diversity of experiences—from surfing and beach clubs to ancient temples and yoga retreats. The warm Balinese hospitality and affordable prices make it perfect for all types of travelers.',
        highlights: ['Ubud Rice Terraces', 'Uluwatu Temple', 'Seminyak Beach Clubs', 'Mount Batur Sunrise', 'Traditional Spa Treatments'],
        bestTime: 'April to October (dry season)',
        imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
        country: 'Indonesia',
        averageCost: '$30-80/day',
        language: 'Indonesian, Balinese',
        currency: 'Indonesian Rupiah (IDR)'
      },
      {
        id: 'prague-001',
        name: 'Prague',
        description: 'The Czech capital enchants visitors with its fairy-tale architecture, cobblestone streets, and thousand-year history. The city\'s affordability compared to Western Europe makes it an excellent value destination.',
        highlights: ['Charles Bridge', 'Prague Castle', 'Old Town Square', 'Czech Beer Culture', 'John Lennon Wall'],
        bestTime: 'May to September, December for Christmas markets',
        imageUrl: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=800',
        country: 'Czech Republic',
        averageCost: '$50-100/day',
        language: 'Czech',
        currency: 'Czech Koruna (CZK)'
      },
      {
        id: 'costa-rica-001',
        name: 'Costa Rica',
        description: 'This Central American nation is a paradise for nature lovers, with cloud forests, active volcanoes, and both Caribbean and Pacific coastlines. The country\'s commitment to conservation means incredible wildlife viewing opportunities.',
        highlights: ['Arenal Volcano', 'Manuel Antonio National Park', 'Monteverde Cloud Forest', 'Zip-lining', 'Wildlife Watching'],
        bestTime: 'December to April (dry season)',
        imageUrl: 'https://images.unsplash.com/photo-1518259102261-b40117eabbc9?w=800',
        country: 'Costa Rica',
        averageCost: '$60-120/day',
        language: 'Spanish',
        currency: 'Costa Rican Colón (CRC)'
      }
    ]
  }
};

export const suggestedQuestions = [
  'What are the best romantic destinations for couples?',
  'Recommend some adventure travel destinations',
  'Where can I travel on a budget?'
];

export function getMockResponse(query: string): ChatResponse {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('romantic') || lowerQuery.includes('couple') || lowerQuery.includes('honeymoon') || lowerQuery.includes('love')) {
    return mockResponses['romantic-destinations'];
  }

  if (lowerQuery.includes('adventure') || lowerQuery.includes('thrill') || lowerQuery.includes('hiking') || lowerQuery.includes('safari')) {
    return mockResponses['adventure-travel'];
  }

  if (lowerQuery.includes('budget') || lowerQuery.includes('cheap') || lowerQuery.includes('affordable') || lowerQuery.includes('value')) {
    return mockResponses['budget-friendly'];
  }

  // Default to romantic destinations
  return mockResponses['romantic-destinations'];
}
