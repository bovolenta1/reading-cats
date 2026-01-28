'use client';

import Image from 'next/image';
import Button from '../../ui/Button';
import Toggle from '../../ui/Toggle';
import type { GroupData, GroupIconOption } from './createGroupTypes';

export type IdentityStepProps = {
  data: GroupData;
  iconOptions: GroupIconOption[];
  submitting: boolean;
  canContinue: boolean;
  onContinue: () => void;
  onUpdate: (patch: Partial<GroupData>) => void;
};

export default function CreateGroupIdentityStep({ data, iconOptions, submitting, canContinue, onContinue, onUpdate }: IdentityStepProps) {
  return (
    <div className='space-y-5'>
      <div>
        <label className='text-sm font-medium text-white/90'>Nome do grupo</label>
        <input
          type='text'
          placeholder='Clube 2026'
          value={data.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          disabled={submitting}
          className='mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:border-[#39FF14]/40 focus:ring-2 focus:ring-[#39FF14]/20 disabled:opacity-50'
        />
      </div>

      <div>
        <label className='text-sm font-medium text-white/90'>Ícone do grupo</label>
        <div className='mt-3 grid grid-cols-4 gap-3'>
          {iconOptions.map((iconOption) => {
            const selected = data.icon === iconOption.id;
            const src = `/group-icons/${iconOption.id}.png`;
            return (
              <button
                key={iconOption.id}
                onClick={() => onUpdate({ icon: iconOption.id })}
                disabled={submitting}
                className={`relative aspect-square overflow-hidden rounded-2xl transition cursor-pointer ${
                  selected ? 'ring-2 ring-[#39FF14] ring-offset-2 ring-offset-[#0F0C22]' : 'ring-1 ring-white/10'
                } disabled:opacity-50 bg-white/5 hover:bg-white/10 p-2`}
                aria-pressed={selected}
                aria-label={`Selecionar o ícone ${iconOption.label}`}
              >
                <Image
                  src={src}
                  alt={iconOption.label}
                  fill
                  priority={selected}
                  sizes='94px'
                  className='h-full w-full object-contain drop-shadow-[0_0_10px_rgba(57,255,20,0.22)]'
                />
              </button>
            );
          })}

          <div className='grid aspect-square place-items-center rounded-2xl border border-dashed border-white/15 bg-white/5 text-sm font-semibold text-white/60'>
            +2
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
              onChange={(ck) => onUpdate({ type: ck ? 'invite_only' : 'public' })}
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
        onClick={onContinue}
        disabled={!canContinue || submitting}
        className='w-full rounded-2xl bg-[#39FF14] py-3 text-sm font-semibold text-[#0F0C22] hover:brightness-110 disabled:opacity-60'
      >
        {submitting ? <span className='inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#0F0C22]/30 border-t-[#0F0C22]' aria-hidden='true' /> : 'Continuar'}
      </Button>
    </div>
  );
}
