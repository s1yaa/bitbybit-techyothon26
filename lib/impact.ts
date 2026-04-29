import { SortingEvent, WasteCategory } from '@/types';

export function calcCO2Saved(events: SortingEvent[]): number {
  let total = 0;

  events.forEach((e) => {
    switch (e.category) {
      case 'recyclable':
        total += 0.05;
        break;
      case 'dry':
        total += 0.02;
        break;
      case 'wet':
        total += 0.01;
        break;
      case 'hazardous':
      case 'ewaste':
        total += 0.1;
        break;
      default:
        break;
    }
  });

  return Number(total.toFixed(1));
}

export function calcLandfillDiverted(events: SortingEvent[]): number {
  const total = events.length * 0.2;
  return Number(total.toFixed(1));
}

export function getCategoryBreakdown(
  events: SortingEvent[]
): Record<WasteCategory, number> {
  const breakdown: Record<WasteCategory, number> = {
    recyclable: 0,
    dry: 0,
    wet: 0,
    hazardous: 0,
    ewaste: 0,
  };

  events.forEach((e) => {
    breakdown[e.category] += 1;
  });

  return breakdown;
}

export function getPercentileMessage(
  userCount: number,
  allCounts: number[]
): string {
  if (allCounts.length === 0) return "You're just getting started";

  const lower = allCounts.filter((c) => c < userCount).length;
  const percentile = Math.round((lower / allCounts.length) * 100);

  return `You've sorted more than ${percentile}% of users today`;
}

export interface RecyclingRatePoint {
  date: string;      // ISO date string YYYY-MM-DD
  rate: number;      // 0–100 percentage
  total: number;     // total items scanned that day
  recyclable: number;
}

/**
 * Returns per-day recycling rate (recyclable / total * 100) for the last `days` days.
 * Days with no scans get rate = 0 and total = 0.
 */
export function getRecyclingRateTrend(
  events: SortingEvent[],
  days = 14
): RecyclingRatePoint[] {
  // Build a map of date -> { total, recyclable }
  const map: Record<string, { total: number; recyclable: number }> = {};

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    map[key] = { total: 0, recyclable: 0 };
  }

  events.forEach((e) => {
    const key = e.timestamp.split('T')[0];
    if (map[key] !== undefined) {
      map[key].total += 1;
      if (e.category === 'recyclable') {
        map[key].recyclable += 1;
      }
    }
  });

  return Object.entries(map).map(([date, { total, recyclable }]) => ({
    date,
    total,
    recyclable,
    rate: total === 0 ? 0 : Math.round((recyclable / total) * 100),
  }));
}