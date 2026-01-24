import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { backendFetchJSON, ApiError } from "@/src/lib/api/backend";

export async function GET() {
  const store = await cookies();
  const idToken = store.get("id_token")?.value;

  if (!idToken) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const me = await backendFetchJSON("/v1/me", { token: idToken, cache: "no-store" });
    return NextResponse.json(me, { status: 200 });
  } catch (e) {
    if (e instanceof ApiError) {
      return NextResponse.json(e.body ?? { error: "upstream_error" }, { status: e.status });
    }
    return NextResponse.json({ error: "unknown_error" }, { status: 500 });
  }
}
