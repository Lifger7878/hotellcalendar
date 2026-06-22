import { format, addDays, differenceInCalendarDays, isSameDay, isWithinInterval, parseISO } from 'date-fns';
import { uk } from 'date-fns/locale';
import type { Booking } from './types';

export const STATUS_COLORS: Record<string, string> = {
  confirmed: '#3b82f6',
  pending: '#f59e0b',
  checkin: '#10b981',
  checkout: '#6366f1',
  cancelled: '#94a3b8',
  noshow: '#ef4444',
};

export const STATUS_LABELS: Record<string, string> = {
  confirmed: 'Підтверджено',
  pending: 'Очікує',
  checkin: 'Заселений',
  checkout: 'Виселяється',
  cancelled: 'Скасовано',
  noshow: 'Не з\'явився',
};

export const SOURCE_LABELS: Record<string, string> = {
  direct: 'Прямий',
  'booking.com': 'Booking.com',
  airbnb: 'Airbnb',
  expedia: 'Expedia',
  phone: 'Телефон',
  other: 'Інше',
};

export const CATEGORY_LABELS: Record<string, string> = {
  standard: 'Стандарт',
  deluxe: 'Делюкс',
  suite: 'Люкс',
  apartment: 'Апартамент',
  restaurant: 'Ресторан',
};

export function getBookingsForRoom(bookings: Booking[], roomId: string): Booking[] {
  return bookings.filter((b) => b.roomId === roomId && b.status !== 'cancelled');
}

export function getBookingPosition(
  booking: Booking,
  startDate: Date,
  totalDays: number,
  cellWidth: number
): { left: number; width: number; visible: boolean } {
  const checkIn = parseISO(booking.checkIn);
  const checkOut = parseISO(booking.checkOut);
  const endDate = addDays(startDate, totalDays);

  if (checkOut <= startDate || checkIn >= endDate) {
    return { left: 0, width: 0, visible: false };
  }

  const visibleStart = checkIn < startDate ? startDate : checkIn;
  const visibleEnd = checkOut > endDate ? endDate : checkOut;

  const leftDays = differenceInCalendarDays(visibleStart, startDate);
  const widthDays = differenceInCalendarDays(visibleEnd, visibleStart);

  return {
    left: leftDays * cellWidth,
    width: Math.max(widthDays * cellWidth - 2, cellWidth - 2),
    visible: true,
  };
}

export function formatDateRange(checkIn: string, checkOut: string): string {
  const ci = parseISO(checkIn);
  const co = parseISO(checkOut);
  const nights = differenceInCalendarDays(co, ci);
  return `${format(ci, 'd MMM', { locale: uk })} – ${format(co, 'd MMM yyyy', { locale: uk })} · ${nights} ніч${nights === 1 ? '' : nights < 5 ? 'і' : 'ей'}`;
}

export function isDateInBooking(date: Date, booking: Booking): boolean {
  const ci = parseISO(booking.checkIn);
  const co = parseISO(booking.checkOut);
  return isWithinInterval(date, { start: ci, end: addDays(co, -1) });
}

export function getDaysArray(startDate: Date, count: number): Date[] {
  return Array.from({ length: count }, (_, i) => addDays(startDate, i));
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function getNights(checkIn: string, checkOut: string): number {
  return differenceInCalendarDays(parseISO(checkOut), parseISO(checkIn));
}

export const ROOM_COLORS = [
  '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444',
  '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1',
];
