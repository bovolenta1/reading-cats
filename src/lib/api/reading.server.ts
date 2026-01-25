import 'server-only';

import { cookies } from 'next/headers';
import { backendFetchJSON } from '@/src/lib/api/backend';
import type { ReadingProgress } from './reading';

export async function getReadingProgressServer(): Promise<ReadingProgress> {
  const store = await cookies();
  const idToken = store.get('id_token')?.value;

  if (!idToken) {
    throw new Error('Not authenticated');
  }

  const data = await backendFetchJSON<{ progress: ReadingProgress }>('/v1/reading/progress', {
    method: 'GET',
    token: idToken,
    cache: 'no-store',
  });

  return data.progress;
}
