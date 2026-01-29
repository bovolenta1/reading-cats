'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { FaPaw } from 'react-icons/fa6';
import { PiMedal } from 'react-icons/pi';

import ProgressBar from '../ui/ProgressBar';
import RegisterReadingModal from './RegisterReadingModal';
import ChangeGoalModal from './ChangeGoalModal';
import MiniCalendar from '../ui/MiniCalendar';
import Button from '../ui/Button';
import Toast from '../ui/Toast';

import { postReading, putReadingGoal } from '@/src/lib/api/reading';
import type { ReadingProgress, ChangeGoalResponse } from '@/src/lib/api/reading';

type StreakHeroProps = {
  // snapshot vindo do server (GET /v1/reading/progress)
  progress: ReadingProgress;
  currentGoal?: {
    daily_pages: number;
    valid_from: string;
  };
  nextGoal?: {
    daily_pages: number;
    valid_from: string;
  };
};

export default function StreakHero({ progress, currentGoal, nextGoal: initialNextGoal }: StreakHeroProps) {
  const [open, setOpen] = useState(false);
  const [openGoal, setOpenGoal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Mantém um estado local porque o componente é interativo (POST atualiza snapshot)
  const [localProgress, setLocalProgress] = useState<ReadingProgress>(progress);
  const [localNextGoal, setLocalNextGoal] = useState(initialNextGoal);

  // Se o server re-renderizar e mandar outro snapshot, sincroniza
  useEffect(() => {
    setLocalProgress(progress);
  }, [progress]);

  useEffect(() => {
    if (initialNextGoal) {
      setLocalNextGoal(initialNextGoal);
    }
  }, [initialNextGoal]);

  const streakDays = localProgress.streak.current_days;
  const todayPages = localProgress.day.pages;
  const goalPages = localProgress.day.goal_pages;

  const pct = useMemo(() => {
    return goalPages > 0 ? (todayPages / goalPages) * 100 : 0;
  }, [todayPages, goalPages]);

  const isCheckedToday = todayPages > 0;

  const shouldShowNextGoal = useMemo(() => {
    if (!localNextGoal || localNextGoal.daily_pages === 0) return false;
    return localNextGoal.daily_pages !== goalPages;
  }, [localNextGoal, goalPages]);

  const handleSubmit = async (deltaPages: number) => {
    setSubmitting(true);
    try {
      const data = await postReading(deltaPages);
      if (data?.progress) setLocalProgress(data.progress);
      if (data?.next_goal) setLocalNextGoal(data.next_goal);
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChangeGoal = async (newGoal: number): Promise<ChangeGoalResponse> => {
    setSubmitting(true);
    try {
      const data = await putReadingGoal(newGoal);
      console.log("AQUIIIIII", data)
      setLocalNextGoal(data.next_goal);
      setToastMessage(`✓ Nova meta de ${data.next_goal.daily_pages} pág será válida a partir de ${new Date(data.next_goal.valid_from).toLocaleDateString('pt-BR')}`);
      setShowToast(true);
      setOpenGoal(false);
      return data;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className='relative overflow-hidden rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur'>
      <div className='pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#39FF14]/10 blur-3xl' />
      <div className='pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl' />

      <div className='relative z-0'>
        <div className='min-w-0 pr-0'>
          <div className='flex items-center gap-4'>
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

            <div className='min-w-0 flex-1'>
              <h2 className='truncate text-lg font-semibold text-white'>
                Você está em <span className='text-[#39FF14]'>{streakDays} dias seguidos</span>!
              </h2>

              <div className='mt-1 flex items-center gap-3'>
                <p className='shrink-0 text-sm text-white/60'>
                  Meta do dia: {todayPages}/{goalPages} páginas
                </p>
                {shouldShowNextGoal && localNextGoal && (
                  <span className='text-xs text-white/40 px-2 py-1 rounded-full bg-white/5 border border-white/10'>
                    Amanhã: {localNextGoal.daily_pages} pág
                  </span>
                )}
              </div>

              <div className='min-w-0 flex-1 pt-2'>
                <ProgressBar value={pct} />
              </div>
            </div>
          </div>

          <div className='mt-4'>
            <MiniCalendar week={localProgress.week.map(d => ({ date: d.date, checked: d.checked }))} />

            <div className='mt-4 flex flex-col gap-2 sm:flex-row'>
              <Button
                variant='primary'
                className='inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#39FF14] px-4 py-2 text-sm font-semibold text-[#0F0C22] shadow-lg hover:brightness-110'
                type='button'
                onClick={() => setOpen(true)}
                disabled={submitting}
              >
                <FaPaw size={16} />
                {isCheckedToday ? 'Adicionar páginas' : 'Registrar leitura'}
              </Button>

              <Button
                className='inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10'
                type='button'
                onClick={() => setOpenGoal(true)}
                disabled={submitting}
              >
                <PiMedal size={16} />
                Trocar meta
              </Button>
            </div>
          </div>
        </div>
      </div>

      <RegisterReadingModal
        open={open}
        todayPages={todayPages}
        goalPages={goalPages}
        onClose={() => {
          if (!submitting) setOpen(false);
        }}
        onSubmit={handleSubmit}
      />

      <ChangeGoalModal
        open={openGoal}
        currentGoal={goalPages}
        onClose={() => {
          if (!submitting) setOpenGoal(false);
        }}
        onSubmit={handleChangeGoal}
      />

      <Toast open={showToast} title={toastMessage} onClose={() => setShowToast(false)} />
    </section>
  );
}
