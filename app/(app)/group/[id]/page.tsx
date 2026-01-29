'use client';

import { useMemo, useState } from 'react';
import { FaArrowRight, FaCheck, FaChevronDown, FaLink, FaRegClock, FaShieldCat, FaUsers, FaXmark } from 'react-icons/fa6';
import ProgressBar from '@/src/components/ui/ProgressBar';
import { avatarDataUrl } from '@/src/lib/utils/avatar';
import Link from 'next/link';

type TabKey = 'ranking' | 'members' | 'settings' | 'logs';

type RankingEntry = {
  id: string;
  name: string;
  handle: string;
  avatarSeed: string;
  score: number;
  streak: number;
  position: number;
  isYou?: boolean;
};

type Member = {
  id: string;
  name: string;
  handle: string;
  avatarSeed: string;
  role: 'admin' | 'member';
  score: number;
};

type LogEntry = {
  id: string;
  title: string;
  time: string;
};

const isAdmin = true;

const rankingMock: RankingEntry[] = [
  { id: '1', name: 'Eduardo', handle: 'miau_eduardo', avatarSeed: 'Eduardo', score: 50, streak: 10, position: 1, isYou: true },
  { id: '2', name: 'Luna', handle: 'luna_reads', avatarSeed: 'Luna', score: 40, streak: 9, position: 2 },
  { id: '3', name: 'João', handle: 'joao_livros', avatarSeed: 'Joao', score: 30, streak: 7, position: 3 },
  { id: '4', name: 'Ana', handle: 'ana_hlogo', avatarSeed: 'Ana', score: 20, streak: 5, position: 4 },
  { id: '5', name: 'Marina', handle: 'marina_lendo', avatarSeed: 'Marina', score: 18, streak: 4, position: 5 },
  { id: '6', name: 'Pedro', handle: 'pedro_reader', avatarSeed: 'Pedro', score: 14, streak: 3, position: 6 },
  { id: '7', name: 'Isa', handle: 'isa_reads', avatarSeed: 'Isa', score: 12, streak: 3, position: 7 },
  { id: '8', name: 'Nina', handle: 'nina_books', avatarSeed: 'Nina', score: 10, streak: 2, position: 8 },
  { id: '9', name: 'Leo', handle: 'leo_leitor', avatarSeed: 'Leo', score: 8, streak: 1, position: 9 },
  { id: '10', name: 'Sofia', handle: 'sofia_pages', avatarSeed: 'Sofia', score: 6, streak: 1, position: 10 },
];

const membersMock: Member[] = rankingMock.map((r, idx) => ({
  id: r.id,
  name: r.name,
  handle: r.handle,
  avatarSeed: r.avatarSeed,
  role: idx === 0 ? 'admin' : 'member',
  score: r.score,
}));

const logsMock: LogEntry[] = [
  { id: 'l1', title: 'Luna entrou no grupo', time: 'Hoje, 09:12' },
  { id: 'l2', title: 'Eduardo criou convite', time: 'Ontem, 18:20' },
  { id: 'l3', title: 'Temporada atualizada', time: 'Ontem, 10:05' },
];

const summaryStats = {
  checkins: 125,
  pages: 250,
  xp: 27,
  bonus: 3,
  nextGoal: 'Completar 15 check-ins seguidos',
};

const groupInfo = {
  name: 'RC - Founders Club',
  creator: 'Eduardo',
  progressPct: 42,
  endsInDays: 30,
  inviteOnly: true,
  icon: '/group-icons/founders-reading-cats-icon.png',
};

function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function Avatar({ seed, alt }: { seed: string; alt: string }) {
  const src = useMemo(() => avatarDataUrl(seed), [seed]);
  return (
    <div className='relative h-10 w-10 overflow-hidden rounded-full bg-white/5 ring-2 ring-[#0F0C22]'>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className='h-full w-full object-contain' />
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className='inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/70'>{children}</span>;
}

function SectionCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={classNames('rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur', className)}>{children}</div>;
}

