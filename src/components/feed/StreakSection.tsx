'use client';

import StreakHero from './StreakHero';
import type { ReadingProgress, GoalInfo } from '@/src/lib/api/reading';

export default function StreakSection({
  initialProgress,
  initialCurrentGoal,
  initialNextGoal,
}: {
  initialProgress: ReadingProgress;
  initialCurrentGoal?: GoalInfo;
  initialNextGoal?: GoalInfo;
}) {
  return (
    <StreakHero
      progress={initialProgress}
      currentGoal={initialCurrentGoal}
      nextGoal={initialNextGoal}
    />
  );
}
