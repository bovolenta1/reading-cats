import GroupsPanel, { GroupItem } from '@/src/components/feed/GroupsPanel';
import PostCard from '@/src/components/feed/PostCard';
import Avatar from '@/src/components/ui/Avatar';
import { getReadingProgressServer } from '@/src/lib/api/reading.server';
import StreakSection from '@/src/components/feed/StreakSection';

const groups: GroupItem[] = [
  {
    id: 'g1',
    name: 'RC - Founders Club',
    emoji: '⭐',
    iconSrc: '/group-icons/founders-reading-cats-icon.png',
    rank: 1,
    membersCount: 6,
    streakDays: 7,
    pointsLabel: '+3',
    todayPages: 50,
    goalPages: 120,
    highlight: true,
    avatars: [
      { type: 'dicebear', seed: 'Eduardo' },
      { type: 'dicebear', seed: 'Milo' },
      { type: 'dicebear', seed: 'Luna' },
      { type: 'dicebear', seed: 'Nina' },
      { type: 'dicebear', seed: 'Theo' },
    ],
  },
  {
    id: 'g2',
    name: 'Noite Literária',
    iconSrc: '/group-icons/magic-globe-icon.png',
    emoji: '🌙',
    rank: 2,
    membersCount: 4,
    streakDays: 3,
    pointsLabel: '+2',
    todayPages: 10,
    goalPages: 80,
    avatars: [
      { type: 'dicebear', seed: 'Marina' },
      { type: 'dicebear', seed: 'Luca' },
      { type: 'dicebear', seed: 'Sofia' },
      { type: 'dicebear', seed: 'Bruno' },
    ],
  },
];

export default async function FeedPage() {
  const { progress, currentGoal, nextGoal } = await getReadingProgressServer();

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
    <main className='mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-10'>
      {/* TOP GRID */}
      <section className='grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6'>
        {/* Col 1 / Row 1 */}
        <div className='lg:col-start-1 lg:row-start-1'>
          <StreakSection
            initialProgress={progress}
            initialCurrentGoal={currentGoal}
            initialNextGoal={nextGoal}
          />
        </div>

        {/* Col 2 / Row 1-2 (row span) */}
        <div className='lg:col-start-2 lg:row-start-1 lg:row-span-2'>
          <GroupsPanel groups={groups} />
        </div>

        {/* Col 1 / Row 2 */}
        <div className='mt-2 flex items-end justify-between gap-4 lg:col-start-1 lg:row-start-2'>
          <div>
            <h1 className='text-3xl font-semibold tracking-tight text-white'>Feed</h1>
            <p className='mt-1 text-sm text-white/60'>Dicas de leitura, progresso e vibes cozy ✨</p>
          </div>

          <button className='cursor-pointer rounded-xl bg-[#39FF14] px-4 py-2 text-sm font-semibold text-[#1F1B3A] shadow-lg hover:brightness-110'>
            Novo post
          </button>
        </div>
      </section>

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

      <div className='h-10' />
    </main>
  );
}
