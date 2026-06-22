import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format, addMonths, startOfMonth } from 'date-fns';
import { supabase } from './supabaseClient';
import type { Room, Booking, Guest, CalendarView, FilterStatus, HotelProfile, AuthUser } from './types';
import { generateDemoData } from './demoData';

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

/** Returns true when running in demo mode (no real Supabase user) */
function isDemo(userId: string | undefined): boolean {
  return !userId || userId === 'demo-user';
}

// -----------------------------------------------
// Supabase DB helpers (snake_case ↔ camelCase)
// -----------------------------------------------
function roomToDb(r: Room, userId: string) {
  return {
    id: r.id,
    user_id: userId,
    number: r.number,
    name: r.name,
    category: r.category,
    capacity: r.capacity,
    price_per_night: r.pricePerNight,
    color: r.color,
    floor: r.floor ?? null,
    amenities: r.amenities,
    active: r.active,
  };
}

function roomFromDb(r: Record<string, unknown>): Room {
  return {
    id: r.id as string,
    number: r.number as string,
    name: r.name as string,
    category: r.category as Room['category'],
    capacity: r.capacity as number,
    pricePerNight: r.price_per_night as number,
    color: r.color as string,
    floor: r.floor as number | undefined,
    amenities: (r.amenities as string[]) ?? [],
    active: r.active as boolean,
  };
}

function bookingToDb(b: Booking, userId: string) {
  return {
    id: b.id,
    user_id: userId,
    room_id: b.roomId,
    guest_id: b.guestId || null,
    guest_name: b.guestName,
    check_in: b.checkIn,
    check_out: b.checkOut,
    status: b.status,
    adults: b.adults,
    children: b.children,
    total_price: b.totalPrice,
    paid_amount: b.paidAmount,
    notes: b.notes,
    source: b.source,
    color: b.color ?? null,
  };
}

function bookingFromDb(r: Record<string, unknown>): Booking {
  return {
    id: r.id as string,
    roomId: r.room_id as string,
    guestId: (r.guest_id as string) ?? '',
    guestName: r.guest_name as string,
    checkIn: r.check_in as string,
    checkOut: r.check_out as string,
    status: r.status as Booking['status'],
    adults: r.adults as number,
    children: r.children as number,
    totalPrice: r.total_price as number,
    paidAmount: r.paid_amount as number,
    notes: (r.notes as string) ?? '',
    source: r.source as Booking['source'],
    color: r.color as string | undefined,
    createdAt: (r.created_at as string) ?? new Date().toISOString(),
  };
}

function guestFromDb(r: Record<string, unknown>): Guest {
  return {
    id: r.id as string,
    firstName: r.first_name as string,
    lastName: (r.last_name as string) ?? '',
    phone: (r.phone as string) ?? '',
    email: (r.email as string) ?? '',
    notes: r.notes as string | undefined,
  };
}

// -----------------------------------------------
// Store
// -----------------------------------------------
interface HotelStore {
  // Auth
  user: AuthUser | null;
  authLoading: boolean;
  authError: string | null;

  // Data
  rooms: Room[];
  bookings: Booking[];
  guests: Guest[];
  hotelProfile: HotelProfile | null;
  dataLoading: boolean;

  // Calendar
  calendarView: CalendarView;
  selectedBookingId: string | null;
  filterStatus: FilterStatus;
  searchQuery: string;

  // Modals
  isBookingModalOpen: boolean;
  editingBooking: Partial<Booking> | null;
  isRoomModalOpen: boolean;
  editingRoom: Partial<Room> | null;

  // Toast
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;

  // Auth actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  initAuth: () => Promise<void>;

  // Data actions
  loadData: () => Promise<void>;
  saveHotelProfile: (profile: Partial<HotelProfile>) => Promise<void>;

  // Calendar
  setCalendarView: (view: Partial<CalendarView>) => void;
  navigateMonth: (delta: number) => void;
  setSelectedBooking: (id: string | null) => void;
  setFilterStatus: (status: FilterStatus) => void;
  setSearchQuery: (q: string) => void;

  // Bookings
  openNewBooking: (roomId?: string, date?: string) => void;
  openEditBooking: (booking: Booking) => void;
  closeBookingModal: () => void;
  saveBooking: (booking: Partial<Booking>) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
  updateBookingStatus: (id: string, status: Booking['status']) => Promise<void>;

