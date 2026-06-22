import { useState } from 'react';
import {
  BedDouble,
  CalendarDays,
  BarChart3,
  Shield,
  Zap,
  Users,
  CheckCircle2,
  ArrowRight,
  Globe,
  Star,
  ChevronRight,
} from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
  onDemo: () => void;
  hasSupabase: boolean;
}

const FEATURES = [
  {
    icon: CalendarDays,
    title: 'Гант-календар',
    desc: 'Інтерактивна шкала бронювань по кімнатах. Одним поглядом видно зайнятість на місяці вперед.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: BedDouble,
    title: 'Управління номерами',
    desc: 'Готелі, ресторани, зали — будь-яка категорія. Кольори, ціни, місткість і статуси.',
    color: 'bg-indigo-100 text-indigo-600',
  },
  {
    icon: Users,
    title: 'База гостей',
    desc: 'Зберігайте контакти, телефони та нотатки для кожного гостя. Швидкий пошук.',
    color: 'bg-violet-100 text-violet-600',
  },
  {
    icon: BarChart3,
    title: 'Статистика',
    desc: 'Завантаженість, виручка, кількість заїздів — все в одному dashboard.',
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    icon: Shield,
    title: 'Ваші дані — тільки ваші',
    desc: 'Кожен готель бачить лише свої дані. Ізоляція на рівні бази даних.',
    color: 'bg-amber-100 text-amber-600',
  },
  {
    icon: Zap,
    title: 'Миттєве оновлення',
    desc: 'Зміни зберігаються в хмарі в реальному часі. Доступно з телефону та ПК.',
    color: 'bg-rose-100 text-rose-600',
  },
];

const STEPS = [
  { num: '01', title: 'Зареєструйтесь', desc: 'Введіть email і пароль або увійдіть через Google — займає 30 секунд.' },
  { num: '02', title: 'Налаштуйте номери', desc: 'Додайте свої номери, зали чи ресторанні столики. Оберіть категорії та ціни.' },
  { num: '03', title: 'Приймайте бронювання', desc: 'Додавайте бронювання прямо на календарі. Відстежуйте статуси й виручку.' },
];

const REVIEWS = [
  { name: 'Олена Коваль', hotel: 'Готель «Карпати»', text: 'Нарешті зручний календар без Excel. Персонал освоїв за день!', stars: 5 },
  { name: 'Максим Петренко', hotel: 'Ресторан «Смак»', text: 'Веду бронювання залів вже 3 місяці. Все наочно і зручно.', stars: 5 },
  { name: 'Тетяна Мороз', hotel: 'Міні-готель «Затишок»', text: 'Зручно, що все онлайн. Перевіряю завантаженість прямо з телефона.', stars: 5 },
];

