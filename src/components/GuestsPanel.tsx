import { useState } from 'react';
import { Trash2, Search, User, CheckSquare, Square, X } from 'lucide-react';
import { useHotelStore } from '../store';

export function GuestsPanel() {
  const { guests, bookings, deleteGuest } = useHotelStore();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  const filtered = guests.filter((g) => {
    const q = search.toLowerCase();
    return (
      g.firstName.toLowerCase().includes(q) ||
      g.lastName.toLowerCase().includes(q) ||
      g.phone.includes(q) ||
      g.email.toLowerCase().includes(q)
    );
  });

  const bookingCountFor = (guestId: string) =>
    bookings.filter((b) => b.guestId === guestId).length;

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((g) => g.id)));
    }
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm(`Видалити ${selected.size} гостей? Бронювання залишаться, але посилання на гостей буде знято.`)) return;
    setDeleting(true);
    for (const id of selected) {
      await deleteGuest(id);
    }
    setSelected(new Set());
    setDeleting(false);
  };

  const handleDeleteOne = (id: string, name: string) => {
    if (window.confirm(`Видалити гостя "${name}"?`)) {
      deleteGuest(id);
      setSelected((prev) => { const n = new Set(prev); n.delete(id); return n; });
    }
  };

  const allSelected = filtered.length > 0 && selected.size === filtered.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-bold text-slate-800">Гості</h2>
        <div className="flex items-center gap-2">
          {selected.size > 0 && (
            <>
              <span className="text-sm text-slate-500">{selected.size} обрано</span>
              <button
                onClick={() => setSelected(new Set())}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                title="Зняти вибір"
              >
                <X size={15} />
              </button>
              <button
                onClick={handleDeleteSelected}
                disabled={deleting}
                className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
              >
                <Trash2 size={14} />
                {deleting ? 'Видалення...' : `Видалити (${selected.size})`}
              </button>
            </>
          )}
          <span className="text-sm text-slate-500">{guests.length} записів</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Пошук за іменем, телефоном..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <User size={40} className="mx-auto mb-3 opacity-30" />
          <div className="text-sm">{search ? 'Нічого не знайдено' : 'Немає гостей'}</div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100">
          {/* Select all header */}
          <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-50 rounded-t-xl border-b border-slate-200">
            <button onClick={toggleAll} className="text-slate-500 hover:text-blue-600 transition-colors">
              {allSelected ? <CheckSquare size={17} className="text-blue-600" /> : <Square size={17} />}
            </button>
            <span className="text-xs text-slate-500 font-medium">
              {allSelected ? 'Зняти все' : 'Вибрати все'}
            </span>
          </div>

          {filtered.map((guest) => {
            const name = `${guest.firstName} ${guest.lastName}`.trim();
            const count = bookingCountFor(guest.id);
            const isSelected = selected.has(guest.id);
            return (
              <div
                key={guest.id}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer ${isSelected ? 'bg-blue-50' : ''}`}
                onClick={() => toggleOne(guest.id)}
              >
                <button
                  onClick={(e) => { e.stopPropagation(); toggleOne(guest.id); }}
                  className="text-slate-400 hover:text-blue-600 flex-shrink-0"
                >
                  {isSelected ? <CheckSquare size={17} className="text-blue-600" /> : <Square size={17} />}
                </button>
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-700 font-bold text-sm">
                    {guest.firstName.charAt(0).toUpperCase() || '?'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-slate-800 truncate">{name || '—'}</div>
                  <div className="text-xs text-slate-500 truncate">
                    {guest.phone && <span>{guest.phone}</span>}
                    {guest.phone && guest.email && <span className="mx-1">·</span>}
                    {guest.email && <span>{guest.email}</span>}
                    {!guest.phone && !guest.email && <span className="italic">без контактів</span>}
                  </div>
                </div>
                <div className="text-xs text-slate-400 flex-shrink-0 mr-2">
                  {count} бронюв.
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteOne(guest.id, name); }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0"
                  title="Видалити"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
