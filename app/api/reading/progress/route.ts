import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ApiError, backendFetchJSON } from '@/src/lib/api/backend';

export const runtime = 'nodejs';

export async function GET() {
  const store = await cookies();
  const idToken = store.get('id_token')?.value;

  if (!idToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const data = await backendFetchJSON<{ progress: unknown }>('/v1/reading/progress', {
      method: 'GET',
      token: idToken,
      cache: 'no-store',
    });

    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    if (e instanceof ApiError) {
      return NextResponse.json(e.body ?? { error: 'Upstream error' }, { status: e.status });
    }
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
