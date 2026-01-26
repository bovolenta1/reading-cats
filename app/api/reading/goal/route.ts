import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ApiError, backendFetchJSON } from '@/src/lib/api/backend';

export const runtime = 'nodejs';

export async function PUT(req: Request) {
  const store = await cookies();
  const idToken = store.get('id_token')?.value;

  const body = await req.json().catch(() => ({}));
  const pages = Number(body?.pages);

  if (!Number.isFinite(pages) || pages < 1 || pages > 999) {
    return NextResponse.json({ error: 'Invalid pages' }, { status: 422 });
  }

  if (!idToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const data = await backendFetchJSON<unknown>('/v1/reading/goal', {
      method: 'PUT',
      token: idToken,
      body: { pages },
      cache: 'no-store',
    });

    if (data === null) return NextResponse.json({ ok: true }, { status: 200 });

    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    if (e instanceof ApiError) {
      return NextResponse.json({ error: 'Backend error', details: e.body }, { status: e.status });
    }

    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
