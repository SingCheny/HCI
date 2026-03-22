import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Trophy, X } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'achievement';
  title: string;
  message?: string;
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType>({ addToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

let globalAddToast: (toast: Omit<Toast, 'id'>) => void = () => {};

export function toast(t: Omit<Toast, 'id'>) {
  globalAddToast(t);
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 4000);
  }, []);

  useEffect(() => {
    globalAddToast = addToast;
  }, [addToast]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((x) => x.id !== id));
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    achievement: <Trophy className="w-5 h-5 text-yellow-400" />,
  };

  const borders = {
    success: 'border-l-green-500',
    error: 'border-l-red-500',
    achievement: 'border-l-yellow-500',
  };

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            className={`glass-strong rounded-xl p-4 border-l-4 ${borders[t.type]} flex items-start gap-3 min-w-[300px]`}
          >
            <div className="mt-0.5">{icons[t.type]}</div>
            <div className="flex-1">
              <p className="font-semibold text-white text-sm">{t.title}</p>
              {t.message && <p className="text-xs text-gray-300 mt-0.5">{t.message}</p>}
            </div>
            <button onClick={() => removeToast(t.id)} className="text-gray-400 hover:text-white transition">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export { ToastContext };
