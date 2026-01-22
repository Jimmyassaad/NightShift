import { Booking, BookingStatus, DJProfile, Venue, User } from '../types';
import { MOCK_BOOKINGS, MOCK_DJ_PROFILES, MOCK_USERS, MOCK_VENUES } from '../constants';

// In-memory storage for the session
let bookings = [...MOCK_BOOKINGS];
let profiles = JSON.parse(JSON.stringify(MOCK_DJ_PROFILES)); // Deep copy to allow mutation

export const MockDB = {
  getBookingsForPlanner: (plannerId: string): Booking[] => {
    return bookings.filter(b => b.plannerId === plannerId);
  },
  
  getBookingsForDJ: (djId: string): Booking[] => {
    return bookings.filter(b => b.djId === djId);
  },

  getAllBookings: (): Booking[] => {
    return bookings;
  },

  getDJProfile: (djId: string): DJProfile | undefined => {
    return profiles.find((p: DJProfile) => p.id === djId);
  },

  updateDJProfile: (djId: string, updates: Partial<DJProfile>): void => {
    const idx = profiles.findIndex((p: DJProfile) => p.id === djId);
    if (idx !== -1) {
      profiles[idx] = { ...profiles[idx], ...updates };
    }
  },

  getAllDJs: (): DJProfile[] => {
    return profiles;
  },

  createBooking: (booking: Booking): void => {
    bookings.push(booking);
  },

  updateBookingStatus: (bookingId: string, status: BookingStatus, newFee?: number): void => {
    const idx = bookings.findIndex(b => b.id === bookingId);
    if (idx !== -1) {
      bookings[idx] = { 
        ...bookings[idx], 
        status, 
        updatedAt: new Date().toISOString(),
        agreedFee: newFee ?? bookings[idx].agreedFee
      };
    }
  },

  toggleBlockDate: (djId: string, date: string): void => {
    const profile = profiles.find((p: DJProfile) => p.id === djId);
    if (profile) {
      if (profile.blockedDates.includes(date)) {
        profile.blockedDates = profile.blockedDates.filter((d: string) => d !== date);
      } else {
        profile.blockedDates.push(date);
      }
    }
  },

  getVenue: (venueId: string): Venue | undefined => {
    return MOCK_VENUES.find(v => v.id === venueId);
  },

  getUser: (userId: string): User | undefined => {
    return MOCK_USERS.find(u => u.id === userId);
  }
};