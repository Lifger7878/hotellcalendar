import { useState } from 'react';
import { BedDouble, Mail, Lock, User, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { useHotelStore } from '../store';

type Mode = 'login' | 'register';

interface AuthPageProps {
  defaultMode?: Mode;
  onBack?: () => void;
}

export function AuthPage({ defaultMode = 'login', onBack }: AuthPageProps) {
  const { signIn, signUp, signInWithGoogle, authLoading, authError } = useHotelStore();
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setSuccess('');
    if (!email.trim() || !password.trim()) { setLocalError('Заповніть всі поля'); return; }
    if (mode === 'register' && !name.trim()) { setLocalError("Введіть ім'я"); return; }
    if (password.length < 6) { setLocalError('Пароль мінімум 6 символів'); return; }
    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        await signUp(email, password, name);
        setSuccess('Перевірте email для підтвердження реєстрації!');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Помилка';
      setLocalError(translateError(msg));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch {
      setLocalError('Помилка входу через Google');
    }
  };

  const error = localError || authError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-white/3 rounded-full" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Back to landing */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-blue-200 hover:text-white transition-colors text-sm mb-6"
          >
            <ArrowLeft size={15} />
            На головну
          </button>
        )}

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-lg mb-4">
            <BedDouble size={32} className="text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-white">HotelCalendar</h1>
          <p className="text-blue-200 mt-1 text-sm">Управління готелем — просто і зручно</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Tabs */}
          <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => { setMode('login'); setLocalError(''); setSuccess(''); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === 'login' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Вхід
            </button>
            <button
              onClick={() => { setMode('register'); setLocalError(''); setSuccess(''); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === 'register' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Реєстрація
            </button>
          </div>

          {/* Success */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-4">
              ✓ {success}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name (register only) */}
            {mode === 'register' && (
              <InputField
                icon={<User size={16} />}
                placeholder="Ваше ім'я"
                type="text"
                value={name}
                onChange={setName}
              />
            )}

            <InputField
              icon={<Mail size={16} />}
              placeholder="Email адреса"
              type="email"
              value={email}
              onChange={setEmail}
            />

            <div className="relative">
              <InputField
                icon={<Lock size={16} />}
                placeholder="Пароль"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={setPassword}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || authLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {(loading || authLoading) && <Loader2 size={16} className="animate-spin" />}
              {mode === 'login' ? 'Увійти' : 'Зареєструватися'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">або</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Google */}
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 py-3 rounded-xl text-sm font-semibold transition-colors"
          >
            <GoogleIcon />
            Продовжити з Google
          </button>

          {/* Demo note */}
          <div className="mt-5 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-700">
            <strong>Demo акаунт:</strong> email&nbsp;<code className="font-mono bg-amber-100 px-1 rounded">demo@hotel.com</code>&nbsp;/ пароль&nbsp;<code className="font-mono bg-amber-100 px-1 rounded">demo123</code>
            <button
              type="button"
              onClick={() => { setEmail('demo@hotel.com'); setPassword('demo123'); setMode('login'); }}
              className="block mt-1.5 text-amber-800 font-semibold underline underline-offset-2 hover:text-amber-900"
            >
              Заповнити автоматично →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({
  icon, placeholder, type, value, onChange,
}: {
  icon: React.ReactNode;
  placeholder: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 transition-colors"
        autoComplete={type === 'password' ? 'current-password' : type === 'email' ? 'email' : 'name'}
      />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function translateError(msg: string): string {
  if (msg.includes('Invalid login credentials')) return 'Невірний email або пароль';
  if (msg.includes('Email not confirmed')) return 'Підтвердіть email перед входом';
  if (msg.includes('User already registered')) return 'Цей email вже зареєстрований';
  if (msg.includes('Password should be')) return 'Пароль мінімум 6 символів';
  if (msg.includes('Unable to validate')) return 'Невірний email або пароль';
  return msg;
}
