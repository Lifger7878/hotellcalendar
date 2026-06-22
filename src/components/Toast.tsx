import { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useHotelStore } from '../store';

export function Toast() {
  const { toast, clearToast } = useHotelStore();

  useEffect(() => {
    if (toast) {
      const t = setTimeout(clearToast, 3500);
      return () => clearTimeout(t);
    }
  }, [toast, clearToast]);

  if (!toast) return null;

  const config = {
    success: { icon: <CheckCircle2 size={18} />, bg: 'bg-green-600', text: 'text-white' },
    error: { icon: <AlertCircle size={18} />, bg: 'bg-red-600', text: 'text-white' },
    info: { icon: <Info size={18} />, bg: 'bg-slate-700', text: 'text-white' },
  }[toast.type];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-4 duration-300">
      <div className={`${config.bg} ${config.text} flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium max-w-sm`}>
        {config.icon}
        <span className="flex-1">{toast.message}</span>
        <button onClick={clearToast} className="opacity-70 hover:opacity-100 transition-opacity ml-2">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
