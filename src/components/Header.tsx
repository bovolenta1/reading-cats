'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useUser } from '@/src/contexts/user/UserContext';
import CreateGroupModal from '@/src/components/feed/create-group/CreateGroupModal';

function getInitials(nameOrEmail: string) {
  const s = nameOrEmail.trim();
  if (!s) return '—';

  if (s.includes('@')) return s[0]?.toUpperCase() ?? '—';

  const parts = s.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : '';
  return (first + last).toUpperCase() || '—';
}

export default function Header() {
  const { me } = useUser();
  const [openCreate, setOpenCreate] = useState(false);

  const displayName = me?.displayName ?? me?.email ?? '—';
  const initials = getInitials(displayName);

  return (
    <>
    <header className='sticky top-0 z-50 border-b border-white/10 bg-[#1F1B3A]/60 backdrop-blur supports-[backdrop-filter]:bg-[#1F1B3A]/50'>
      <div className='mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 md:px-6'>
        {/* Left: Brand */}
        <div className='flex items-center gap-3'>
          <div className='grid h-10 w-10 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10'>
            <Image src='/reading-cat-icon-2.png' width={36} height={32} alt='Reading Cats' className='h-auto' priority />
          </div>

          <div className='leading-tight'>
            <div className='flex items-center gap-2'>
              <span className='text-sm font-semibold tracking-tight text-white'>Reading Cats</span>
              <span className='hidden rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-white/70 ring-1 ring-white/10 md:inline-flex'>
                beta
              </span>
            </div>
            <div className='text-xs text-white/55'>Cozy reading, daily.</div>
          </div>
        </div>

        {/* Center: Search (desktop) */}
        <div className='hidden flex-1 px-4 md:block'>
          <div className='mx-auto flex max-w-xl items-center gap-2 rounded-2xl bg-black/20 px-3 py-2 ring-1 ring-white/10'>
            <span className='text-white/50'>⌘</span>
            <input
              placeholder='Buscar dicas, livros, tags…'
              className='w-full bg-transparent text-sm text-white/80 placeholder:text-white/40 outline-none'
            />
            <span className='rounded-lg bg-white/5 px-2 py-1 text-[11px] text-white/60 ring-1 ring-white/10'>/</span>
          </div>
        </div>

        {/* Right: Actions + User */}
        <div className='flex items-center gap-2'>
          {/* Mobile search */}
          <button
            className='inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/80 ring-1 ring-white/10 hover:bg-white/10 md:hidden'
            aria-label='Buscar'
            type='button'
          >
            🔎
          </button>

          <button
            className='hidden rounded-xl bg-[#39FF14] px-4 py-2 text-sm font-semibold text-[#1F1B3A] shadow-lg hover:brightness-110 md:inline-flex'
            type='button'
            onClick={() => setOpenCreate(true)}
          >
            Criar Grupo
          </button>

          <div className='mx-1 hidden h-6 w-px bg-white/10 md:block' />

          {/* User block */}
          <div className='flex items-center gap-3 rounded-2xl bg-white/5 px-2 py-2 ring-1 ring-white/10'>
            {me?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={me.avatarUrl}
                alt='Foto'
                width={36}
                height={36}
                className='h-9 w-9 rounded-full object-cover ring-1 ring-white/15'
              />
            ) : (
              <div className='grid h-9 w-9 place-items-center rounded-full bg-black/20 text-xs font-semibold text-white/80 ring-1 ring-white/10'>
                {initials}
              </div>
            )}

            <div className='hidden min-w-0 md:block'>
              {me ? (
                <>
                  <div className='truncate text-sm font-semibold text-white/90'>Bem-vindo, {displayName}</div>
                  {me.email ? (
                    <div className='truncate text-xs text-white/55'>{me.email}</div>
                  ) : (
                    <div className='text-xs text-white/55'>Você está logado ✅</div>
                  )}
                </>
              ) : (
                <>
                  <div className='truncate text-sm font-semibold text-white/90'>Bem-vindo</div>
                  <div className='text-xs text-white/55'>Não autenticado</div>
                </>
              )}
            </div>

            <button
              className='inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-white/70 ring-1 ring-white/10 hover:bg-white/10'
              aria-label='Menu'
              type='button'
            >
              ☰
            </button>
          </div>
        </div>
      </div>
    </header>
    <CreateGroupModal
      open={openCreate}
      onClose={() => setOpenCreate(false)}
      onSubmit={(data) => {
        console.log('CreateGroup submit from Header:', data);
      }}
    />
    </>
  );
}
