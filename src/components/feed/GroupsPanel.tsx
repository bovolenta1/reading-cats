import React from 'react';
import Image from 'next/image';
import { FaTrophy } from 'react-icons/fa6';
import { FiUsers } from 'react-icons/fi';
import { avatarDataUrl } from '@/src/lib/utils/avatar';
import ProgressBar from '../ui/ProgressBar';

type MemberAvatar =
  | { type: 'image'; src: string; alt: string }
  | { type: 'initial'; name: string }
  | { type: 'dicebear'; seed: string; alt?: string };

export type GroupItem = {
  id: string;
  name: string;

  /** NOVO: caminho no /public (ex: "/group-icons/chest-icon.png") */
  iconSrc?: string;

  /** opcional: manter emoji como fallback */
  emoji?: string;

  rank: number;
  membersCount?: number;
  streakDays?: number;
  pointsLabel?: string;

  todayPages?: number;
  goalPages?: number;

  avatars: MemberAvatar[];
  highlight?: boolean;
};

type Props = {
  title?: string;
  subtitle?: string;
  groups: GroupItem[];
  maxPreview?: number;
  onSeeAll?: () => void;
  onSeeRanking?: (groupId: string) => void;
};

function AvatarCircle({ a }: { a: MemberAvatar }) {
  if (a.type === 'dicebear') {
    const src = avatarDataUrl(a.seed);
    return (
      <div className='relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-[#0F0C22]'>
        <Image src={src} alt={a.alt ?? a.seed} fill sizes='36px' className='object-cover' />
      </div>
    );
  }

  if (a.type === 'image') {
    return (
      <div className='relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-[#0F0C22]'>
        <Image src={a.src} alt={a.alt} fill sizes='36px' className='object-cover' />
      </div>
    );
  }

  const initial = a.name.trim()[0]?.toUpperCase() ?? '?';
  return (
    <div className='flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white/90 ring-2 ring-[#0F0C22]'>
      {initial}
    </div>
  );
}

function GroupIcon({ iconSrc, emoji, highlight, name }: { iconSrc?: string; emoji?: string; highlight?: boolean; name: string }) {
  return (
    <div className={'relative flex h-11 w-11 items-center justify-center rounded-2xl'} aria-label={`Ícone do grupo ${name}`} title={name}>
      {iconSrc ? (
        <Image src={iconSrc} alt={`Ícone do grupo ${name}`} fill sizes='44px' className='object-contain' priority={Boolean(highlight)} />
      ) : (
        <span className='text-xl leading-none'>{emoji ?? '✨'}</span>
      )}
    </div>
  );
}

function MetaPill({ children }: { children: React.ReactNode }) {
  return (
    <span className='inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-xs text-white/70 ring-1 ring-white/10'>{children}</span>
  );
}

function GroupRow({ g, onSeeRanking }: { g: GroupItem; onSeeRanking?: (groupId: string) => void }) {
  const members = typeof g.membersCount === 'number' ? g.membersCount : g.avatars.length;
  const today = Math.max(0, g.todayPages ?? 0);
  const goal = Math.max(0, g.goalPages ?? 0);
  const pct = goal > 0 ? (today / goal) * 100 : 0;

  const top3 = g.avatars.slice(0, 3);
  const remaining = Math.max(0, g.avatars.length - top3.length);

  return (
    <div
      className={[
        'rounded-2xl border p-4 backdrop-blur',
        g.highlight ? 'border-[#39FF14]/20 bg-[#39FF14]/[0.06]' : 'border-white/10 bg-black/20 hover:bg-white/5',
      ].join(' ')}
    >
      <div className='flex gap-4'>
        <GroupIcon iconSrc={g.iconSrc} emoji={g.emoji} highlight={g.highlight} name={g.name} />

        <div className='min-w-0 flex-1'>
          <div className='flex items-start justify-between gap-3'>
            <div className='min-w-0'>
              <p className='truncate text-sm font-semibold text-white'>{g.name}</p>

              <div className='mt-1 flex flex-wrap items-center gap-2'>
                <MetaPill>
                  <FiUsers size={13} className='text-white/55' />
                  <span>{members} membros</span>
                </MetaPill>

                {typeof g.streakDays === 'number' ? <MetaPill>🔥 streak {g.streakDays}</MetaPill> : null}
                {g.pointsLabel ? <MetaPill>{g.pointsLabel}</MetaPill> : null}
              </div>
            </div>

            <div className='shrink-0'>
              <span className='rounded-xl bg-white/5 px-2 py-1 text-[11px] font-semibold text-white/60 ring-1 ring-white/10'>#{g.rank}</span>
            </div>
          </div>

          <div className='mt-3 flex flex-col gap-3 sm:flex-row sm:items-center'>
            <div className='flex items-center justify-between gap-3 sm:flex-1'>
              <div className='flex items-center'>
                <div className='flex -space-x-2'>
                  {top3.map((a, idx) => (
                    <div key={idx}>
                      <AvatarCircle a={a} />
                    </div>
                  ))}

                  {remaining > 0 ? (
                    <div className='flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs text-white/75 ring-2 ring-[#0F0C22]'>
                      +{remaining}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className='min-w-0 flex-1'>
                <div className='flex items-center justify-between gap-3'>
                  <p className='text-xs text-white/60'>Progresso</p>
                  <p className='shrink-0 text-xs font-semibold text-white/80'>{goal > 0 ? `${today} / ${goal}` : `${today}`}</p>
                </div>

                <div className='mt-1'>
                  <ProgressBar value={pct} heightClassName='h-2' ariaLabel={`Progresso de leitura do grupo ${g.name}`} />
                </div>
              </div>
            </div>

            <button
              type='button'
              className='inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 ring-1 ring-white/10 hover:bg-white/10 sm:shrink-0'
            >
              <FaTrophy size={14} className='text-white/70' />
              Ver ranking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GroupsPanel({
  title = 'Grupos dos amigos',
  subtitle = 'Leia junto e ganhe XP juntos!',
  groups,
  maxPreview = 2,
  onSeeAll,
  onSeeRanking,
}: Props) {
  const preview = groups.slice(0, maxPreview);

  return (
    <section className='rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur'>
      <div className='flex items-start justify-between gap-3'>
        <div className='min-w-0'>
          <h3 className='text-lg font-semibold text-white'>{title}</h3>
          <p className='mt-1 text-sm text-white/60'>{subtitle}</p>
        </div>

        <span className='shrink-0 rounded-full bg-white/5 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10'>{groups.length} grupos</span>
      </div>

      <div className='mt-4 space-y-3'>
        {preview.map((g) => (
          <GroupRow key={g.id} g={g} onSeeRanking={onSeeRanking} />
        ))}
      </div>

      <div className='mt-4 flex justify-center'>
        <div className='flex items-center gap-2'>
          <button
            type='button'
            onClick={onSeeAll}
            className='cursor-pointer rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10'
          >
            Ver todos os grupos
          </button>

          <button
            type='button'
            className='cursor-pointer rounded-xl bg-[#39FF14] px-4 py-2 text-sm font-semibold text-[#0F0C22] shadow-lg hover:brightness-110'
          >
            Criar grupo
          </button>
        </div>
      </div>
    </section>
  );
}
