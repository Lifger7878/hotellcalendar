import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useHotelStore } from './store';
import { AuthPage } from './components/AuthPage';
import { LandingPage } from './components/LandingPage';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CalendarTimeline } from './components/CalendarTimeline';
import { BookingModal } from './components/BookingModal';
import { RoomModal } from './components/RoomModal';
import { RoomsPanel } from './components/RoomsPanel';
import { StatsPanel } from './components/StatsPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { Toast } from './components/Toast';

const hasSupabase = !!(
  import.meta.env.VITE_SUPABASE_URL &&
  import.meta.env.VITE_SUPABASE_URL !== 'https://YOUR_PROJECT_ID.supabase.co'
);

/** Open the cabinet in a new tab */
function openAppTab(mode: 'login' | 'register' = 'login') {
  const base = window.location.origin + window.location.pathname;
  window.open(base + (mode === 'register' ? '#register' : '#app'), '_blank');
}

export default function App() {
  const { user, authLoading, initAuth, signIn } = useHotelStore();
  const [activeTab, setActiveTab] = useState<'calendar' | 'rooms' | 'stats' | 'settings'>('calendar');

  // Detect which "page" we are:
  //   no hash  → landing page (public)
  //   #app     → cabinet / login
  //   #register → cabinet / register
  const hash = window.location.hash;
  const isAppTab = hash === '#app' || hash === '#register';
  const defaultAuthMode: 'login' | 'register' = hash === '#register' ? 'register' : 'login';

  useEffect(() => {
    if (isAppTab && !hasSupabase) {
      // Demo mode: auto-login so the cabinet opens immediately
      signIn('demo@hotel.com', 'demo123');
    } else {
      initAuth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── LANDING TAB (no hash) ────────────────────────────────────
  if (!isAppTab) {
    return (
      <>
        <LandingPage
          hasSupabase={hasSupabase}
          onLogin={() => openAppTab('login')}
          onRegister={() => openAppTab('register')}
          onDemo={() => openAppTab('login')}
        />
        <Toast />
      </>
    );
  }

  // ── APP TAB (#app / #register) ───────────────────────────────

  // Loading splash
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 size={40} className="animate-spin mx-auto mb-3 opacity-80" />
          <div className="text-lg font-semibold opacity-80">Завантаження...</div>
        </div>
      </div>
    );
  }

  // Not logged in → show auth form (no "back" button — landing is in the other tab)
  if (!user) {
    return (
      <>
        <AuthPage defaultMode={defaultAuthMode} />
        <Toast />
      </>
    );
  }

  // Logged in → dashboard
  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <Sidebar activeTab={activeTab} onTabChange={t => setActiveTab(t as typeof activeTab)} />

      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Header activeTab={activeTab} />

        <main className="flex-1 overflow-auto p-3 md:p-5">
          {activeTab === 'calendar' && <CalendarTimeline />}
          {activeTab === 'rooms' && <RoomsPanel />}
          {activeTab === 'stats' && <StatsPanel />}
          {activeTab === 'settings' && <SettingsPanel />}
        </main>
      </div>

      <BookingModal />
      <RoomModal />
      <Toast />
    </div>
  );
}

