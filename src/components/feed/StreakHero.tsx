import React from 'react';
import Image from 'next/image';
import { FaPaw } from 'react-icons/fa6';
import { FaCheck, FaMinus } from 'react-icons/fa6';
import ProgressBar from '../ui/ProgressBar';
import { PiMedal } from 'react-icons/pi';

type StreakHeroProps = {
  streakDays: number;
  todayPages: number;
  goalPages: number;
  checkedDays?: number; // 0..7
};

function MiniCalendar({ checkedDays = 5 }: { checkedDays?: number }) {
  const days = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'];

  return (
    <div className='mt-4 rounded-2xl bg-black/20 p-3 ring-1 ring-white/10'>
      <div className='grid grid-cols-7 gap-2'>
        {days.map((d, i) => {
          const done = i < checkedDays;

          return (
            <div key={d} className='flex flex-col items-center'>
              <span className='text-[10px] font-medium text-white/45'>{d}</span>

              <div className='mt-1 flex h-6 items-center justify-center'>
                {done ? (
                  <FaCheck className='text-[#39FF14] drop-shadow-[0_6px_16px_rgba(57,255,20,0.18)]' size={18} />
                ) : (
                  <FaMinus className='text-white/25' size={16} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function StreakHero({ streakDays, todayPages, goalPages, checkedDays }: StreakHeroProps) {
  const pct = goalPages > 0 ? (todayPages / goalPages) * 100 : 0;

  return (
    <section className='relative overflow-hidden rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur'>
      <div className='pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#39FF14]/10 blur-3xl' />
      <div className='pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl' />

      <div className='relative z-0'>
        {/* reserva espaço pro gato no desktop */}
        <div className='min-w-0 pr-0'>
          {/* HEADER: medalha + texto + progress ao lado (não abaixo) */}
          <div className='flex items-center gap-4'>
            {/* medalha */}
            <div className='relative h-16 w-16 shrink-0 md:h-[72px] md:w-[72px]'>
              <Image
                src='/paw-medal.png'
                alt='Medalha de streak'
                fill
                sizes='(max-width: 768px) 64px, 72px'
                className='object-contain drop-shadow-[0_8px_24px_rgba(57,255,20,0.18)] drop-shadow-[0_10px_35px_rgba(0,0,0,0.45)]'
                priority
              />
            </div>

            {/* texto + progress (lado a lado com a medalha) */}
            <div className='min-w-0 flex-1'>
              <h2 className='truncate text-lg font-semibold text-white'>
                Você está em <span className='text-[#39FF14]'>{streakDays} dias seguidos</span>!
              </h2>

              <div className='mt-1 flex items-center gap-3'>
                <p className='shrink-0 text-sm text-white/60'>
                  Meta do dia: {todayPages}/{goalPages} páginas
                </p>
              </div>
              <div className='pt-2 min-w-0 flex-1'>
                  <ProgressBar value={pct} />
                </div>
            </div>
          </div>

          {/* calendário + botões */}
          <div className='mt-4'>
            <MiniCalendar checkedDays={checkedDays} />

            <div className='mt-4 flex flex-col gap-2 sm:flex-row'>
              <button
                className='cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl bg-[#39FF14] px-4 py-2 text-sm font-semibold text-[#0F0C22] shadow-lg hover:brightness-110'
                type='button'
              >
                <FaPaw size={16} />
                Registrar leitura
              </button>

              <button
                className='cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10'
                type='button'
              >
                <PiMedal size={16} />
                Trocar meta
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