  // Rooms
  openNewRoom: () => void;
  openEditRoom: (room: Room) => void;
  closeRoomModal: () => void;
  saveRoom: (room: Partial<Room>) => Promise<void>;
  deleteRoom: (id: string) => Promise<void>;

  // Guests
  findOrCreateGuest: (name: string) => Promise<Guest>;

  // Toast
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  clearToast: () => void;
}

const demo = generateDemoData();

export const useHotelStore = create<HotelStore>()(
  persist(
    (set, get) => ({
      user: null,
      authLoading: true,
      authError: null,
      rooms: demo.rooms,
      bookings: demo.bookings,
      guests: demo.guests,
      hotelProfile: null,
      dataLoading: false,
      calendarView: {
        startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
        days: 30,
      },
      selectedBookingId: null,
      filterStatus: 'all',
      searchQuery: '',
      isBookingModalOpen: false,
      editingBooking: null,
      isRoomModalOpen: false,
      editingRoom: null,
      toast: null,

      // ---- AUTH ----
      initAuth: async () => {
        set({ authLoading: true });
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          set({
            user: {
              id: session.user.id,
              email: session.user.email ?? '',
              name: session.user.user_metadata?.full_name,
              avatarUrl: session.user.user_metadata?.avatar_url,
            },
            authLoading: false,
          });
          await get().loadData();
        } else {
          set({ authLoading: false });
        }

        supabase.auth.onAuthStateChange(async (_event, session) => {
          if (session?.user) {
            set({
              user: {
                id: session.user.id,
                email: session.user.email ?? '',
                name: session.user.user_metadata?.full_name,
                avatarUrl: session.user.user_metadata?.avatar_url,
              },
            });
            await get().loadData();
          } else {
            set({ user: null, rooms: demo.rooms, bookings: demo.bookings, guests: demo.guests });
          }
        });
      },

      signIn: async (email, password) => {
        // Demo account — works without Supabase
        if (email === 'demo@hotel.com' && password === 'demo123') {
          const demoUser: AuthUser = { id: 'demo-user', email: 'demo@hotel.com', name: 'Демо Готель' };
          set({ user: demoUser, authLoading: false, authError: null, rooms: demo.rooms, bookings: demo.bookings, guests: demo.guests });
          return;
        }
        set({ authLoading: true, authError: null });
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          set({ authLoading: false, authError: error.message });
          throw error;
        }
        set({ authLoading: false });
      },

      signUp: async (email, password, name) => {
        set({ authLoading: true, authError: null });
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (error) {
          set({ authLoading: false, authError: error.message });
          throw error;
        }
        set({ authLoading: false });
      },

      signInWithGoogle: async () => {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: window.location.origin },
        });
        if (error) throw error;
      },

      signOut: async () => {
        await supabase.auth.signOut();
        set({ user: null, rooms: demo.rooms, bookings: demo.bookings, guests: demo.guests, hotelProfile: null });
        get().showToast('Ви вийшли з системи', 'info');
      },

      // ---- DATA ----
      loadData: async () => {
        const { user } = get();
        if (!user || isDemo(user.id)) return; // demo user keeps demo data in state
        set({ dataLoading: true });

        const [roomsRes, bookingsRes, guestsRes, profileRes] = await Promise.all([
          supabase.from('rooms').select('*').eq('user_id', user.id).order('created_at'),
          supabase.from('bookings').select('*').eq('user_id', user.id).order('check_in'),
          supabase.from('guests').select('*').eq('user_id', user.id),
          supabase.from('hotel_profile').select('*').eq('user_id', user.id).single(),
        ]);

        if (roomsRes.error && roomsRes.error.code !== 'PGRST116') {
          get().showToast('Помилка завантаження номерів: ' + roomsRes.error.message, 'error');
        }
        if (bookingsRes.error && bookingsRes.error.code !== 'PGRST116') {
          get().showToast('Помилка завантаження бронювань: ' + bookingsRes.error.message, 'error');
        }

        set({
          rooms: roomsRes.data?.map(r => roomFromDb(r as Record<string, unknown>)) ?? [],
          bookings: bookingsRes.data?.map(b => bookingFromDb(b as Record<string, unknown>)) ?? [],
          guests: guestsRes.data?.map(g => guestFromDb(g as Record<string, unknown>)) ?? [],
          hotelProfile: profileRes.data
            ? { id: profileRes.data.id, userId: user.id, hotelName: profileRes.data.hotel_name, address: profileRes.data.address, phone: profileRes.data.phone, email: profileRes.data.email, logoUrl: profileRes.data.logo_url }
            : { userId: user.id, hotelName: 'Мій готель' },
          dataLoading: false,
        });
      },

      saveHotelProfile: async (profile) => {
        const { user, hotelProfile } = get();
        if (!user) return;
        const merged = { ...hotelProfile, ...profile, userId: user.id } as HotelProfile;
        if (isDemo(user.id)) {
          set({ hotelProfile: merged });
          get().showToast('Профіль збережено (демо-режим)');
          return;
        }
        const dbRow = { user_id: user.id, hotel_name: merged.hotelName, address: merged.address ?? null, phone: merged.phone ?? null, email: merged.email ?? null };
        const { error } = await supabase.from('hotel_profile').upsert(dbRow, { onConflict: 'user_id' });
        if (error) {
          get().showToast('Помилка збереження: ' + error.message, 'error');
        } else {
          set({ hotelProfile: merged });
          get().showToast('Профіль готелю збережено');
        }
      },

      // ---- CALENDAR ----
      setCalendarView: (view) => set((s) => ({ calendarView: { ...s.calendarView, ...view } })),
      navigateMonth: (delta) => {
        const { calendarView } = get();
        const newDate = addMonths(new Date(calendarView.startDate), delta);
        set({ calendarView: { ...calendarView, startDate: format(startOfMonth(newDate), 'yyyy-MM-dd') } });
      },
      setSelectedBooking: (id) => set({ selectedBookingId: id }),
      setFilterStatus: (status) => set({ filterStatus: status }),
      setSearchQuery: (q) => set({ searchQuery: q }),

      // ---- BOOKINGS ----
      openNewBooking: (roomId, date) =>
        set({
          isBookingModalOpen: true,
          editingBooking: {
            roomId: roomId ?? '',
            checkIn: date ?? format(new Date(), 'yyyy-MM-dd'),
            checkOut: date
              ? format(new Date(new Date(date).getTime() + 86400000), 'yyyy-MM-dd')
              : format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'),
            status: 'confirmed',
            adults: 2,
            children: 0,
            source: 'direct',
            notes: '',
          },
        }),

      openEditBooking: (booking) => set({ isBookingModalOpen: true, editingBooking: { ...booking } }),
      closeBookingModal: () => set({ isBookingModalOpen: false, editingBooking: null }),

      saveBooking: async (bookingData) => {
        const { user, bookings, rooms } = get();
        const guest = await get().findOrCreateGuest(bookingData.guestName ?? '');
        const nights = Math.max(1, (new Date(bookingData.checkOut!).getTime() - new Date(bookingData.checkIn!).getTime()) / 86400000);
        const room = rooms.find((r) => r.id === bookingData.roomId);

        if (bookingData.id) {
          const updated: Booking = { ...bookings.find(b => b.id === bookingData.id)!, ...bookingData, guestId: guest.id } as Booking;
          if (user && !isDemo(user.id)) {
            await supabase.from('bookings').update(bookingToDb(updated, user.id)).eq('id', updated.id);
          }
          set({ bookings: bookings.map(b => b.id === updated.id ? updated : b), isBookingModalOpen: false, editingBooking: null });
          get().showToast('Бронювання оновлено');
        } else {
          const newB: Booking = {
            id: uid(),
            roomId: bookingData.roomId ?? '',
            guestId: guest.id,
            guestName: bookingData.guestName ?? '',
            checkIn: bookingData.checkIn ?? '',
            checkOut: bookingData.checkOut ?? '',
            status: bookingData.status ?? 'confirmed',
            adults: bookingData.adults ?? 2,
            children: bookingData.children ?? 0,
            totalPrice: bookingData.totalPrice ?? (room?.pricePerNight ?? 0) * nights,
            paidAmount: bookingData.paidAmount ?? 0,
            notes: bookingData.notes ?? '',
            source: bookingData.source ?? 'direct',
            createdAt: new Date().toISOString(),
            color: bookingData.color,
          };
          if (user && !isDemo(user.id)) {
            const { data } = await supabase.from('bookings').insert(bookingToDb(newB, user.id)).select().single();
            if (data) newB.id = (data as Record<string, unknown>).id as string;
          }
          set({ bookings: [...bookings, newB], isBookingModalOpen: false, editingBooking: null });
          get().showToast('Бронювання створено');
        }
      },

      deleteBooking: async (id) => {
        const { user } = get();
        if (user && !isDemo(user.id)) await supabase.from('bookings').delete().eq('id', id);
        set((s) => ({ bookings: s.bookings.filter(b => b.id !== id) }));
        get().showToast('Бронювання видалено', 'info');
      },

      updateBookingStatus: async (id, status) => {
        const { user } = get();
        if (user && !isDemo(user.id)) await supabase.from('bookings').update({ status }).eq('id', id);
        set((s) => ({ bookings: s.bookings.map(b => b.id === id ? { ...b, status } : b) }));
      },

      // ---- ROOMS ----
      openNewRoom: () => set({ isRoomModalOpen: true, editingRoom: { active: true, amenities: [], category: 'standard', pricePerNight: 0, capacity: 2 } }),
      openEditRoom: (room) => set({ isRoomModalOpen: true, editingRoom: { ...room } }),
      closeRoomModal: () => set({ isRoomModalOpen: false, editingRoom: null }),

      saveRoom: async (roomData) => {
        const { user, rooms } = get();
        if (roomData.id) {
          const updated = { ...rooms.find(r => r.id === roomData.id)!, ...roomData } as Room;
          if (user && !isDemo(user.id)) await supabase.from('rooms').update(roomToDb(updated, user.id)).eq('id', updated.id);
          set({ rooms: rooms.map(r => r.id === updated.id ? updated : r), isRoomModalOpen: false, editingRoom: null });
          get().showToast('Номер оновлено');
        } else {
          const newRoom: Room = {
            id: uid(),
            number: roomData.number ?? '',
            name: roomData.name ?? '',
            category: roomData.category ?? 'standard',
            capacity: roomData.capacity ?? 2,
            pricePerNight: roomData.pricePerNight ?? 0,
            color: roomData.color ?? '#3b82f6',
            floor: roomData.floor,
            amenities: roomData.amenities ?? [],
            active: roomData.active ?? true,
          };
          if (user && !isDemo(user.id)) {
            const { data } = await supabase.from('rooms').insert(roomToDb(newRoom, user.id)).select().single();
            if (data) newRoom.id = (data as Record<string, unknown>).id as string;
          }
          set({ rooms: [...rooms, newRoom], isRoomModalOpen: false, editingRoom: null });
          get().showToast('Номер додано');
        }
      },

      deleteRoom: async (id) => {
        const { user } = get();
        if (user && !isDemo(user.id)) await supabase.from('rooms').delete().eq('id', id);
        set((s) => ({ rooms: s.rooms.filter(r => r.id !== id) }));
        get().showToast('Номер видалено', 'info');
      },

      // ---- GUESTS ----
      findOrCreateGuest: async (name) => {
        const { user, guests } = get();
        const [firstName, ...rest] = name.trim().split(' ');
        const lastName = rest.join(' ');
        const existing = guests.find(g => `${g.firstName} ${g.lastName}`.toLowerCase() === name.toLowerCase());
        if (existing) return existing;
        const newG: Guest = { id: uid(), firstName, lastName, phone: '', email: '' };
        if (user && !isDemo(user.id)) {
          const { data } = await supabase.from('guests').insert({ user_id: user.id, first_name: firstName, last_name: lastName }).select().single();
          if (data) newG.id = (data as Record<string, unknown>).id as string;
        }
        set((s) => ({ guests: [...s.guests, newG] }));
        return newG;
      },

      // ---- TOAST ----
      showToast: (message, type = 'success') => {
        set({ toast: { message, type } });
        setTimeout(() => get().clearToast(), 3500);
      },
      clearToast: () => set({ toast: null }),
    }),
    {
      name: 'hotel-calendar-storage',
      partialize: (state) => ({
        calendarView: state.calendarView,
        filterStatus: state.filterStatus,
      }),
    }
  )
);
