import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaMinus, FaPlus, FaXmark } from 'react-icons/fa6';
import Button from '../ui/Button';

type GoalResponse = {
  current_goal: { daily_pages: number; valid_from: string };
  next_goal: { daily_pages: number; valid_from: string };
};

type ChangeGoalModalProps = {
  open: boolean;
  currentGoal: number;
  onClose: () => void;
  onSubmit: (newGoal: number) => Promise<GoalResponse> | GoalResponse;
};

function Spinner() {
  return <span className='inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#0F0C22]/30 border-t-[#0F0C22]' aria-hidden='true' />;
}

export default function ChangeGoalModal({ open, currentGoal, onClose, onSubmit }: ChangeGoalModalProps) {
  const [mounted, setMounted] = useState(false);
  const [goal, setGoal] = useState(currentGoal);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setGoal(currentGoal);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [open, currentGoal]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (submitting) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter') void handleSubmit();
    };

    window.addEventListener('keydown', onKeyDown);

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [open, submitting]);

  const clamp = (n: number) => Math.max(1, Math.min(999, n));

  const handleSubmit = async () => {
    if (submitting) return;
    const newGoal = clamp(Number(goal || currentGoal));

    if (newGoal === currentGoal) {
      onClose();
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await onSubmit(newGoal);
      onClose();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Não consegui alterar a meta agora. Tenta de novo?';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!open || !mounted) return null;

  const modal = (
    <div
      className='fixed inset-0 z-[9999] flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center'
      role='dialog'
      aria-modal='true'
      aria-label='Alterar meta diária'
      onMouseDown={(e) => {
        if (submitting) return;
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className='w-full max-w-md overflow-hidden rounded-3xl bg-[#0F0C22]/90 ring-1 ring-white/10'>
        <div className='flex items-center justify-between px-5 py-4'>
          <div>
            <h3 className='text-base font-semibold text-white'>Nova meta diária</h3>
            <p className='mt-0.5 text-xs text-white/60'>Valerá a partir de amanhã.</p>
          </div>

          <Button
            type='button'
            onClick={onClose}
            disabled={submitting}
            className='rounded-xl border border-white/10 bg-white/5 p-2 text-white/70 hover:bg-white/10'
            aria-label='Fechar'
          >
            <FaXmark size={16} />
          </Button>
        </div>

        <div className='px-5 pb-5'>
          <div className='rounded-2xl bg-white/5 p-4 ring-1 ring-white/10'>
            <div className='flex items-baseline justify-between'>
              <p className='text-sm font-medium text-white/80'>Quantas páginas por dia?</p>
              <p className='text-xs text-white/55'>Hoje: {currentGoal}</p>
            </div>

            <div className='mt-3 flex items-center gap-2'>
              <Button
                type='button'
                disabled={submitting}
                onClick={() => setGoal((p) => clamp(Number(p) - 1))}
                className='inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/80 hover:bg-white/10'
                aria-label='Diminuir'
              >
                <FaMinus size={14} />
              </Button>

              <input
                ref={inputRef}
                disabled={submitting}
                type='number'
                inputMode='numeric'
                min={1}
                max={999}
                value={goal}
                onChange={(e) => setGoal(clamp(Number(e.target.value)))}
                className='h-11 flex-1 rounded-2xl border border-white/10 bg-black/30 px-4 text-center text-lg font-semibold text-white outline-none focus:border-white/20'
              />

              <Button
                type='button'
                disabled={submitting}
                onClick={() => setGoal((p) => clamp(Number(p) + 1))}
                className='inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/80 hover:bg-white/10'
                aria-label='Aumentar'
              >
                <FaPlus size={14} />
              </Button>
            </div>

            <div className='mt-3 flex flex-wrap gap-2'>
              {[10, 20, 30, 50].map((n) => (
                <Button
                  key={n}
                  type='button'
                  onClick={() => setGoal(n)}
                  disabled={submitting}
                  className='rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/75 hover:bg-white/10'
                >
                  {n} pág
                </Button>
              ))}
            </div>

            {error && <p className='mt-3 text-xs font-medium text-red-300'>{error}</p>}
          </div>

          <div className='mt-4 flex gap-2'>
            <Button
              type='button'
              onClick={onClose}
              className='flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/10'
              disabled={submitting}
            >
              Cancelar
            </Button>

            <Button
              variant='primary'
              type='button'
              onClick={() => void handleSubmit()}
              disabled={submitting || goal === currentGoal}
              className='flex-1 rounded-2xl bg-[#39FF14] px-4 py-2.5 text-sm font-semibold text-[#0F0C22] shadow-lg hover:brightness-110 disabled:opacity-70'
            >
              {submitting ? (
                <span className='inline-flex items-center gap-2'>
                  <Spinner />
                  Salvando…
                </span>
              ) : (
                'Confirmar'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
