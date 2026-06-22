import { format, addDays } from 'date-fns';
import type { Room, Booking, Guest } from './types';

const today = new Date();
const fmt = (d: Date) => format(d, 'yyyy-MM-dd');

export function generateDemoData(): { rooms: Room[]; bookings: Booking[]; guests: Guest[] } {
  const rooms: Room[] = [
    { id: 'r1', number: '101', name: 'Стандарт "Комфорт"', category: 'standard', capacity: 2, pricePerNight: 1200, color: '#3b82f6', floor: 1, amenities: ['WiFi', 'TV', 'Shower'], active: true },
    { id: 'r2', number: '102', name: 'Стандарт "Дабл"', category: 'standard', capacity: 2, pricePerNight: 1300, color: '#3b82f6', floor: 1, amenities: ['WiFi', 'TV', 'Shower'], active: true },
    { id: 'r3', number: '103', name: 'Стандарт "Твін"', category: 'standard', capacity: 2, pricePerNight: 1250, color: '#3b82f6', floor: 1, amenities: ['WiFi', 'TV', 'Shower'], active: true },
    { id: 'r4', number: '201', name: 'Делюкс "Преміум"', category: 'deluxe', capacity: 2, pricePerNight: 2200, color: '#8b5cf6', floor: 2, amenities: ['WiFi', 'TV', 'Bathtub', 'Minibar', 'Balcony'], active: true },
    { id: 'r5', number: '202', name: 'Делюкс "Сімейний"', category: 'deluxe', capacity: 4, pricePerNight: 2800, color: '#8b5cf6', floor: 2, amenities: ['WiFi', 'TV', 'Bathtub', 'Minibar', 'Balcony'], active: true },
    { id: 'r6', number: '301', name: 'Люкс "Панорама"', category: 'suite', capacity: 2, pricePerNight: 4500, color: '#f59e0b', floor: 3, amenities: ['WiFi', '4K TV', 'Jacuzzi', 'Minibar', 'Balcony', 'Sauna'], active: true },
    { id: 'r7', number: '302', name: 'Люкс "Президентський"', category: 'suite', capacity: 4, pricePerNight: 8000, color: '#f59e0b', floor: 3, amenities: ['WiFi', '4K TV', 'Jacuzzi', 'Minibar', 'Terrace', 'Sauna', 'Private pool'], active: true },
    { id: 'r8', number: 'A1', name: 'Апартамент "Міський"', category: 'apartment', capacity: 4, pricePerNight: 3500, color: '#10b981', floor: 4, amenities: ['WiFi', 'TV', 'Kitchen', 'Washing machine', 'Balcony'], active: true },
    { id: 'r9', number: 'R1', name: 'Ресторан (стіл A)', category: 'restaurant', capacity: 4, pricePerNight: 0, color: '#ef4444', amenities: ['Menu', 'Wine list'], active: true },
    { id: 'r10', number: 'R2', name: 'Ресторан (стіл B)', category: 'restaurant', capacity: 6, pricePerNight: 0, color: '#ef4444', amenities: ['Menu', 'Wine list', 'Private'], active: true },
  ];

  const guests: Guest[] = [
    { id: 'g1', firstName: 'Олена', lastName: 'Коваленко', phone: '+380671234567', email: 'olena@example.com' },
    { id: 'g2', firstName: 'Андрій', lastName: 'Мельник', phone: '+380502345678', email: 'andrii@example.com' },
    { id: 'g3', firstName: 'Марія', lastName: 'Шевченко', phone: '+380733456789', email: 'maria@example.com' },
    { id: 'g4', firstName: 'Іван', lastName: 'Бондаренко', phone: '+380664567890', email: 'ivan@example.com' },
    { id: 'g5', firstName: 'Тетяна', lastName: 'Кравчук', phone: '+380955678901', email: 'tanya@example.com' },
    { id: 'g6', firstName: 'Сергій', lastName: 'Поліщук', phone: '+380676789012', email: 'sergiy@example.com' },
    { id: 'g7', firstName: 'Наталія', lastName: 'Іваненко', phone: '+380507890123', email: 'natalia@example.com' },
    { id: 'g8', firstName: 'Михайло', lastName: 'Лисенко', phone: '+380738901234', email: 'mykhailo@example.com' },
  ];

  const bookings: Booking[] = [];
  let bIdx = 0;

  const addBooking = (
    roomId: string,
    guestId: string,
    guestName: string,
    startOffset: number,
    nights: number,
    status: Booking['status'],
    source: Booking['source'],
    price: number
  ) => {
    const checkIn = fmt(addDays(today, startOffset));
    const checkOut = fmt(addDays(today, startOffset + nights));
    bookings.push({
      id: `b${++bIdx}`,
      roomId,
      guestId,
      guestName,
      checkIn,
      checkOut,
      status,
      adults: 2,
      children: 0,
      totalPrice: price * nights,
      paidAmount: status === 'confirmed' || status === 'checkin' ? price * nights : 0,
      notes: '',
      source,
      createdAt: new Date().toISOString(),
    });
  };

  // Room 101
  addBooking('r1', 'g1', 'Олена Коваленко', -3, 5, 'checkin', 'direct', 1200);
  addBooking('r1', 'g3', 'Марія Шевченко', 4, 3, 'confirmed', 'booking.com', 1200);
  addBooking('r1', 'g5', 'Тетяна Кравчук', 12, 4, 'confirmed', 'airbnb', 1200);

  // Room 102
  addBooking('r2', 'g2', 'Андрій Мельник', -1, 2, 'checkin', 'phone', 1300);
  addBooking('r2', 'g6', 'Сергій Поліщук', 5, 7, 'confirmed', 'direct', 1300);
  addBooking('r2', 'g7', 'Наталія Іваненко', 18, 3, 'pending', 'booking.com', 1300);

  // Room 103
  addBooking('r3', 'g4', 'Іван Бондаренко', 2, 4, 'confirmed', 'direct', 1250);
  addBooking('r3', 'g8', 'Михайло Лисенко', 10, 5, 'confirmed', 'airbnb', 1250);

  // Room 201 Deluxe
  addBooking('r4', 'g5', 'Тетяна Кравчук', -2, 6, 'checkin', 'direct', 2200);
  addBooking('r4', 'g1', 'Олена Коваленко', 8, 4, 'confirmed', 'booking.com', 2200);
  addBooking('r4', 'g3', 'Марія Шевченко', 20, 3, 'confirmed', 'direct', 2200);

  // Room 202 Deluxe Family
  addBooking('r5', 'g2', 'Андрій Мельник', 1, 5, 'confirmed', 'phone', 2800);
  addBooking('r5', 'g4', 'Іван Бондаренко', 15, 6, 'pending', 'direct', 2800);

  // Suite 301
  addBooking('r6', 'g6', 'Сергій Поліщук', -1, 3, 'checkin', 'direct', 4500);
  addBooking('r6', 'g7', 'Наталія Іваненко', 7, 4, 'confirmed', 'booking.com', 4500);

  // Suite 302 Presidential
  addBooking('r7', 'g8', 'Михайло Лисенко', 3, 7, 'confirmed', 'direct', 8000);
  addBooking('r7', 'g1', 'Олена Коваленко', 20, 5, 'pending', 'airbnb', 8000);

  // Apartment
  addBooking('r8', 'g3', 'Марія Шевченко', -4, 8, 'checkin', 'direct', 3500);
  addBooking('r8', 'g5', 'Тетяна Кравчук', 10, 5, 'confirmed', 'booking.com', 3500);

  return { rooms, bookings, guests };
}
