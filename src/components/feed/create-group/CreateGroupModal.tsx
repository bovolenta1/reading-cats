'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaXmark } from 'react-icons/fa6';
import Button from '../../ui/Button';
import Toast from '../../ui/Toast';
import CreateGroupIdentityStep from './CreateGroupIdentityStep';
import CreateGroupSeasonStep from './CreateGroupSeasonStep';
import type { GroupData, GroupIconOption } from './createGroupTypes';

type Step = 'identity' | 'season';

type CreateGroupModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: GroupData) => void;
};

const GROUP_ICON_OPTIONS: GroupIconOption[] = [
  { id: 'cat-and-book-icon', label: 'Gato com livro' },
  { id: 'cat-snow-globe-icon', label: 'Gato no globo de neve' },
  { id: 'gold-chest-icon', label: 'Baú dourado' },
  { id: 'hour-glass-icon', label: 'Ampulheta' },
  { id: 'magic-teacup-icon', label: 'Chá mágico' },
  { id: 'moon-icon', label: 'Lua' },
  { id: 'spellbook-icon', label: 'Livro de feitiços' },
];

export default function CreateGroupModal({ open, onClose, onSubmit }: CreateGroupModalProps) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<Step>('identity');
  const [submitting, setSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [data, setData] = useState<GroupData>({
    name: '',
    icon: GROUP_ICON_OPTIONS[0].id,
    type: 'invite_only',
    ranking: 'daily_checkins',
    durationDays: 30,
  });

  const updateData = (patch: Partial<GroupData>) => setData((prev) => ({ ...prev, ...patch }));

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) {
      setStep('identity');
      setData({
        name: '',
        icon: GROUP_ICON_OPTIONS[0].id,
        type: 'invite_only',
        ranking: 'daily_checkins',
        durationDays: 30,
      });
      return;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (submitting) return;
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [open, submitting, onClose]);

  const canContinueIdentity = data.name.trim().length > 0 && Boolean(data.icon);

  const handleContinueIdentity = () => {
    if (!canContinueIdentity) return;
    setStep('season');
  };

  const handleSubmitForm = async () => {
    if (submitting) return;
    setSubmitting(true);
    setShowToast(true);

    if (onSubmit) {
      onSubmit(data);
    }

    setTimeout(() => {
      setSubmitting(false);
      onClose();
    }, 500);
  };

  useEffect(() => {
    if (!showToast) return;
    const timer = setTimeout(() => setShowToast(false), 3600);
    return () => clearTimeout(timer);
  }, [showToast]);

  if (!mounted) return null;

  const modal = open ? (
    <div
      className='fixed inset-0 z-[9999] flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center'
      role='dialog'
      aria-modal='true'
      aria-label='Criar grupo'
      onMouseDown={(e) => {
        if (submitting) return;
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className='w-full max-w-md overflow-hidden rounded-3xl bg-[#0F0C22]/65 ring-1 ring-white/10 backdrop-blur-sm sm:max-w-lg'>
        <div className='flex items-center justify-between border-b border-white/10 px-5 py-4'>
          <div>
            <h3 className='text-base font-semibold text-white'>
              {step === 'identity' ? 'Criar grupo' : 'Configurar temporada'}
            </h3>
            <p className='mt-0.5 text-xs text-white/60'>
              {step === 'identity' ? 'Passo 1 de 2' : 'Passo 2 de 2'}
            </p>
          </div>

          <Button
            type='button'
            onClick={onClose}
            disabled={submitting}
            className='rounded-xl border border-white/10 bg-white/5 p-2 text-white/70 hover:bg-white/10 disabled:opacity-50'
            aria-label='Fechar'
          >
            <FaXmark size={16} />
          </Button>
        </div>

        <div className='px-5 py-6'>
          {step === 'identity' ? (
            <CreateGroupIdentityStep
              data={data}
              iconOptions={GROUP_ICON_OPTIONS}
              submitting={submitting}
              canContinue={canContinueIdentity}
              onContinue={handleContinueIdentity}
              onUpdate={updateData}
            />
          ) : (
            <CreateGroupSeasonStep
              data={data}
              submitting={submitting}
              onBack={() => setStep('identity')}
              onSubmit={handleSubmitForm}
              onUpdate={updateData}
            />
          )}
        </div>
      </div>
    </div>
  ) : null;

  return createPortal(
    <>
      {modal}
      <Toast
        open={showToast}
        type='info'
        title='Essa funcionalidade ainda está em construção'
        onClose={() => setShowToast(false)}
      />
    </>,
    document.body,
  );
}
