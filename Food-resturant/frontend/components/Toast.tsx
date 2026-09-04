'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

let toastId = 0;
const listeners: Array<(toast: Toast) => void> = [];

export const toast = {
  success: (message: string) => {
    const id = String(++toastId);
    const newToast: Toast = { id, message, type: 'success' };
    listeners.forEach(listener => listener(newToast));
  },
  error: (message: string) => {
    const id = String(++toastId);
    const newToast: Toast = { id, message, type: 'error' };
    listeners.forEach(listener => listener(newToast));
  },
  info: (message: string) => {
    const id = String(++toastId);
    const newToast: Toast = { id, message, type: 'info' };
    listeners.forEach(listener => listener(newToast));
  }
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (newToast: Toast) => {
      setToasts(prev => [...prev, newToast]);
      
      // Auto remove after 4 seconds
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id));
      }, 4000);
    };

    listeners.push(listener);

    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-3 max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`
            flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg transform transition-all duration-300 animate-in slide-in-from-right
            ${t.type === 'success' ? 'bg-green-500/90 text-white' : ''}
            ${t.type === 'error' ? 'bg-red-500/90 text-white' : ''}
            ${t.type === 'info' ? 'bg-blue-500/90 text-white' : ''}
          `}
        >
          {t.type === 'success' && <CheckCircle className="w-5 h-5 shrink-0" />}
          {t.type === 'error' && <XCircle className="w-5 h-5 shrink-0" />}
          <span className="flex-1 text-sm font-medium">{t.message}</span>
          <button
            onClick={() => removeToast(t.id)}
            className="p-1 hover:bg-white/20 rounded-full transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
