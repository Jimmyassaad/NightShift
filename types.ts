export type UserRole = 'PLANNER' | 'DJ' | 'ADMIN';

export enum BookingStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export enum Genre {
  HOUSE = 'House',
  TECHNO = 'Techno',
  RNB = 'RnB',
  COMMERCIAL = 'Commercial',
  ARABIC = 'Arabic',
  HIPHOP = 'Hip Hop',
  OPEN_FORMAT = 'Open Format'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  plannerId: string;
  subscriptionTier: 'FREE' | 'PRO';
  image?: string;
}

export interface DJRates {
  weekday: number;
  weekend: number;
  holiday: number;
  peakMultiplier: number; // e.g., 1.2
  travelBaseFee: number;
  travelRatePerKm: number;
}

export interface DJProfile {
  id: string; // Same as User ID
  stageName: string;
  bio: string;
  city: string;
  genres: Genre[];
  baseRate: number; // Kept for backward compatibility/sorting (usually weekday rate)
  detailedRates: DJRates;
  rateType: 'HOURLY' | 'FLAT';
  travelRadiusKm: number;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  socials: {
    soundcloud?: string;
    instagram?: string;
  };
  blockedDates: string[]; // ISO date strings
}

export interface Booking {
  id: string;
  plannerId: string;
  djId: string;
  venueId: string;
  date: string; // ISO Date string
  timeStart: string; // HH:mm
  durationHours: number;
  status: BookingStatus;
  agreedFee: number;
  platformFee: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  profile: DJProfile | null; // If user is DJ
  venues: Venue[]; // If user is Planner
  isAuthenticated: boolean;
}