'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaXmark } from 'react-icons/fa6';
import Button from '../ui/Button';
import Toast from '../ui/Toast';
import Toggle from '../ui/Toggle';
import Image from 'next/image';
import { avatarDataUrl } from '@/src/lib/utils/avatar';

type Step = 'identity' | 'season';

type GroupData = {
  name: string;
  icon: string;
  type: 'invite_only' | 'public';
  seasonName?: string;
  durationDays?: number;
  ranking: 'daily_checkins';
};

type CreateGroupModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: GroupData) => void;
};

// 7 seeds para o picker (2 linhas de 4; último slot é '+')
const ICON_SEEDS = ['Sunburst','MagicOrb','Moonlight','Starlight','Emerald','Comet','CozyCat'];

function Spinner() {
  return <span className='inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#0F0C22]/30 border-t-[#0F0C22]' aria-hidden='true' />;
}

export default function CreateGroupModal({ open, onClose, onSubmit }: CreateGroupModalProps) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<Step>('identity');
  const [submitting, setSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [data, setData] = useState<GroupData>({
    name: '',
    icon: ICON_SEEDS[0],
    type: 'invite_only',
    ranking: 'daily_checkins',
    durationDays: 30,
  });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) {
      setStep('identity');
      setData({
        name: '',
        icon: ICON_SEEDS[0],
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

  const canContinueIdentity = data.name.trim().length > 0 && data.icon;

  const handleContinueIdentity = () => {
    if (!canContinueIdentity) return;
    setStep('season');
  };

  const handleSubmitForm = async () => {
    if (submitting) return;
    setSubmitting(true);
    setShowToast(true);

    // Mock: apenas chamar onSubmit se existir
    if (onSubmit) {
      onSubmit(data);
    }
    // Simular delay
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

  const renderIdentityStep = () => (
    <div className='space-y-5'>
      <div>
        <label className='text-sm font-medium text-white/90'>Nome do grupo</label>
        <input
          type='text'
          placeholder='Clube 2026'
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          disabled={submitting}
          className='mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:border-[#39FF14]/40 focus:ring-2 focus:ring-[#39FF14]/20 disabled:opacity-50'
        />
      </div>

      <div>
        <label className='text-sm font-medium text-white/90'>Ícone do grupo</label>
        <div className='mt-3 grid grid-cols-4 gap-3'>
          {ICON_SEEDS.map((seed) => {
            const selected = data.icon === seed;
            const src = avatarDataUrl(seed);
            return (
              <button
                key={seed}
                onClick={() => setData({ ...data, icon: seed })}
                disabled={submitting}
                className={`relative aspect-square overflow-hidden rounded-2xl transition ${
                  selected ? 'ring-2 ring-[#39FF14] ring-offset-2 ring-offset-[#0F0C22]' : 'ring-1 ring-white/10'
                } disabled:opacity-50 bg-white/5 hover:bg-white/10`}
                aria-pressed={selected}
              >
                <Image src={src} alt={seed} fill sizes='64px' className='object-cover' />
              </button>
            );
          })}
          {/* 8º slot: mock de + */}
          <div className='grid aspect-square place-items-center rounded-2xl border border-dashed border-white/15 text-white/40'>
            +
          </div>
        </div>
      </div>

      <div>
        <label className='text-sm font-medium text-white/90'>Tipo de grupo</label>
        <div className='mt-3 space-y-2'>
          <div className='flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3'>
            <span className='text-sm text-white/90'>Só com convite</span>
            <Toggle
              checked={data.type === 'invite_only'}
              onChange={(ck) => setData({ ...data, type: ck ? 'invite_only' : 'public' })}
              ariaLabel='Só com convite'
            />
          </div>
          <div className='flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 opacity-60'>
            <span className='text-sm text-white/60'>Público (em breve)</span>
            <Toggle checked={false} onChange={() => {}} disabled ariaLabel='Público (em breve)' />
          </div>
        </div>
      </div>

      <Button
        type='button'
        onClick={handleContinueIdentity}
        disabled={!canContinueIdentity || submitting}
        className='w-full rounded-2xl bg-[#39FF14] py-3 text-sm font-semibold text-[#0F0C22] hover:brightness-110 disabled:opacity-60'
      >
        {submitting ? <Spinner /> : 'Continuar'}
      </Button>
    </div>
  );

  const renderSeasonStep = () => (
    <div className='space-y-5'>
      <div>
        <label className='text-sm font-medium text-white/90'>Nome da temporada (opcional)</label>
        <input
          type='text'
          placeholder='Janeiro'
          value={data.seasonName || ''}
          onChange={(e) => setData({ ...data, seasonName: e.target.value })}
          disabled={submitting}
          className='mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:border-[#39FF14]/40 focus:ring-2 focus:ring-[#39FF14]/20 disabled:opacity-50'
        />
      </div>

      <div>
        <label className='text-sm font-medium text-white/90'>Duração</label>
        <div className='mt-3 flex gap-2'>
          {[7, 14, 30].map((days) => (
            <button
              key={days}
              onClick={() => setData({ ...data, durationDays: days })}
              disabled={submitting}
              className={`flex-1 rounded-2xl border px-3 py-2 text-sm font-medium transition ${
                data.durationDays === days
                  ? 'border-[#39FF14] bg-[#39FF14]/10 text-[#39FF14]'
                  : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
              } disabled:opacity-50`}
            >
              {days} dias
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className='text-sm font-medium text-white/90'>Regra de ranking</label>
        <div className='mt-3 space-y-2'>
          <button
            onClick={() => setData({ ...data, ranking: 'daily_checkins' })}
            disabled={submitting}
            className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
              data.ranking === 'daily_checkins'
                ? 'border-[#39FF14] bg-[#39FF14]/10 text-white'
                : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
            } disabled:opacity-50`}
          >
            <div className='flex items-center justify-between'>
              <span>Check-ins por dia</span>
              <input type='radio' checked={data.ranking === 'daily_checkins'} readOnly className='pointer-events-none' />
            </div>
          </button>

          <button
            disabled={true}
            className='w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/40 opacity-50'
          >
            <div className='flex items-center justify-between'>
              <span>Páginas (em breve)</span>
              <input type='radio' checked={false} readOnly className='pointer-events-none' />
            </div>
          </button>
        </div>
      </div>

      <div className='rounded-2xl border border-white/10 bg-white/5 p-4'>
        <p className='text-xs font-medium text-white/90'>Regras automáticas:</p>
        <ul className='mt-2 space-y-1 text-xs text-white/60'>
          <li>• 1 check-in por dia</li>
          <li>• Você pode editar por 15 min</li>
          <li>• O dia fecha às 23:59 do fuso do grupo</li>
        </ul>
      </div>

      <div className='flex gap-2'>
        <Button
          type='button'
          onClick={() => setStep('identity')}
          disabled={submitting}
          className='flex-1 rounded-2xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white/80 hover:bg-white/10 disabled:opacity-60'
        >
          Voltar
        </Button>

        <Button
          type='button'
          onClick={handleSubmitForm}
          disabled={submitting}
          className='flex-1 rounded-2xl bg-[#39FF14] py-3 text-sm font-semibold text-[#0F0C22] hover:brightness-110 disabled:opacity-60'
        >
          {submitting ? <Spinner /> : 'Criar grupo'}
        </Button>
      </div>
    </div>
  );

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
      <div className='w-full max-w-md overflow-hidden rounded-3xl bg-[#0F0C22]/95 ring-1 ring-white/10 sm:max-w-lg'>
        {/* Header */}
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

        {/* Content */}
        <div className='px-5 py-6'>
          {step === 'identity' ? renderIdentityStep() : renderSeasonStep()}
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