function HeaderSection({ onCopy }: { onCopy: () => void }) {
  return (
    <SectionCard className='space-y-4'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-center gap-3'>
          <div className='grid h-14 w-14 place-items-center rounded-2xl bg-white/5 ring-2 ring-[#39FF14]/30'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={groupInfo.icon} alt={groupInfo.name} className='h-10 w-10 object-contain drop-shadow-[0_0_12px_rgba(57,255,20,0.35)]' />
          </div>
          <div>
            <div className='text-lg font-semibold text-white'>{groupInfo.name}</div>
            <div className='text-sm text-white/70'>Criação por {groupInfo.creator}</div>
          </div>
        </div>

        <div className='flex flex-wrap gap-2'>
          <button
            type='button'
            onClick={onCopy}
            className='inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-sm font-semibold text-white/80 ring-1 ring-white/10 hover:bg-white/10'
          >
            <FaLink size={14} />
            Copiar link
          </button>
          {isAdmin ? (
            <button
              type='button'
              className='inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-sm font-semibold text-white/80 ring-1 ring-white/10 hover:bg-white/10'
            >
              <FaShieldCat size={14} />
              Configurações
            </button>
          ) : null}
        </div>
      </div>

      <div>
        <div className='flex items-center justify-between text-sm text-white/80'>
          <span>Progresso da temporada ({groupInfo.progressPct}%)</span>
          <span className='text-white/60'>Termina em {groupInfo.endsInDays} dias</span>
        </div>
        <div className='mt-2'>
          <ProgressBar
            value={groupInfo.progressPct}
            heightClassName='h-3'
            trackClassName='bg-white/10 ring-1 ring-white/10'
            fillClassName='bg-gradient-to-r from-amber-300 via-lime-300 to-[#39FF14]'
            ariaLabel='Progresso da temporada'
          />
        </div>
      </div>
    </SectionCard>
  );
}

