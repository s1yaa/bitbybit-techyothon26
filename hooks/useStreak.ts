import { useScanStore } from '@/store/scanStore';
import { useMemo } from 'react';

export function useStreak() {
  const events = useScanStore((s) => s.events);

  const streakDays = useMemo(() => calculateStreak(events), [events]);
  const daysThisWeek = useMemo(() => calculateDaysThisWeek(events), [events]);

  return { streakDays, daysThisWeek };
}

function calculateStreak(events: ReturnType<typeof useScanStore.getState>['events']): number {
  const dates = new Set(
    events.map((e) => e.timestamp.split('T')[0])
  );

  let streak = 0;
  const current = new Date();

  while (true) {
    const key = current.toISOString().split('T')[0];

    if (dates.has(key)) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

function calculateDaysThisWeek(events: ReturnType<typeof useScanStore.getState>['events']): boolean[] {
  const now = new Date();
  const day = now.getDay();

  const mondayOffset = (day === 0 ? -6 : 1 - day);

  const weekDates: string[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(now.getDate() + mondayOffset + i);
    weekDates.push(d.toISOString().split('T')[0]);
  }

  const eventDates = new Set(events.map(e => e.timestamp.split('T')[0]));

  return weekDates.map(date => eventDates.has(date));
}