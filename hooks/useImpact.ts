import {
  calcCO2Saved,
  calcLandfillDiverted,
  getCategoryBreakdown,
} from '@/lib/impact';
import { useScanStore } from '@/store/scanStore';
import { useMemo } from 'react';

export function useImpact() {
  const events = useScanStore((s) => s.events);

  const totalSorted = events.length;
  const co2Saved = useMemo(() => calcCO2Saved(events), [events]);
  const landfillDiverted = useMemo(() => calcLandfillDiverted(events), [events]);
  const breakdown = useMemo(() => getCategoryBreakdown(events), [events]);
  const weeklyTrend = useMemo(() => getWeeklyTrend(events), [events]);

  return {
    events,
    totalSorted,
    co2Saved,
    landfillDiverted,
    breakdown,
    weeklyTrend,
    isLoading: false,
  };
}

function getWeeklyTrend(events: ReturnType<typeof useScanStore.getState>['events']) {
  const days: { [key: string]: number } = {};

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    days[key] = 0;
  }

  events.forEach((e) => {
    const key = e.timestamp.split('T')[0];
    if (days[key] !== undefined) {
      days[key]++;
    }
  });

  return Object.entries(days)
    .map(([date, count]) => ({ date, count }))
    .reverse();
}