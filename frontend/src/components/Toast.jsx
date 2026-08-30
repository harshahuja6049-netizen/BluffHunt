// frontend/src/components/Toast.jsx

import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'error', duration = 3500) => {
    if (!message) return;
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
        {toasts.map((toast) => {
          const isError = toast.type === 'error';
          const isSuccess = toast.type === 'success';
          const isWarning = toast.type === 'warning';

          const bgColor = isError
            ? 'bg-rose-950/90 border-rose-500/50 text-rose-200 shadow-rose-950/50'
            : isSuccess
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200 shadow-emerald-950/50'
              : isWarning
                ? 'bg-amber-950/90 border-amber-500/50 text-amber-200 shadow-amber-950/50'
                : 'bg-slate-900/90 border-white/20 text-white shadow-black/50';

          const icon = isError ? '⚠️' : isSuccess ? '✅' : isWarning ? '🔔' : 'ℹ️';

          return (
            <div
              key={toast.id}
              onClick={() => removeToast(toast.id)}
              className={`pointer-events-auto flex items-start gap-2.5 p-3.5 rounded-xl border backdrop-blur-md shadow-xl text-sm font-body cursor-pointer transition-all animate-bounce-short ${bgColor}`}
            >
              <span className="text-base shrink-0">{icon}</span>
              <span className="flex-1 break-words font-medium">{toast.message}</span>
              <button
                type="button"
                className="text-white/50 hover:text-white text-xs shrink-0 pl-1"
                onClick={(e) => {
                  e.stopPropagation();
                  removeToast(toast.id);
                }}
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      showToast: (msg) => console.log('Toast:', msg)
    };
  }
  return context;
};

export default ToastProvider;
