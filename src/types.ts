export type RoomCategory = 'standard' | 'deluxe' | 'suite' | 'apartment' | 'restaurant';

export interface Room {
  id: string;
  number: string;
  name: string;
  category: RoomCategory;
  capacity: number;
  pricePerNight: number;
  color: string;
  floor?: number;
  amenities: string[];
  active: boolean;
}

export type BookingStatus = 'confirmed' | 'pending' | 'checkin' | 'checkout' | 'cancelled' | 'noshow';

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  notes?: string;
}

export interface Booking {
  id: string;
  roomId: string;
  guestId: string;
  guestName: string;
  checkIn: string;   // ISO date string YYYY-MM-DD
  checkOut: string;  // ISO date string YYYY-MM-DD
  status: BookingStatus;
  adults: number;
  children: number;
  totalPrice: number;
  paidAmount: number;
  notes: string;
  source: 'direct' | 'booking.com' | 'airbnb' | 'expedia' | 'phone' | 'other';
  createdAt: string;
  color?: string;
}

export interface CalendarView {
  startDate: string;
  days: number;
}

export type FilterStatus = BookingStatus | 'all';

export interface HotelProfile {
  id?: string;
  userId: string;
  hotelName: string;
  address?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}
