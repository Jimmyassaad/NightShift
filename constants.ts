import { User, DJProfile, Venue, Booking, BookingStatus, Genre } from './types';

// --- Seed Data ---

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alice Planner', email: 'alice@nightshift.com', role: 'PLANNER', avatarUrl: 'https://picsum.photos/seed/alice/100/100' },
  { id: 'u2', name: 'Bob Booker', email: 'bob@nightshift.com', role: 'PLANNER', avatarUrl: 'https://picsum.photos/seed/bob/100/100' },
  { id: 'd1', name: 'David Spinner', email: 'david@dj.com', role: 'DJ', avatarUrl: 'https://picsum.photos/seed/david/100/100' },
  { id: 'd2', name: 'Sarah Bass', email: 'sarah@dj.com', role: 'DJ', avatarUrl: 'https://picsum.photos/seed/sarah/100/100' },
  { id: 'd3', name: 'Mike Drop', email: 'mike@dj.com', role: 'DJ', avatarUrl: 'https://picsum.photos/seed/mike/100/100' },
  { id: 'd4', name: 'Jenny Loop', email: 'jenny@dj.com', role: 'DJ', avatarUrl: 'https://picsum.photos/seed/jenny/100/100' },
  { id: 'd5', name: 'Alex Beat', email: 'alex@dj.com', role: 'DJ', avatarUrl: 'https://picsum.photos/seed/alex/100/100' },
  { id: 'a1', name: 'Admin Super', email: 'admin@nightshift.com', role: 'ADMIN', avatarUrl: 'https://picsum.photos/seed/admin/100/100' },
];

export const MOCK_VENUES: Venue[] = [
  { id: 'v1', name: 'The Neon Lounge', address: '123 Main St, New York', plannerId: 'u1', subscriptionTier: 'PRO', image: 'https://picsum.photos/seed/venue1/400/300' },
  { id: 'v2', name: 'Underground Bunker', address: '45 Basement Ave, Brooklyn', plannerId: 'u1', subscriptionTier: 'PRO', image: 'https://picsum.photos/seed/venue2/400/300' },
  { id: 'v3', name: 'Skyline Rooftop', address: '88 High Rise Blvd, Manhattan', plannerId: 'u2', subscriptionTier: 'FREE', image: 'https://picsum.photos/seed/venue3/400/300' },
];

export const MOCK_DJ_PROFILES: DJProfile[] = [
  {
    id: 'd1',
    stageName: 'DJ Dave',
    bio: 'Spinning house and techno since 2010. Resident at minimal clubs.',
    city: 'New York',
    genres: [Genre.HOUSE, Genre.TECHNO],
    baseRate: 500,
    detailedRates: {
      weekday: 500,
      weekend: 800,
      holiday: 1200,
      peakMultiplier: 1.0,
      travelBaseFee: 50,
      travelRatePerKm: 2
    },
    rateType: 'FLAT',
    travelRadiusKm: 50,
    imageUrl: 'https://picsum.photos/seed/dj1/400/400',
    rating: 4.8,
    reviewCount: 120,
    socials: { instagram: '@djdave' },
    blockedDates: ['2023-11-25', '2023-11-26']
  },
  {
    id: 'd2',
    stageName: 'Sarah Bass',
    bio: 'Heavy basslines and broken beats. UK Garage specialist.',
    city: 'Brooklyn',
    genres: [Genre.RNB, Genre.OPEN_FORMAT],
    baseRate: 350,
    detailedRates: {
      weekday: 350,
      weekend: 550,
      holiday: 800,
      peakMultiplier: 1.2,
      travelBaseFee: 0,
      travelRatePerKm: 1
    },
    rateType: 'FLAT',
    travelRadiusKm: 20,
    imageUrl: 'https://picsum.photos/seed/dj2/400/400',
    rating: 4.5,
    reviewCount: 45,
    socials: { soundcloud: 'sarahbass' },
    blockedDates: []
  },
  {
    id: 'd3',
    stageName: 'Mike Drop',
    bio: 'Commercial hits and wedding vibes. I verify the vibe.',
    city: 'Queens',
    genres: [Genre.COMMERCIAL, Genre.RNB],
    baseRate: 100,
    detailedRates: {
      weekday: 100,
      weekend: 150,
      holiday: 250,
      peakMultiplier: 1.5,
      travelBaseFee: 100,
      travelRatePerKm: 5
    },
    rateType: 'HOURLY',
    travelRadiusKm: 100,
    imageUrl: 'https://picsum.photos/seed/dj3/400/400',
    rating: 4.9,
    reviewCount: 200,
    socials: { instagram: '@mikedrop' },
    blockedDates: []
  },
  {
    id: 'd4',
    stageName: 'J-Loop',
    bio: 'Experimental ambient and techno textures.',
    city: 'New York',
    genres: [Genre.TECHNO, Genre.ARABIC],
    baseRate: 600,
    detailedRates: {
      weekday: 600,
      weekend: 700,
      holiday: 1000,
      peakMultiplier: 1.0,
      travelBaseFee: 20,
      travelRatePerKm: 1
    },
    rateType: 'FLAT',
    travelRadiusKm: 10,
    imageUrl: 'https://picsum.photos/seed/dj4/400/400',
    rating: 4.2,
    reviewCount: 15,
    socials: {},
    blockedDates: []
  },
  {
    id: 'd5',
    stageName: 'Alex Beat',
    bio: 'Hip Hop open format specialist.',
    city: 'Bronx',
    genres: [Genre.HIPHOP, Genre.OPEN_FORMAT],
    baseRate: 400,
    detailedRates: {
      weekday: 400,
      weekend: 600,
      holiday: 900,
      peakMultiplier: 1.1,
      travelBaseFee: 30,
      travelRatePerKm: 2
    },
    rateType: 'FLAT',
    travelRadiusKm: 30,
    imageUrl: 'https://picsum.photos/seed/dj5/400/400',
    rating: 4.7,
    reviewCount: 80,
    socials: {},
    blockedDates: []
  },
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    plannerId: 'u1',
    djId: 'd1',
    venueId: 'v1',
    date: '2023-11-15',
    timeStart: '22:00',
    durationHours: 4,
    status: BookingStatus.COMPLETED,
    agreedFee: 500,
    platformFee: 25,
    createdAt: '2023-10-01T10:00:00Z',
    updatedAt: '2023-11-16T03:00:00Z'
  },
  {
    id: 'b2',
    plannerId: 'u1',
    djId: 'd2',
    venueId: 'v2',
    date: '2023-12-31',
    timeStart: '23:00',
    durationHours: 5,
    status: BookingStatus.CONFIRMED,
    agreedFee: 800,
    platformFee: 40,
    createdAt: '2023-11-05T14:00:00Z',
    updatedAt: '2023-11-06T09:00:00Z'
  },
  {
    id: 'b3',
    plannerId: 'u2',
    djId: 'd1',
    venueId: 'v3',
    date: '2024-01-20',
    timeStart: '21:00',
    durationHours: 3,
    status: BookingStatus.PENDING,
    agreedFee: 500,
    platformFee: 25,
    notes: 'Please play minimal house.',
    createdAt: '2023-11-20T11:00:00Z',
    updatedAt: '2023-11-20T11:00:00Z'
  }
];