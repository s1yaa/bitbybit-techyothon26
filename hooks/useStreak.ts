import { useUserStore } from '@/store/userStore';
import { SortingEvent } from '@/types';
import { useEffect, useState } from 'react';

const MOCK_EVENTS: SortingEvent[] = [
  { id: '1', category: 'recyclable', label: 'Bottle', confidence: 0.9, timestamp: new Date().toISOString() },
  { id: '2', category: 'dry', label: 'Paper', confidence: 0.9, timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: '3', category: 'wet', label: 'Food', confidence: 0.9, timestamp: new Date(Date.now() - 2 * 86400000).toISOString() },
];

export function useStreak() {
  const [events, setEvents] = useState<SortingEvent[]>([]);
  const [streakDays, setStreakDays] = useState(0);
  const [daysThisWeek, setDaysThisWeek] = useState<boolean[]>(Array(7).fill(false));

  const setStreakStore = useUserStore((s) => s.incrementStreak);
  const resetStore = useUserStore((s) => s.reset);

  useEffect(() => {
    setEvents(MOCK_EVENTS);
  }, []);

  useEffect(() => {
    if (events.length === 0) return;

    const streak = calculateStreak(events);
    const week = calculateDaysThisWeek(events);

    setStreakDays(streak);
    setDaysThisWeek(week);

    useUserStore.setState({ streakDays: streak });

  }, [events]);

  return { streakDays, daysThisWeek };
}

function calculateStreak(events: SortingEvent[]): number {
  const dates = new Set(
    events.map((e) => e.timestamp.split('T')[0])
  );

  let streak = 0;
  let current = new Date();

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

function calculateDaysThisWeek(events: SortingEvent[]): boolean[] {
  const result = Array(7).fill(false);

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