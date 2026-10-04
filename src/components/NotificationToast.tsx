import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, CheckCircle2, Info, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { toast, clearToast } = useApp();

  if (!toast) return null;

  const isCommission = toast.type === 'commission';

  return (
    <aside
      aria-label="Notification alert"
      className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      <div
        className={`p-4 rounded-2xl shadow-xl border flex items-start gap-3.5 ${
          isCommission
            ? 'bg-stone-900 text-white border-amber-400/40'
            : toast.type === 'success'
            ? 'bg-emerald-950 text-emerald-100 border-emerald-700/50'
            : 'bg-white text-stone-900 border-stone-200'
        }`}
      >
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            isCommission
              ? 'bg-amber-400 text-stone-950'
              : toast.type === 'success'
              ? 'bg-emerald-500 text-white'
              : 'bg-stone-100 text-stone-700'
          }`}
        >
          {isCommission ? (
            <Sparkles className="w-5 h-5" />
          ) : toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <Info className="w-5 h-5" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h5 className="text-xs font-bold font-mono uppercase tracking-wider">
              {toast.title}
            </h5>
            {toast.amount !== undefined && (
              <span className="text-xs font-bold text-amber-400 font-mono tabular-nums">
                +${toast.amount.toFixed(2)}
              </span>
            )}
          </div>
          <p className="text-xs opacity-90 mt-0.5 leading-relaxed font-sans">{toast.message}</p>
        </div>

        <button
          onClick={clearToast}
          className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
