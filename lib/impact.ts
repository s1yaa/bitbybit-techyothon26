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