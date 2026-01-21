function Avatar({ name }: { name: string }) {
  const initial = name.trim()[0]?.toUpperCase() ?? '?';

  return (
    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white/90 ring-1 ring-white/10'>
      {initial}
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className='inline-flex items-center rounded-full bg-white/5 px-2 py-0.5 text-xs text-white/70 ring-1 ring-white/10'>{children}</span>;
}

function PostCard({
  name,
  handle,
  time,
  text,
  tags,
  likes,
  replies,
  saves,
}: {
  name: string;
  handle: string;
  time: string;
  text: string;
  tags?: string[];
  likes: number;
  replies: number;
  saves: number;
}) {
  return (
    <article className='rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur'>
      <div className='flex items-start gap-3'>
        <Avatar name={name} />

        <div className='min-w-0 flex-1'>
          <div className='flex flex-wrap items-center gap-x-2 gap-y-1'>
            <span className='font-semibold text-white'>{name}</span>
            <span className='text-sm text-white/60'>@{handle}</span>
            <span className='text-sm text-white/40'>· {time}</span>
          </div>

          <p className='mt-2 whitespace-pre-line text-[15px] leading-relaxed text-white/85'>{text}</p>

          {tags?.length ? (
            <div className='mt-3 flex flex-wrap gap-2'>
              {tags.map((t) => (
                <Badge key={t}>#{t}</Badge>
              ))}
            </div>
          ) : null}

          <div className='mt-4 flex items-center gap-2 text-sm text-white/60'>
            <button className='cursor-pointer inline-flex items-center gap-2 rounded-xl px-2 py-1 hover:bg-white/5'>
              💬 <span>{replies}</span>
            </button>
            <button className='cursor-pointer inline-flex items-center gap-2 rounded-xl px-2 py-1 hover:bg-white/5'>
              ❤️ <span>{likes}</span>
            </button>
            <button className='cursor-pointer inline-flex items-center gap-2 rounded-xl px-2 py-1 hover:bg-white/5'>
              🔖 <span>{saves}</span>
            </button>

            <div className='ml-auto'>
              <button className='cursor-pointer rounded-xl px-2 py-1 hover:bg-white/5'>⋯</button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
function GroupStrip() {
  const groups = [
    { name: 'Clube 2026', streak: 7, rank: 2, members: 6 },
    { name: '20 páginas/dia', streak: 3, rank: 1, members: 4 },
    { name: 'Ficção noturna', streak: 12, rank: 5, members: 9 },
  ];

  return (
    <section className='rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div>
          <p className='text-sm font-semibold text-white'>Seus grupos</p>
          <p className='mt-0.5 text-xs text-white/55'>Compita com amigos e mantenha sua streak 🔥</p>
        </div>

        <div className='flex items-center gap-2'>
          <button className='cursor-pointer rounded-xl bg-[#39FF14] px-3 py-2 text-xs font-semibold text-[#0F0C22] hover:brightness-110'>Criar grupo</button>
          <button className='cursor-pointer rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10'>
            Entrar com convite
          </button>
        </div>
      </div>

      <div className='mt-4 flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
        {groups.map((g) => (
          <button key={g.name} className='min-w-[220px] rounded-2xl border border-white/10 bg-black/20 p-3 text-left hover:bg-white/5' type='button'>
            <div className='flex items-center justify-between gap-2'>
              <p className='truncate text-sm font-semibold text-white'>{g.name}</p>
              <span className='rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-white/70 ring-1 ring-white/10'>{g.members} membros</span>
            </div>

            <div className='mt-2 flex items-center gap-2 text-xs text-white/60'>
              <span className='rounded-full bg-white/5 px-2 py-0.5 ring-1 ring-white/10'>🔥 streak {g.streak}d</span>
              <span className='rounded-full bg-white/5 px-2 py-0.5 ring-1 ring-white/10'>🏆 você #{g.rank}</span>
            </div>

            <p className='mt-2 text-xs text-white/45'>Meta de hoje: registrar leitura</p>
          </button>
        ))}
      </div>
    </section>
  );
}

export default async function FeedPage() {
  // Mock data (só pra testar scroll)
  const posts = [
    {
      name: 'Luna',
      handle: 'luna_reads',
      time: 'agora',
      text: 'Dica rápida: quando eu travo num livro, eu faço uma meta micro.\n10 páginas ou 10 minutos. Quase sempre eu continuo depois.',
      tags: ['habito', 'metas', 'cozy'],
      likes: 24,
      replies: 6,
      saves: 12,
    },
    {
      name: 'Milo',
      handle: 'milo_bookworm',
      time: '12m',
      text: 'Se você tá sem energia: relê um capítulo favorito.\nVocê volta pro ritmo sem sentir “culpa” de começar do zero.',
      tags: ['motivacao', 'releitura'],
      likes: 18,
      replies: 3,
      saves: 9,
    },
    {
      name: 'Nina',
      handle: 'nina_pages',
      time: '25m',
      text: 'Eu comecei a marcar frases que eu gostaria de escrever.\nAjuda MUITO a prestar atenção (e dá vontade de ler mais).',
      tags: ['anotacoes', 'foco'],
      likes: 41,
      replies: 11,
      saves: 28,
    },
    {
      name: 'Theo',
      handle: 'theo_shelves',
      time: '1h',
      text: 'Rotina cozy de leitura: chá + luz baixa + playlist lo-fi.\nDepois disso, meu cérebro entende que é “hora de ler”.',
      tags: ['rotina', 'ambiente'],
      likes: 33,
      replies: 8,
      saves: 19,
    },
    {
      name: 'Sofi',
      handle: 'sofi_tbr',
      time: '2h',
      text: 'Meta do mês: 1 livro curto + 1 longo.\nO curto dá sensação de progresso, o longo dá profundidade.',
      tags: ['planejamento', 'tbr'],
      likes: 27,
      replies: 4,
      saves: 14,
    },
  ];

  // duplica pra ter bastante scroll
  const longFeed = Array.from({ length: 6 }).flatMap((_, i) =>
    posts.map((p, idx) => ({
      ...p,
      time: i === 0 ? p.time : `${i + 1}h`,
      likes: p.likes + i * 7 + idx,
      replies: p.replies + i * 2,
      saves: p.saves + i * 3,
    })),
  );

  return (
    <main className='mx-auto w-full max-w-2xl px-4 py-6 md:px-6 md:py-10'>
      <GroupStrip />

      {/* topo */}
      <div className='mt-6 flex items-end justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight text-white'>Feed</h1>
          <p className='mt-1 text-sm text-white/60'>Dicas de leitura, progresso e vibes cozy ✨</p>
        </div>

        <button className='cursor-pointer rounded-xl bg-[#39FF14] px-4 py-2 text-sm font-semibold text-[#1F1B3A] shadow-lg hover:brightness-110'>Novo post</button>
      </div>

      {/* composer fake */}
      <section className='mt-6 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur'>
        <div className='flex gap-3'>
          <div className='mt-1'>
            <Avatar name='Você' />
          </div>

          <div className='flex-1'>
            <div className='rounded-xl bg-black/20 p-3 text-sm text-white/60 ring-1 ring-white/10'>Compartilhe uma dica de leitura… (mock)</div>

            <div className='mt-3 flex items-center justify-between'>
              <div className='flex gap-2 text-white/60'>
                <button className='cursor-pointer rounded-lg px-2 py-1 hover:bg-white/5'>📚</button>
                <button className='cursor-pointer rounded-lg px-2 py-1 hover:bg-white/5'>✨</button>
                <button className='cursor-pointer rounded-lg px-2 py-1 hover:bg-white/5'>🏷️</button>
              </div>

              <button className='cursor-pointer rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/15'>
                Postar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* feed */}
      <section className='mt-6 space-y-4'>
        {longFeed.map((p, i) => (
          <PostCard key={`${p.handle}-${i}`} {...p} />
        ))}
      </section>

      {/* bottom spacer */}
      <div className='h-10' />
    </main>
  );
}
