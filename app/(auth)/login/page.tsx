import Image from "next/image";
import LoginPanel from "./loginPanel";

export default function LoginPage() {
  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#0F0C22]">
      {/* BACKGROUND IMAGE */}
      <div className="pointer-events-none fixed inset-0 z-1">
        <Image
          src="/app-bg-4k.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
        />

        {/* contraste + vibe */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F0C22]/65 via-[#120F2A]/55 to-[#3A2F5C]/55" />
        <div className="absolute inset-0 bg-[radial-gradient(1100px_800px_at_50%_15%,rgba(57,255,20,.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* CONTENT */}
      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl items-center justify-center p-4 sm:p-6 z-10">
        <div className="w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_30px_90px_-40px_rgba(0,0,0,.85)] backdrop-blur-xl">
          {/* inner glow */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />

          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* LEFT - Image section hidden on mobile */}
            <section className="relative p-7 sm:p-8 lg:p-10 hidden lg:flex flex-col items-center justify-center">
              {/* subtle galaxy overlay inside the left panel */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_600px_at_40%_10%,rgba(255,255,255,.06),transparent_55%)]" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_500px_at_30%_85%,rgba(57,255,20,.08),transparent_60%)]" />

              <div className="relative flex flex-col items-center text-center">
                <Image
                  src="/reading-cat-2.png"
                  alt="Reading Cats illustration"
                  width={360}
                  height={360}
                  priority
                  className="h-auto w-[260px] sm:w-[300px] drop-shadow-[0_20px_40px_rgba(0,0,0,.45)]"
                />

                <p className="mt-4 text-sm text-white/70">
                  Entre e acompanhe desafios de leitura com amigos.
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <Badge>📚 hábitos</Badge>
                  <Badge>🔥 streak</Badge>
                  <Badge>✨ cozy vibe</Badge>
                </div>
              </div>
            </section>

            {/* RIGHT - Login panel */}
            <section className="relative p-7 sm:p-8 lg:p-10 flex flex-col justify-center">
              {/* Mobile header */}
              <div className="lg:hidden flex items-center gap-3 mb-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
                  <Image
                    src="/reading-cat-icon-2.png"
                    alt="Reading Cats"
                    width={36}
                    height={32}
                    priority
                    className='p-[2]'
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white/90">Reading Cats</p>
                  <p className="text-xs text-white/55">cozy reading • challenges • streaks</p>
                </div>
              </div>

              <div className="mx-auto w-full max-w-md">
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
  return (
    <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70 backdrop-blur">
      {children}
    </span>
  );
}