function Tabs({ active, onChange }: { active: TabKey; onChange: (tab: TabKey) => void }) {
  const tabs: Array<{ key: TabKey; label: string }> = useMemo(() => {
    const base: Array<{ key: TabKey; label: string }> = [
      { key: 'ranking', label: 'Ranking' },
      { key: 'members', label: 'Membros' },
      { key: 'logs', label: 'Logs' },
    ];
    if (isAdmin) base.splice(2, 0, { key: 'settings', label: 'Configurações' });
    return base;
  }, []);

  return (
    <div className='flex flex-wrap gap-2 rounded-2xl bg-white/5 p-1 ring-1 ring-white/10'>
      {tabs.map((tab) => {
        const selected = tab.key === active;
        return (
          <button
            key={tab.key}
            type='button'
            onClick={() => onChange(tab.key)}
            className={classNames(
              'cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold transition',
              selected ? 'bg-[#39FF14] text-[#0F0C22] shadow-[0_0_12px_rgba(57,255,20,0.35)]' : 'bg-transparent text-white/75 hover:bg-white/10',
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

function RankingTab() {
  const [filter, setFilter] = useState<'recentes' | 'season'>('season');
  const [openFilter, setOpenFilter] = useState(false);
  return (
    <SectionCard className='space-y-4'>
      <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
        <div className='text-sm text-white/70'>Ordenar por</div>
        <div className='relative w-full sm:w-56'>
          <button
            type='button'
            onClick={() => setOpenFilter((v) => !v)}
            className='flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white/90 ring-1 ring-transparent transition hover:bg-white/10 focus:outline-none focus:ring-[#39FF14]/40'
            aria-haspopup='listbox'
            aria-expanded={openFilter}
          >
            <span>{filter === 'recentes' ? 'Mais recentes' : 'Temporada'}</span>
            <FaChevronDown className='h-4 w-4 text-white/60' aria-hidden='true' />
          </button>

          {openFilter ? (
            <div className='absolute left-0 right-0 z-10 mt-1 overflow-hidden rounded-xl border border-white/10 bg-[#0F0C22] shadow-2xl ring-1 ring-white/10 backdrop-blur'>
              {[{ value: 'recentes', label: 'Mais recentes' }, { value: 'season', label: 'Temporada' }].map((opt) => {
                const selected = filter === opt.value;
                return (
                  <button
                    key={opt.value}
                    type='button'
                    onClick={() => {
                      setFilter(opt.value as 'recentes' | 'season');
                      setOpenFilter(false);
                    }}
                    className={classNames(
                      'flex w-full items-center justify-between px-3 py-2 text-left text-sm transition',
                      selected ? 'bg-[#39FF14]/10 text-white' : 'text-white/80 hover:bg-white/5',
                    )}
                    role='option'
                    aria-selected={selected}
                  >
                    <span>{opt.label}</span>
                    {selected ? <span className='text-xs text-[#39FF14]'>Selecionado</span> : null}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>

      <div className='space-y-2'>
        {rankingMock.map((r) => {
          const highlight = r.isYou;
          return (
            <div
              key={r.id}
              className={classNames(
                'flex items-center gap-3 rounded-2xl border p-3',
                highlight ? 'border-[#39FF14]/60 bg-[#39FF14]/10 shadow-[0_0_16px_rgba(57,255,20,0.28)]' : 'border-white/10 bg-white/5 hover:bg-white/10',
              )}
            >
              <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-sm font-semibold text-white/80 ring-1 ring-white/15'>#{r.position}</div>
                  <Avatar seed={r.avatarSeed} alt={r.name} />
              <div className='min-w-0 flex-1'>
                <div className='flex items-center gap-2'>
                  <p className='truncate text-sm font-semibold text-white'>{r.name}</p>
                  {highlight ? <Badge>Você</Badge> : null}
                  <Badge>🔥 {r.streak} streak</Badge>
                </div>
                <p className='text-xs text-white/60'>@{r.handle}</p>
              </div>
              <div className='text-right text-sm font-semibold text-white'>{r.score} XP</div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

function MembersTab() {
  return (
    <SectionCard className='space-y-4'>
      <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <p className='text-sm font-semibold text-white'>Membros</p>
          <p className='text-xs text-white/60'>Gerencie quem participa do grupo</p>
        </div>
        <input
          placeholder='Buscar @handle'
          className='w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90 outline-none ring-1 ring-transparent transition hover:bg-white/10 focus:ring-[#39FF14]/40 sm:w-64'
        />
      </div>

      <div className='space-y-2'>
        {membersMock.map((m) => (
          <div key={m.id} className='flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 hover:bg-white/10'>
                <Avatar seed={m.avatarSeed} alt={m.name} />
            <div className='min-w-0 flex-1'>
              <div className='flex items-center gap-2'>
                <p className='truncate text-sm font-semibold text-white'>{m.name}</p>
                <Badge>{m.role === 'admin' ? 'Admin' : 'Membro'}</Badge>
              </div>
              <p className='text-xs text-white/60'>@{m.handle}</p>
            </div>
            <div className='flex items-center gap-3'>
              <span className='text-sm font-semibold text-white/80'>{m.score} XP</span>
              {isAdmin && m.role !== 'admin' ? (
                <button
                  type='button'
                  className='inline-flex items-center gap-1 rounded-xl bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 ring-1 ring-white/10 hover:bg-white/10'
                >
                  <FaXmark size={12} />
                  Remover
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function SettingsTab() {
  const presets = [7, 14, 30, 'Personalizado'] as const;
  return (
    <SectionCard className='space-y-5'>
      <div>
        <p className='text-sm font-semibold text-white'>Nome do grupo</p>
        <input
          defaultValue={groupInfo.name}
          className='mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90 outline-none ring-1 ring-transparent transition hover:bg-white/10 focus:ring-[#39FF14]/40'
        />
      </div>

      <div>
        <p className='text-sm font-semibold text-white'>Ícone</p>
        <div className='mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4'>
          {[groupInfo.icon, '/group-icons/moon-icon.png', '/group-icons/gold-chest-icon.png', '/group-icons/spellbook-icon.png', '/group-icons/magic-teacup-icon.png', '/group-icons/cat-snow-globe-icon.png'].map((icon, idx) => {
            const selected = idx === 0;
            return (
              <button
                key={icon}
                type='button'
                className={classNames(
                  'relative aspect-square rounded-2xl border bg-white/5 p-3 transition hover:bg-white/10',
                  selected ? 'border-[#39FF14] ring-2 ring-[#39FF14]/50' : 'border-white/10',
                )}
                aria-pressed={selected}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={icon} alt='Ícone' className='h-full w-full object-contain drop-shadow-[0_0_10px_rgba(57,255,20,0.25)]' />
              </button>
            );
          })}
        </div>
      </div>

      <div className='space-y-3'>
        <p className='text-sm font-semibold text-white'>Privacidade</p>
        <label className='flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3'>
          <div>
            <p className='text-sm text-white'>Só com convite</p>
            <p className='text-xs text-white/60'>Apenas quem receber link entra</p>
          </div>
          <div className='h-6 w-12 rounded-full bg-[#39FF14] p-1'>
            <div className='h-full w-1/2 rounded-full bg-[#0F0C22] shadow' />
          </div>
        </label>

        <label className='flex items-center justify-between rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-3 opacity-60'>
          <div>
            <p className='text-sm text-white/70'>Público (em breve)</p>
            <p className='text-xs text-white/50'>Em breve</p>
          </div>
          <div className='h-6 w-12 rounded-full bg-white/10 p-1' aria-hidden='true'>
            <div className='h-full w-1/2 rounded-full bg-white/30' />
          </div>
        </label>
      </div>

      <div className='space-y-3'>
        <p className='text-sm font-semibold text-white'>Temporada</p>
        <div className='grid gap-3 sm:grid-cols-2'>
          <div>
            <p className='text-xs text-white/60'>Data final</p>
            <input
              type='date'
              defaultValue='2026-06-30'
              className='mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90 outline-none ring-1 ring-transparent transition hover:bg-white/10 focus:ring-[#39FF14]/40'
            />
          </div>
          <div>
            <p className='text-xs text-white/60'>Presets</p>
            <div className='mt-1 flex flex-wrap gap-2'>
              {presets.map((p) => {
                const label = typeof p === 'number' ? `${p} dias` : p;
                const selected = p === 30;
                return (
                  <button
                    key={label}
                    type='button'
                    className={classNames(
                      'rounded-full px-3 py-1 text-xs font-semibold transition',
                      selected ? 'bg-[#39FF14] text-[#0F0C22] shadow-[0_0_10px_rgba(57,255,20,0.25)]' : 'bg-white/5 text-white/70 ring-1 ring-white/10 hover:bg-white/10',
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-2 sm:flex-row sm:justify-end'>
        <button
          type='button'
          className='inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 ring-1 ring-white/10 hover:bg-white/10'
        >
          Cancelar
        </button>
        <button
          type='button'
          className='inline-flex items-center justify-center gap-2 rounded-xl bg-[#39FF14] px-5 py-2 text-sm font-semibold text-[#0F0C22] shadow-[0_0_14px_rgba(57,255,20,0.35)] hover:brightness-110'
        >
          <FaCheck size={14} />
          Salvar alterações
        </button>
      </div>
    </SectionCard>
  );
}

function LogsTab() {
  return (
    <SectionCard className='space-y-3'>
      {logsMock.map((log) => (
        <div key={log.id} className='flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white/80 ring-1 ring-white/10'>
            <FaRegClock />
          </div>
          <div className='flex-1'>
            <p className='text-sm font-semibold text-white'>{log.title}</p>
            <p className='text-xs text-white/60'>{log.time}</p>
          </div>
        </div>
      ))}
    </SectionCard>
  );
}

function SidebarMembersCard() {
  const preview = membersMock.slice(0, 4);
  const extra = Math.max(0, membersMock.length - preview.length);
  return (
    <SectionCard className='space-y-3'>
      <div className='flex items-center justify-between'>
        <p className='text-sm font-semibold text-white'>Membros • {membersMock.length}</p>
        <div className='flex -space-x-2'>
          {preview.map((m) => (
            <div key={m.id} className='h-8 w-8 overflow-hidden rounded-full ring-2 ring-[#0F0C22]'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={avatarDataUrl(m.avatarSeed)} alt={m.name} className='h-full w-full object-contain' />
            </div>
          ))}
          {extra > 0 ? (
            <div className='grid h-8 w-8 place-items-center rounded-full bg-white/10 text-xs text-white/70 ring-2 ring-[#0F0C22]'>+{extra}</div>
          ) : null}
        </div>
      </div>

      <div className='space-y-2'>
        {preview.map((m) => (
          <div key={m.id} className='flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2'>
            <div className='flex items-center gap-2'>
                  <Avatar seed={m.avatarSeed} alt={m.name} />
              <div>
                <p className='text-sm font-semibold text-white'>{m.name}</p>
                <p className='text-xs text-white/60'>@{m.handle}</p>
              </div>
            </div>
            <span className='text-xs font-semibold text-white/70'>{m.score} XP</span>
          </div>
        ))}
      </div>

      <button
        type='button'
        className='flex w-full items-center justify-center gap-2 rounded-xl bg-[#39FF14] px-4 py-2 text-sm font-semibold text-[#0F0C22] shadow-[0_0_12px_rgba(57,255,20,0.35)] hover:brightness-110'
      >
        <FaUsers size={14} />
        Convidar
      </button>
    </SectionCard>
  );
}

function SidebarSummaryCard() {
  return (
    <SectionCard className='space-y-3'>
      <p className='text-sm font-semibold text-white'>Resumo</p>
      <div className='grid grid-cols-2 gap-3 text-sm text-white/80'>
        <div className='rounded-2xl bg-white/5 p-3 ring-1 ring-white/10'>
          <p className='text-xs text-white/60'>Check-ins</p>
          <p className='text-lg font-semibold text-white'>{summaryStats.checkins}</p>
        </div>
        <div className='rounded-2xl bg-white/5 p-3 ring-1 ring-white/10'>
          <p className='text-xs text-white/60'>Páginas</p>
          <p className='text-lg font-semibold text-white'>{summaryStats.pages}</p>
        </div>
        <div className='rounded-2xl bg-white/5 p-3 ring-1 ring-white/10'>
          <p className='text-xs text-white/60'>XP</p>
          <p className='text-lg font-semibold text-white'>+{summaryStats.xp}</p>
        </div>
        <div className='rounded-2xl bg-white/5 p-3 ring-1 ring-white/10'>
          <p className='text-xs text-white/60'>Bônus</p>
          <p className='text-lg font-semibold text-white'>x{summaryStats.bonus}</p>
        </div>
      </div>

      <div className='rounded-2xl border border-[#39FF14]/20 bg-[#39FF14]/10 p-3 shadow-[0_0_12px_rgba(57,255,20,0.25)]'>
        <p className='text-xs text-white/70'>Próxima meta</p>
        <p className='text-sm font-semibold text-white'>{summaryStats.nextGoal}</p>
        <div className='mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#0F0C22]'>
          <span className='inline-flex items-center justify-center rounded-full bg-[#0F0C22] px-2 py-0.5 text-[#39FF14] ring-1 ring-[#39FF14]/40'>Em andamento</span>
          <FaArrowRight className='text-[#0F0C22]' />
        </div>
      </div>
    </SectionCard>
  );
}

export default function GroupPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('ranking');

  return (
    <main className='mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-10'>
      <div className='space-y-6'>
        <nav className='flex items-center gap-2 text-sm text-white/60'>
          <Link href='/feed'>Feed</Link>
          <span className='text-white/30'>/</span>
          <span className='text-white/80'>Grupo</span>
        </nav>

        <HeaderSection onCopy={() => {}} />

        <div className='grid grid-cols-1 gap-4 lg:grid-cols-12'>
          <div className='flex flex-col gap-4 lg:col-span-8'>
            <Tabs active={activeTab} onChange={setActiveTab} />

            {activeTab === 'ranking' ? <RankingTab /> : null}
            {activeTab === 'members' ? <MembersTab /> : null}
            {activeTab === 'settings' && isAdmin ? <SettingsTab /> : null}
            {activeTab === 'logs' ? <LogsTab /> : null}
          </div>

          <div className='flex flex-col gap-4 lg:col-span-4'>
            <SidebarMembersCard />
            <SidebarSummaryCard />
          </div>
        </div>
      </div>
    </main>
  );
}
