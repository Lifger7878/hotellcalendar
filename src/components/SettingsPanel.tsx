import { useState, useEffect, useRef } from 'react';
import { Save, Building2, Phone, Mail, MapPin, Loader2, CheckCircle2, AlertCircle, Database, ExternalLink, Copy, Check, Upload, FileText } from 'lucide-react';
import { useHotelStore } from '../store';
import type { Room, Guest, Booking } from '../types';

const hasSupabase = !!(
  import.meta.env.VITE_SUPABASE_URL &&
  import.meta.env.VITE_SUPABASE_URL !== 'https://YOUR_PROJECT_ID.supabase.co'
);

export function SettingsPanel() {
  const { hotelProfile, saveHotelProfile, user } = useHotelStore();
  const [form, setForm] = useState({
    hotelName: '',
    address: '',
    phone: '',
    email: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (hotelProfile) {
      setForm({
        hotelName: hotelProfile.hotelName ?? '',
        address: hotelProfile.address ?? '',
        phone: hotelProfile.phone ?? '',
        email: hotelProfile.email ?? '',
      });
    }
  }, [hotelProfile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveHotelProfile(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-800">Профіль готелю</h2>
        <p className="text-sm text-slate-500 mt-0.5">Загальна інформація про ваш заклад</p>
      </div>

      {/* User info */}
      {user && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Обліковий запис</h3>
          <div className="flex items-center gap-3">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="" className="w-12 h-12 rounded-full" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-700 font-bold text-xl">{(user.name ?? user.email).charAt(0).toUpperCase()}</span>
              </div>
            )}
            <div>
              <div className="font-semibold text-slate-800">{user.name ?? 'Користувач'}</div>
              <div className="text-sm text-slate-500">{user.email}</div>
            </div>
          </div>
        </div>
      )}

      {/* Hotel profile form */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Інформація про готель</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <FormField
            icon={<Building2 size={15} />}
            label="Назва готелю *"
            placeholder="Наприклад: Готель Княжий Двір"
            value={form.hotelName}
            onChange={v => setForm(f => ({ ...f, hotelName: v }))}
          />
          <FormField
            icon={<MapPin size={15} />}
            label="Адреса"
            placeholder="вул. Хрещатик, 1, Київ"
            value={form.address}
            onChange={v => setForm(f => ({ ...f, address: v }))}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              icon={<Phone size={15} />}
              label="Телефон"
              placeholder="+380 44 123 45 67"
              value={form.phone}
              onChange={v => setForm(f => ({ ...f, phone: v }))}
            />
            <FormField
              icon={<Mail size={15} />}
              label="Email готелю"
              placeholder="info@hotel.com"
              value={form.email}
              onChange={v => setForm(f => ({ ...f, email: v }))}
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                saved
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              } disabled:opacity-60`}
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {saved ? 'Збережено ✓' : saving ? 'Збереження...' : 'Зберегти'}
            </button>
          </div>
        </form>
      </div>

      {/* Bedbooking import */}
      <BedbookingImport />

      {/* Supabase connection status */}
      <DatabaseGuide />
    </div>
  );
}

function DatabaseGuide() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const schemaUrl = 'https://supabase.com/dashboard/project/_/sql/new';

  const envExample = `VITE_SUPABASE_URL=https://xxxxxxxxxxx.supabase.co\nVITE_SUPABASE_ANON_KEY=eyJ...`;

  return (
    <div className="space-y-4">
      {/* Status card */}
      <div className={`rounded-xl border p-5 ${hasSupabase ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
        <div className="flex items-center gap-2.5 mb-1">
          {hasSupabase
            ? <CheckCircle2 size={18} className="text-green-600 flex-shrink-0" />
            : <AlertCircle size={18} className="text-amber-600 flex-shrink-0" />}
          <h3 className={`font-bold text-sm ${hasSupabase ? 'text-green-800' : 'text-amber-800'}`}>
            {hasSupabase ? 'База даних підключена ✓' : 'База даних не підключена — демо-режим'}
          </h3>
        </div>
        <p className={`text-xs leading-relaxed ${hasSupabase ? 'text-green-700' : 'text-amber-700'}`}>
          {hasSupabase
            ? 'Всі дані зберігаються на хмарному сервері Supabase. Ваші клієнти захищені.'
            : 'Дані зберігаються лише в браузері та скидаються після очищення кешу. Щоб клієнти не втратили дані — підключіть Supabase за інструкцією нижче.'}
        </p>
      </div>

      {!hasSupabase && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-5">
          <div className="flex items-center gap-2">
            <Database size={18} className="text-blue-600" />
            <h3 className="font-bold text-slate-800 text-sm">Підключення Supabase (безкоштовно)</h3>
          </div>

          <ol className="space-y-4 text-sm">
            {/* Step 1 */}
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">1</span>
              <div>
                <div className="font-semibold text-slate-800 mb-1">Створіть безкоштовний проект</div>
                <a
                  href="https://supabase.com/dashboard/sign-up"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2"
                >
                  Відкрити supabase.com <ExternalLink size={12} />
                </a>
                <div className="text-slate-500 text-xs mt-1">Реєстрація через GitHub — безкоштовно для малого бізнесу</div>
              </div>
            </li>

            {/* Step 2 */}
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">2</span>
              <div className="w-full">
                <div className="font-semibold text-slate-800 mb-1">Виконайте SQL схему</div>
                <div className="text-slate-500 text-xs mb-2">В панелі Supabase: SQL Editor → New query → вставте вміст файлу <code className="bg-slate-100 px-1 rounded">supabase-schema.sql</code> → Run</div>
                <a
                  href={schemaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2 text-xs"
                >
                  Відкрити SQL Editor <ExternalLink size={11} />
                </a>
              </div>
            </li>

            {/* Step 3 */}
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">3</span>
              <div className="w-full">
                <div className="font-semibold text-slate-800 mb-1">Скопіюйте ключі API</div>
                <div className="text-slate-500 text-xs mb-2">Settings → API → <code className="bg-slate-100 px-1 rounded">Project URL</code> та <code className="bg-slate-100 px-1 rounded">anon public</code></div>
              </div>
            </li>

            {/* Step 4 */}
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">4</span>
              <div className="w-full">
                <div className="font-semibold text-slate-800 mb-2">Відредагуйте файл <code className="bg-slate-100 px-1 rounded text-xs">.env.local</code></div>
                <div className="relative bg-slate-900 rounded-lg p-3 pr-10 text-xs font-mono text-green-400 overflow-x-auto">
                  <pre>{envExample}</pre>
                  <button
                    onClick={() => copy(envExample, 'env')}
                    className="absolute top-2 right-2 text-slate-400 hover:text-white transition-colors"
                    title="Копіювати"
                  >
                    {copied === 'env' ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </li>

            {/* Step 5 */}
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">5</span>
              <div>
                <div className="font-semibold text-slate-800 mb-1">Перезапустіть сервер</div>
                <div className="relative bg-slate-900 rounded-lg p-3 pr-10 text-xs font-mono text-green-400">
                  <code>npm run dev</code>
                  <button
                    onClick={() => copy('npm run dev', 'cmd')}
                    className="absolute top-2 right-2 text-slate-400 hover:text-white transition-colors"
                  >
                    {copied === 'cmd' ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </li>
          </ol>

          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-xs text-blue-700">
            <strong>Для продакшн-деплою:</strong> На Vercel/Netlify додайте ці ж змінні у Environment Variables (Settings → Environment Variables) — не зберігайте ключі у публічному коді.
          </div>
        </div>
      )}
    </div>
  );
}

// ---- CSV parser helpers ----
function parseCsvRow(line: string): string[] {
  const result: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { inQuotes = !inQuotes; continue; }
    if (ch === ',' && !inQuotes) { result.push(field); field = ''; continue; }
    field += ch;
  }
  result.push(field);
  return result;
}

function ddmmyyyyToIso(date: string): string {
  const [d, m, y] = date.split('.');
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

function mapStatus(s: string): Booking['status'] {
  if (s === '3') return 'cancelled';
  if (s === '2') return 'pending';
  return 'confirmed';
}

function parseBedbookingCsv(text: string): { rooms: Room[]; guests: Guest[]; bookings: Booking[] } {
  const lines = text.trim().split('\n').filter(Boolean);
  if (lines.length < 2) throw new Error('Порожній або невірний файл');

  const headers = parseCsvRow(lines[0]);
  const idx = (name: string) => headers.indexOf(name);

  const roomMap = new Map<string, Room>();
  const guestMap = new Map<string, Guest>();
  const bookings: Booking[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvRow(lines[i]);
    const get = (name: string) => cols[idx(name)]?.trim() ?? '';

    const roomId = get('RoomId');
    const roomName = get('RoomName') || `Кімната ${roomId}`;
    if (!roomMap.has(roomId)) {
      roomMap.set(roomId, {
        id: crypto.randomUUID(),
        number: roomId,
        name: roomName,
        category: 'standard',
        capacity: 2,
        pricePerNight: parseFloat(get('PricePerDay')) || 0,
        color: '#3b82f6',
        amenities: [],
        active: true,
      });
    }
    const room = roomMap.get(roomId)!;

    const clientName = get('ClientName').trim();
    const clientPhone = get('ClientPhone').trim();
    const guestKey = clientName.toLowerCase() + clientPhone;
    if (!guestMap.has(guestKey)) {
      const parts = clientName.split(' ');
      const firstName = parts[0] ?? clientName;
      const lastName = parts.slice(1).join(' ');
      guestMap.set(guestKey, {
        id: crypto.randomUUID(),
        firstName,
        lastName,
        phone: clientPhone,
        email: get('ClientEmail'),
      });
    }
    const guest = guestMap.get(guestKey)!;

    const checkIn = ddmmyyyyToIso(get('StartTime'));
    const checkOut = ddmmyyyyToIso(get('EndTime'));
    const totalPrice = parseFloat(get('Price')) || 0;
    const paidAmount = parseFloat(get('Provision')) || 0;
    const adults = parseInt(get('Persons')) || 1;
    const children = parseInt(get('Kids')) || 0;

    bookings.push({
      id: crypto.randomUUID(),
      roomId: room.id,
      guestId: guest.id,
      guestName: clientName,
      checkIn,
      checkOut,
      status: mapStatus(get('Status')),
      adults,
      children,
      totalPrice,
      paidAmount,
      notes: get('ClientNote'),
      source: 'other',
      createdAt: new Date().toISOString(),
    });
  }

  return {
    rooms: Array.from(roomMap.values()),
    guests: Array.from(guestMap.values()),
    bookings,
  };
}

function BedbookingImport() {
  const { importBedbookingData, showToast } = useHotelStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<{ rooms: number; bookings: number; guests: number } | null>(null);
  const [parsed, setParsed] = useState<{ rooms: Room[]; guests: Guest[]; bookings: Booking[] } | null>(null);
  const [error, setError] = useState('');
  const [importing, setImporting] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setPreview(null);
    setParsed(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string;
        const result = parseBedbookingCsv(text);
        setParsed(result);
        setPreview({ rooms: result.rooms.length, guests: result.guests.length, bookings: result.bookings.length });
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Помилка читання файлу');
      }
    };
    reader.readAsText(file, 'utf-8');
  };

  const handleImport = async () => {
    if (!parsed) return;
    setImporting(true);
    try {
      const result = await importBedbookingData(parsed.rooms, parsed.guests, parsed.bookings);
      showToast(`Імпортовано: ${result.rooms} номерів, ${result.bookings} бронювань`, 'success');
      setParsed(null);
      setPreview(null);
      if (fileRef.current) fileRef.current.value = '';
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Помилка імпорту');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Upload size={18} className="text-blue-600" />
        <h3 className="font-bold text-slate-800 text-sm">Імпорт з Bedbooking</h3>
      </div>
      <p className="text-xs text-slate-500 mb-4">
        Завантажте CSV-файл експорту Bedbooking — усі номери та бронювання будуть додані до вашого календаря.
      </p>

      <label className="flex items-center gap-3 cursor-pointer border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-4 transition-colors">
        <FileText size={24} className="text-slate-400 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-slate-700">Оберіть CSV файл</div>
          <div className="text-xs text-slate-400">Bedbooking_export_*.csv</div>
        </div>
        <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
      </label>

      {error && (
        <div className="mt-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>
      )}

      {preview && (
        <div className="mt-4 space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm">
            <div className="font-semibold text-blue-800 mb-1">Знайдено в файлі:</div>
            <div className="text-blue-700 text-xs space-y-0.5">
              <div>🏨 Номерів: <strong>{preview.rooms}</strong></div>
              <div>👤 Гостей: <strong>{preview.guests}</strong></div>
              <div>📅 Бронювань: <strong>{preview.bookings}</strong></div>
            </div>
          </div>
          <button
            onClick={handleImport}
            disabled={importing}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-60"
          >
            {importing ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
            {importing ? 'Імпортування...' : 'Імпортувати все'}
          </button>
        </div>
      )}
    </div>
  );
}

function FormField({
  icon, label, placeholder, value, onChange,
}: {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 transition-colors"
        />
      </div>
    </div>
  );
}
