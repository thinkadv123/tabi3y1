import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'error';
  onClose: () => void;
}

export default function Toast({ message, type = 'success', onClose }: ToastProps) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4">
      <div className={`
        flex items-center gap-4 p-4 rounded-2xl shadow-2xl border backdrop-blur-md
        ${type === 'success' 
          ? 'bg-emerald-50/90 border-emerald-200 text-emerald-800' 
          : 'bg-rose-50/90 border-rose-200 text-rose-800'}
      `}>
        {type === 'success' ? <CheckCircle className="shrink-0" /> : <XCircle className="shrink-0" />}
        <p className="font-bold text-sm flex-grow">{message}</p>
        <button onClick={onClose} className="p-1 hover:bg-black/5 rounded-lg transition-colors">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
