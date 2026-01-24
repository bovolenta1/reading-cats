"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { Me } from "./types";

type Status = "idle" | "loading" | "ready" | "error";

type UserContextValue = {
  me: Me | null;
  status: Status;
  error: string | null;
  refresh: () => Promise<void>;
  setMe: (me: Me | null) => void;
};

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ initialMe, children }: { initialMe: Me | null; children: React.ReactNode }) {
  const [me, setMe] = useState<Me | null>(initialMe);
  const [status, setStatus] = useState<Status>(initialMe ? "ready" : "idle");
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setStatus("loading");
    setError(null);

    try {
      const res = await fetch("/api/me", { cache: "no-store" });

      if (res.status === 401) {
        setMe(null);
        setStatus("ready");
        setError("unauthorized");
        return;
      }

      const data = (await res.json()) as Me;
      setMe(data);
      setStatus("ready");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "unknown_error");
    }
  }, []);

  const value = useMemo(() => ({ me, status, error, refresh, setMe }), [me, status, error, refresh]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within <UserProvider />");
  return ctx;
}
