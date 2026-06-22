import { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useHotelStore } from '../store';
import { CATEGORY_LABELS, ROOM_COLORS } from '../utils';
import type { Room, RoomCategory } from '../types';

const CATEGORIES: RoomCategory[] = ['standard', 'deluxe', 'suite', 'apartment', 'restaurant'];
const AMENITY_OPTIONS = ['WiFi', 'TV', '4K TV', 'Shower', 'Bathtub', 'Jacuzzi', 'Minibar', 'Balcony', 'Terrace', 'Kitchen', 'Sauna', 'Parking', 'Air conditioning', 'Sea view'];

export function RoomModal() {
  const { isRoomModalOpen, editingRoom, closeRoomModal, saveRoom, deleteRoom } = useHotelStore();
  const [form, setForm] = useState<Partial<Room>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingRoom) {
      setForm({ ...editingRoom });
      setErrors({});
    }
  }, [editingRoom]);

  if (!isRoomModalOpen) return null;

  const isEdit = !!form.id;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.number?.trim()) e.number = 'Вкажіть номер кімнати';
    if (!form.name?.trim()) e.name = 'Вкажіть назву';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (!form.color) form.color = ROOM_COLORS[0];
    saveRoom(form);
  };

  const handleDelete = () => {
    if (form.id && window.confirm('Видалити цей номер?')) {
      deleteRoom(form.id);
      closeRoomModal();
    }
  };

  const toggleAmenity = (a: string) => {
    const list = form.amenities ?? [];
    setForm((prev) => ({
      ...prev,
      amenities: list.includes(a) ? list.filter((x) => x !== a) : [...list, a],
    }));
  };

  const set = (key: keyof Room, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800 rounded-t-2xl">
          <h2 className="text-white font-bold text-lg">
            {isEdit ? 'Редагувати номер' : 'Новий номер'}
          </h2>
          <button onClick={closeRoomModal} className="text-white/80 hover:text-white">
            <X size={22} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Номер * (напр. 101)</label>
              <input
                type="text"
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.number ? 'border-red-400' : 'border-slate-300'}`}
                value={form.number ?? ''}
                onChange={(e) => set('number', e.target.value)}
              />
              {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Поверх</label>
              <input
                type="number"
                min={0}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.floor ?? ''}
                onChange={(e) => set('floor', e.target.value ? +e.target.value : undefined)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Назва *</label>
            <input
              type="text"
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-400' : 'border-slate-300'}`}
              placeholder='напр. "Стандарт Комфорт"'
              value={form.name ?? ''}
              onChange={(e) => set('name', e.target.value)}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Категорія</label>
              <select
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.category ?? 'standard'}
                onChange={(e) => set('category', e.target.value as RoomCategory)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Місткість (ос.)</label>
              <input
                type="number"
                min={1}
                max={30}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.capacity ?? 2}
                onChange={(e) => set('capacity', +e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Ціна за ніч (₴)</label>
            <input
              type="number"
              min={0}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.pricePerNight ?? 0}
              onChange={(e) => set('pricePerNight', +e.target.value)}
            />
          </div>

          {/* Color picker */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Колір</label>
            <div className="flex gap-2 flex-wrap">
              {ROOM_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => set('color', c)}
                  className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
                  style={{
                    background: c,
                    borderColor: form.color === c ? '#1e293b' : 'transparent',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Зручності</label>
            <div className="flex flex-wrap gap-2">
              {AMENITY_OPTIONS.map((a) => {
                const selected = (form.amenities ?? []).includes(a);
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() => toggleAmenity(a)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      selected
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400'
                    }`}
                  >
                    {a}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-slate-700">Активний</label>
            <button
              type="button"
              onClick={() => set('active', !form.active)}
              className={`relative w-11 h-6 rounded-full transition-colors ${form.active ? 'bg-blue-600' : 'bg-slate-300'}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.active ? 'translate-x-5' : ''}`}
              />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 pb-6 gap-3">
          {isEdit ? (
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 text-red-500 hover:text-red-700 text-sm font-medium"
            >
              <Trash2 size={16} />
              Видалити
            </button>
          ) : (
            <div />
          )}
          <div className="flex gap-2">
            <button
              onClick={closeRoomModal}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 text-sm font-medium hover:bg-slate-50"
            >
              Скасувати
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-lg bg-slate-800 text-white text-sm font-semibold hover:bg-slate-700"
            >
              {isEdit ? 'Зберегти' : 'Додати'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
