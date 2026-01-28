export type GroupData = {
  name: string;
  icon: string;
  type: 'invite_only' | 'public';
  seasonName?: string;
  durationDays?: number;
  ranking: 'daily_checkins' | null;
};

export type GroupIconOption = {
  id: string;
  label: string;
};
