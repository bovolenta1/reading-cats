import { requireAuth } from "@/src/lib/auth/requireAuth";
import { cookies } from "next/headers";
import { getUserFromIdToken } from "@/src/lib/auth/getUserFromIdToken";
import Header from "@/src/components/Header";
import StarsBackground from "@/src/components/StarsBackground";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await requireAuth();

  const store = await cookies();
  const idToken = store.get("id_token")?.value;
  const user = idToken ? getUserFromIdToken(idToken) : null;

  return (
    <div className="min-h-[100svh] bg-[#0b0f14] text-white">
      <StarsBackground />

      {/* conteúdo por cima */}
      <div className="relative z-10">
        <Header user={user} />

        {/* fundo com gradiente “cozy” por trás do conteúdo */}
        <main className="relative">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_800px_at_80%_10%,rgba(124,58,237,.25),transparent_60%),radial-gradient(1000px_700px_at_10%_90%,rgba(6,182,212,.22),transparent_55%)]" />
          {children}
        </main>
      </div>
    </div>
  );
}