export function LandingPage({ onLogin, onRegister, onDemo, hasSupabase }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ── NAV ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BedDouble size={18} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">HotelCalendar</span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Можливості</a>
            <a href="#how" className="hover:text-blue-600 transition-colors">Як це працює</a>
            <a href="#reviews" className="hover:text-blue-600 transition-colors">Відгуки</a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {!hasSupabase && (
              <button
                onClick={onDemo}
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100"
              >
                Демо
              </button>
            )}
            <button
              onClick={onLogin}
              className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors px-3 py-1.5"
            >
              Увійти
            </button>
            <button
              onClick={onRegister}
              className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Спробувати безкоштовно
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100"
            onClick={() => setMobileMenuOpen((v) => !v)}
          >
            <div className="w-5 h-0.5 bg-slate-700 mb-1.5" />
            <div className="w-5 h-0.5 bg-slate-700 mb-1.5" />
            <div className="w-5 h-0.5 bg-slate-700" />
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 flex flex-col gap-3">
            <a href="#features" className="text-sm text-slate-700 py-1" onClick={() => setMobileMenuOpen(false)}>Можливості</a>
            <a href="#how" className="text-sm text-slate-700 py-1" onClick={() => setMobileMenuOpen(false)}>Як це працює</a>
            <a href="#reviews" className="text-sm text-slate-700 py-1" onClick={() => setMobileMenuOpen(false)}>Відгуки</a>
            <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
              <button onClick={onLogin} className="w-full text-sm font-medium border border-slate-300 rounded-lg py-2.5 hover:bg-slate-50">Увійти</button>
              <button onClick={onRegister} className="w-full text-sm font-semibold bg-blue-600 text-white rounded-lg py-2.5 hover:bg-blue-700">Спробувати безкоштовно</button>
              {!hasSupabase && (
                <button onClick={onDemo} className="w-full text-xs text-slate-400 py-1">Або відкрити демо</button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20 pb-24 px-4">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <Globe size={12} />
            Для готелів, ресторанів та апартаментів України
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
            Календар бронювань{' '}
            <span className="text-blue-600">для вашого бізнесу</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Замінить Excel та записники. Один погляд на екран — і ви бачите всі бронювання,
            завантаженість та виручку. Простий, швидкий, безпечний.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onRegister}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base px-8 py-3.5 rounded-xl shadow-lg shadow-blue-200 transition-all hover:shadow-blue-300 hover:-translate-y-0.5"
            >
              Спробувати безкоштовно
              <ArrowRight size={18} />
            </button>
            <button
              onClick={onLogin}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-medium text-base px-8 py-3.5 rounded-xl border border-slate-200 shadow-sm transition-all hover:-translate-y-0.5"
            >
              Вже є акаунт? Увійти
            </button>
          </div>

          {!hasSupabase && (
            <button
              onClick={onDemo}
              className="mt-4 text-sm text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors"
            >
              Переглянути демо без реєстрації →
            </button>
          )}

          {/* Social proof pill */}
          <div className="mt-12 inline-flex items-center gap-3 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-sm text-sm text-slate-600">
            <div className="flex -space-x-2">
              {['🏨', '🏩', '🍽️'].map((e, i) => (
                <div key={i} className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs">{e}</div>
              ))}
            </div>
            <span>Вже використовують <span className="font-semibold text-slate-900">готелі та ресторани</span></span>
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────── */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Все що потрібно для управління бронюваннями
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              Жодних зайвих функцій — тільки те, що реально потрібне готельному та ресторанному бізнесу.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group p-6 rounded-2xl border border-slate-100 bg-white hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all duration-200"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  <f.icon size={22} />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────── */}
      <section id="how" className="py-20 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Почати легко — 3 кроки
            </h2>
            <p className="text-lg text-slate-500">Реєстрація займає хвилину, налаштування — ще п'ять.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-0 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[calc(16.67%+1.25rem)] right-[calc(16.67%+1.25rem)] h-0.5 bg-blue-100" />

            {STEPS.map((s, i) => (
              <div key={s.num} className="flex-1 flex flex-col items-center text-center px-4 relative">
                <div className="w-20 h-20 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-black mb-5 shadow-lg shadow-blue-200 relative z-10">
                  {s.num}
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                {i < STEPS.length - 1 && (
                  <ChevronRight size={20} className="md:hidden text-blue-300 mt-3" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={onRegister}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5"
            >
              Спробувати зараз безкоштовно
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ── REVIEWS ─────────────────────────────────────────────── */}
      <section id="reviews" className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Що кажуть наші клієнти
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((r) => (
              <div
                key={r.name}
                className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: r.stars }).map((_, i) => (
                    <Star key={i} size={15} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-5">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                    {r.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-slate-900">{r.name}</div>
                    <div className="text-xs text-slate-400">{r.hotel}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ──────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Готові забути про Excel та паперові журнали?
          </h2>
          <p className="text-blue-100 text-lg mb-10">
            Зареєструйтесь безкоштовно і почніть вести бронювання вже сьогодні.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onRegister}
              className="flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
            >
              Реєстрація — це безкоштовно
              <ArrowRight size={18} />
            </button>
            <button
              onClick={onLogin}
              className="flex items-center gap-2 border border-white/30 text-white font-medium px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors"
            >
              Вже є акаунт
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-blue-200">
            {['Безкоштовна реєстрація', 'Ваші дані в безпеці', 'Без прихованих платежів'].map((t) => (
              <div key={t} className="flex items-center gap-1.5">
                <CheckCircle2 size={14} />
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <BedDouble size={15} className="text-white" />
            </div>
            <span className="font-bold text-white text-sm">HotelCalendar</span>
          </div>
          <p className="text-xs text-center">© {new Date().getFullYear()} HotelCalendar. Зроблено для готельного бізнесу України.</p>
          <div className="flex gap-4 text-xs">
            <button onClick={onLogin} className="hover:text-white transition-colors">Увійти</button>
            <button onClick={onRegister} className="hover:text-white transition-colors">Реєстрація</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
