import 'server-only';

import { cookies } from 'next/headers';
import { backendFetchJSON } from '@/src/lib/api/backend';
import type { ReadingProgress, GoalInfo, GetReadingProgressResponse } from './reading';

export type ReadingProgressWithGoals = {
  progress: ReadingProgress;
  currentGoal?: GoalInfo;
  nextGoal?: GoalInfo;
};

export async function getReadingProgressServer(): Promise<ReadingProgressWithGoals> {
  const store = await cookies();
  const idToken = store.get('id_token')?.value;

  if (!idToken) {
    throw new Error('Not authenticated');
  }

  const data = await backendFetchJSON<GetReadingProgressResponse>('/v1/reading/progress', {
    method: 'GET',
    token: idToken,
    cache: 'no-store',
  });

  return {
    progress: data.progress,
    currentGoal: data.current_goal,
    nextGoal: data.next_goal,
  };
}
