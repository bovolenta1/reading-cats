import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function requireAuth(returnTo: string = "/feed") {
  const store = await cookies();

  const accessToken = store.get("access_token")?.value;

  if (!accessToken) {
    redirect(`/login?returnTo=${encodeURIComponent(returnTo)}`);
  }

  return { accessToken };
}
