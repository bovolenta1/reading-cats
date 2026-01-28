'use client';

import { FaCheck } from 'react-icons/fa6';
import Button from '../../ui/Button';
import type { GroupData } from './createGroupTypes';

export type SeasonStepProps = {
  data: GroupData;
  submitting: boolean;
  onBack: () => void;
  onSubmit: () => void;
  onUpdate: (patch: Partial<GroupData>) => void;
};

export default function CreateGroupSeasonStep({ data, submitting, onBack, onSubmit, onUpdate }: SeasonStepProps) {
  return (
    <div className='space-y-5'>
      <div>
        <label className='text-sm font-medium text-white/90'>Duração</label>
        <div className='mt-3 flex gap-2'>
          {[14, 30, 60].map((days) => (
            <button
              key={days}
              onClick={() => onUpdate({ durationDays: days })}
              disabled={submitting}
              className={`flex-1 rounded-2xl border px-3 py-2 text-sm font-medium transition cursor-pointer ${
                data.durationDays === days
                  ? 'border-[#39FF14] bg-[#39FF14]/10 text-[#39FF14]'
                  : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
              } disabled:opacity-50`}
            >
              {days} dias
            </button>
          ))}
        </div>
        <p className='mt-2 text-xs text-white/60'>Você pode ajustar a duração depois.</p>
      </div>

      <div>
        <label className='text-sm font-medium text-white/90'>Regra de ranking</label>
        <div className='mt-3 rounded-2xl border border-white/10 bg-white/5 p-3'>
          <label className='flex w-full cursor-pointer items-center gap-2 rounded-xl px-2 py-2 text-sm text-white/85 transition hover:bg-white/5 disabled:opacity-50'>
            <input
              type='radio'
              name='ranking'
              value='daily_checkins'
              checked={data.ranking === 'daily_checkins'}
              onChange={() => onUpdate({ ranking: 'daily_checkins' })}
              disabled={submitting}
              className='sr-only'
            />
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] transition ${
                data.ranking === 'daily_checkins'
                  ? 'border-[#39FF14] bg-[#39FF14]/20 text-[#0F0C22]'
                  : 'border-white/25 bg-transparent text-transparent'
              }`}
              aria-hidden='true'
            >
              {data.ranking === 'daily_checkins' ? '●' : ' '}
            </span>
            <span>Check-ins por dia</span>
          </label>

          <label className='flex w-full items-center gap-2 rounded-xl px-2 py-2 text-sm text-white/45 opacity-60'>
            <input type='radio' name='ranking' value='pages' disabled className='sr-only' />
            <span className='flex h-5 w-5 items-center justify-center rounded-full border border-white/20 bg-transparent text-transparent' aria-hidden='true'>
              ●
            </span>
            <span>Páginas (em breve)</span>
          </label>
        </div>
      </div>

      <div className='space-y-2 text-xs text-white/80'>
        <p className='font-medium text-white/90'>Regras automáticas:</p>
        <ul className='space-y-1'>
          <li className='flex items-center gap-2'>
            <FaCheck size={11} className='text-[#39FF14]' aria-hidden='true' />
            <span>1 check-in por dia</span>
          </li>
          <li className='flex items-center gap-2'>
            <FaCheck size={11} className='text-[#39FF14]' aria-hidden='true' />
            <span>Você pode editar por 15 min</span>
          </li>
          <li className='flex items-center gap-2'>
            <FaCheck size={11} className='text-[#39FF14]' aria-hidden='true' />
            <span>O dia fecha às 23:59 do fuso do grupo</span>
          </li>
        </ul>
      </div>

      <div className='flex gap-2'>
        <Button
          type='button'
          onClick={onBack}
          disabled={submitting}
          className='flex-1 rounded-2xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white/80 hover:bg-white/10 disabled:opacity-60'
        >
          Voltar
        </Button>

        <Button
          type='button'
          onClick={onSubmit}
          disabled={submitting}
          className='flex-1 rounded-2xl bg-[#39FF14] py-3 text-sm font-semibold text-[#0F0C22] hover:brightness-110 disabled:opacity-60'
        >
          {submitting ? <span className='inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#0F0C22]/30 border-t-[#0F0C22]' aria-hidden='true' /> : 'Criar grupo'}
        </Button>
      </div>
    </div>
  );
}
