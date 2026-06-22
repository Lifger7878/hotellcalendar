import { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useHotelStore } from '../store';
import { STATUS_COLORS, STATUS_LABELS, SOURCE_LABELS, getNights } from '../utils';
import type { Booking } from '../types';

const STATUS_OPTIONS: Booking['status'][] = ['confirmed', 'pending', 'checkin', 'checkout', 'cancelled', 'noshow'];
const SOURCE_OPTIONS: Booking['source'][] = ['direct', 'booking.com', 'airbnb', 'expedia', 'phone', 'other'];

export function BookingModal() {
  const {
    isBookingModalOpen,
    editingBooking,
    rooms,
    closeBookingModal,
    saveBooking,
    deleteBooking,
  } = useHotelStore();

  const [form, setForm] = useState<Partial<Booking>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingBooking) {
      setForm({ ...editingBooking });
      setErrors({});
    }
  }, [editingBooking]);

  if (!isBookingModalOpen) return null;

  const isEdit = !!form.id;
  const room = rooms.find((r) => r.id === form.roomId);
  const nights = form.checkIn && form.checkOut ? getNights(form.checkIn, form.checkOut) : 0;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.guestName?.trim()) e.guestName = "Введіть ім'я гостя";
    if (!form.roomId) e.roomId = 'Оберіть номер';
    if (!form.checkIn) e.checkIn = 'Вкажіть дату заїзду';
    if (!form.checkOut) e.checkOut = 'Вкажіть дату виїзду';
    if (form.checkIn && form.checkOut && form.checkOut <= form.checkIn) {
      e.checkOut = 'Дата виїзду має бути після дати заїзду';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    // Auto-calculate total price if not set
    if (!form.totalPrice && room) {
      form.totalPrice = room.pricePerNight * nights;
    }
    saveBooking(form);
  };

  const handleDelete = () => {
    if (form.id && window.confirm('Видалити це бронювання?')) {
      deleteBooking(form.id);
      closeBookingModal();
    }
  };

  const set = (key: keyof Booking, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const accentColor = STATUS_COLORS[form.status ?? 'confirmed'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 rounded-t-2xl"
          style={{ background: accentColor }}
        >
          <h2 className="text-white font-bold text-lg">
            {isEdit ? 'Редагувати бронювання' : 'Нове бронювання'}
          </h2>
          <button
            onClick={closeBookingModal}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Guest name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Гість *</label>
            <input
              type="text"
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.guestName ? 'border-red-400' : 'border-slate-300'}`}
              placeholder="Ім'я та прізвище"
              value={form.guestName ?? ''}
              onChange={(e) => set('guestName', e.target.value)}
            />
            {errors.guestName && <p className="text-red-500 text-xs mt-1">{errors.guestName}</p>}
          </div>

          {/* Room */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Номер *</label>
            <select
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.roomId ? 'border-red-400' : 'border-slate-300'}`}
              value={form.roomId ?? ''}
              onChange={(e) => {
                const r = rooms.find((r) => r.id === e.target.value);
                set('roomId', e.target.value);
                if (r && form.checkIn && form.checkOut) {
                  const n = getNights(form.checkIn, form.checkOut);
                  set('totalPrice', r.pricePerNight * n);
                }
              }}
            >
              <option value="">-- Оберіть номер --</option>
              {rooms.filter((r) => r.active).map((r) => (
                <option key={r.id} value={r.id}>
                  {r.number} – {r.name} {r.pricePerNight > 0 ? `(₴${r.pricePerNight}/ніч)` : ''}
                </option>
              ))}
            </select>
            {errors.roomId && <p className="text-red-500 text-xs mt-1">{errors.roomId}</p>}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Заїзд *</label>
              <input
                type="date"
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.checkIn ? 'border-red-400' : 'border-slate-300'}`}
                value={form.checkIn ?? ''}
                onChange={(e) => {
                  set('checkIn', e.target.value);
                  if (room && form.checkOut) {
                    const n = getNights(e.target.value, form.checkOut);
                    if (n > 0) set('totalPrice', room.pricePerNight * n);
                  }
                }}
              />
              {errors.checkIn && <p className="text-red-500 text-xs mt-1">{errors.checkIn}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Виїзд *</label>
              <input
                type="date"
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.checkOut ? 'border-red-400' : 'border-slate-300'}`}
                value={form.checkOut ?? ''}
                min={form.checkIn ?? undefined}
                onChange={(e) => {
                  set('checkOut', e.target.value);
                  if (room && form.checkIn) {
                    const n = getNights(form.checkIn, e.target.value);
                    if (n > 0) set('totalPrice', room.pricePerNight * n);
                  }
                }}
              />
              {errors.checkOut && <p className="text-red-500 text-xs mt-1">{errors.checkOut}</p>}
            </div>
          </div>

          {/* Nights & price summary */}
          {nights > 0 && room && (
            <div className="bg-slate-50 rounded-lg px-4 py-3 text-sm text-slate-600 flex justify-between">
              <span>{nights} ніч · ₴{room.pricePerNight.toLocaleString()}/ніч</span>
              <span className="font-bold text-slate-800">₴{(nights * room.pricePerNight).toLocaleString()}</span>
            </div>
          )}

          {/* Status & source */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Статус</label>
              <select
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.status ?? 'confirmed'}
                onChange={(e) => set('status', e.target.value)}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Джерело</label>
              <select
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.source ?? 'direct'}
                onChange={(e) => set('source', e.target.value as Booking['source'])}
              >
                {SOURCE_OPTIONS.map((s) => (
                  <option key={s} value={s}>{SOURCE_LABELS[s]}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Guests count */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Дорослі</label>
              <input
                type="number"
                min={1}
                max={10}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.adults ?? 2}
                onChange={(e) => set('adults', +e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Діти</label>
              <input
                type="number"
                min={0}
                max={10}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.children ?? 0}
                onChange={(e) => set('children', +e.target.value)}
              />
            </div>
          </div>

          {/* Price & paid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Сума (₴)</label>
              <input
                type="number"
                min={0}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.totalPrice ?? 0}
                onChange={(e) => set('totalPrice', +e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Оплачено (₴)</label>
              <input
                type="number"
                min={0}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.paidAmount ?? 0}
                onChange={(e) => set('paidAmount', +e.target.value)}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Примітки</label>
            <textarea
              rows={3}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Додаткові побажання, особливі запити..."
              value={form.notes ?? ''}
              onChange={(e) => set('notes', e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 pb-6 gap-3">
          {isEdit ? (
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
            >
              <Trash2 size={16} />
              Видалити
            </button>
          ) : (
            <div />
          )}
          <div className="flex gap-2">
            <button
              onClick={closeBookingModal}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Скасувати
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-lg text-white text-sm font-semibold transition-colors"
              style={{ background: accentColor }}
            >
              {isEdit ? 'Зберегти' : 'Додати'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
