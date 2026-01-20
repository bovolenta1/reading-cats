import Image from 'next/image';
import LoginPanel from './LoginPanel';

export default function LoginPage() {
  return (
    <main className='min-h-screen bg-[#0F0C22]'>
      <div className='pointer-events-none fixed inset-0'>
        <div className='absolute inset-0 bg-gradient-to-br from-[#1F1B3A] via-[#120F2A] to-[#3A2F5C]' />
        <div className='absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#39FF14]/10 blur-3xl' />
        <div className='absolute bottom-0 right-0 h-80 w-80 rounded-full bg-white/5 blur-3xl' />
        <div className='absolute left-0 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-white/5 blur-3xl' />
      </div>

      {/* content */}
      <div className='relative mx-auto flex min-h-screen max-w-6xl items-center justify-center p-6'>
        <div className='w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur'>
          <div className='grid grid-cols-1 lg:grid-cols-2'>
            {/* Left / brand */}
            <section className='relative p-8 lg:p-10'>
              <div className='flex items-center gap-3'>
                <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10'>
                  <Image src='/reading-cat-icon.png' alt='Reading Cats' width={32} height={32} className='h-auto' priority />
                </div>
                <div>
                  <p className='text-sm font-medium text-white/70'>Reading Cats</p>
                  <p className='text-xs text-white/50'>cozy reading • challenges • streaks</p>
                </div>
              </div>

              <div className='mt-10 flex items-center justify-center'>
                <div className='relative w-full max-w-sm rounded-3xl border border-white/10 bg-[#2C355F]/20 py-6'>
                  <div className='absolute -top-10 left-10 h-24 w-24 rounded-full bg-[#39FF14]/10 blur-2xl' />
                  <div className='absolute -bottom-10 right-10 h-28 w-28 rounded-full bg-white/5 blur-2xl' />

                  <div className='relative flex flex-col items-center text-center'>
                    <span className='text-sm text-white/60'>
                      <Image src='/reading-cat-image.png' alt='Reading Cats' width={300} height={300} className='h-auto' priority />
                    </span>

                    <p className='mt-4 text-sm text-white/70'>Entre e acompanhe desafios de leitura com amigos.</p>

                    <div className='mt-6 flex flex-wrap justify-center gap-2'>
                      <Badge>📚 hábitos</Badge>
                      <Badge>🔥 streak</Badge>
                      <Badge>✨ cozy vibe</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Right / form */}
            <section className='p-8 lg:p-10'>
              <div className='mx-auto w-full max-w-md'>
                <LoginPanel />
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className='rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70'>{children}</span>;
}
