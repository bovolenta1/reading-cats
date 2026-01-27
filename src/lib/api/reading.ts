export type WeekDayProgress = {
  date: string;
  pages: number;
  checked: boolean;
};

export type ReadingProgress = {
  day: {
    date: string;
    pages: number;
    goal_pages: number;
  };
  streak: {
    current_days: number;
  };
  week: WeekDayProgress[];
};

export type GetReadingProgressResponse = {
  progress: ReadingProgress;
  current_goal?: GoalInfo;
  next_goal?: GoalInfo;
};

export type RegisterReadingResponse = {
  progress: ReadingProgress;
  current_goal?: GoalInfo;
  next_goal?: GoalInfo;
};

export type GoalInfo = {
  daily_pages: number;
  valid_from: string;
};

export type ChangeGoalResponse = {
  current_goal: GoalInfo;
  next_goal: GoalInfo;
};

export async function getReadingProgress(): Promise<GetReadingProgressResponse> {
  const res = await fetch('/api/reading/progress', {
    method: 'GET',
    cache: 'no-store',
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(txt || 'Falha ao buscar progresso');
  }

  return res.json();
}

export async function postReading(pages: number): Promise<RegisterReadingResponse> {
  const res = await fetch('/api/reading', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pages }),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(txt || 'Falha ao registrar leitura');
  }

  return res.json();
}

export async function putReadingGoal(pages: number): Promise<ChangeGoalResponse> {
  const res = await fetch('/api/reading/goal', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pages }),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(txt || 'Falha ao alterar meta');
  }

  return res.json();
}
