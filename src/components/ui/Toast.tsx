'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaCheck, FaXmark } from 'react-icons/fa6';

type ToastType = 'success' | 'error' | 'info';

type ToastProps = {
  open: boolean;
  type?: ToastType;
  title: string;
  message?: string;
  duration?: number; // ms
  onClose: () => void;
};

export default function Toast({ open, type = 'success', title, message, duration = 3500, onClose }: ToastProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [open, duration, onClose]);

  if (!open || !mounted) return null;

  const bgColor = {
    success: 'bg-green-500/20 border-green-500/30',
    error: 'bg-red-500/20 border-red-500/30',
    info: 'bg-blue-500/20 border-blue-500/30',
  }[type];

  const iconColor = {
    success: 'text-green-400',
    error: 'text-red-400',
    info: 'text-blue-400',
  }[type];

  const icon = {
    success: <FaCheck size={18} />,
    error: <FaXmark size={18} />,
    info: <FaCheck size={18} />,
  }[type];

  const toast = (
    <div className='fixed bottom-6 right-6 z-[10000] max-w-sm animate-in slide-in-from-right-full duration-300'>
      <div className={`rounded-2xl border ${bgColor} backdrop-blur p-4 flex gap-3 items-start`}>
        <div className={`shrink-0 mt-0.5 ${iconColor}`}>{icon}</div>
        <div className='flex-1 min-w-0'>
          <p className='text-sm font-semibold text-white'>{title}</p>
          {message && <p className='text-xs text-white/70 mt-1'>{message}</p>}
        </div>
        <button
          onClick={onClose}
          className='shrink-0 text-white/60 hover:text-white/80 transition-colors'
          aria-label='Fechar notificação'
        >
          <FaXmark size={14} />
        </button>
      </div>
    </div>
  );

  return createPortal(toast, document.body);
}
