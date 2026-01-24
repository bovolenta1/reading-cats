import { cookies } from "next/headers";
import { requireAuth } from "@/src/lib/auth/requireAuth";
import { backendFetchJSON, ApiError } from "@/src/lib/api/backend";
import { UserProvider } from "@/src/contexts/user/UserContext";
import type { Me } from "@/src/contexts/user/types";

import Header from "@/src/components/Header";
import StarsBackground from "@/src/components/StarsBackground";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await requireAuth();

  const store = await cookies();
  const idToken = store.get("id_token")?.value;

  let initialMe: Me | null = null;

  if (idToken) {
    try {
      initialMe = await backendFetchJSON<Me>("/v1/me", { token: idToken, cache: "no-store" });
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        initialMe = null;
      } else {
        throw e;
      }
    }
  }

  return (
    <div className="min-h-[100svh] bg-[#0b0f14] text-white">
      <StarsBackground />
      <div className="relative z-10">
        <UserProvider initialMe={initialMe}>
          <Header />
          <main className="relative">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_800px_at_80%_10%,rgba(124,58,237,.25),transparent_60%),radial-gradient(1000px_700px_at_10%_90%,rgba(6,182,212,.22),transparent_55%)]" />
            {children}
          </main>
        </UserProvider>
      </div>
    </div>
  );
}
