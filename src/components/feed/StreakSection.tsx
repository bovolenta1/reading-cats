'use client';

import StreakHero from './StreakHero';
import type { ReadingProgress } from '@/src/lib/api/reading';

export default function StreakSection({ initialProgress }: { initialProgress: ReadingProgress }) {
  return <StreakHero progress={initialProgress} />;
}
