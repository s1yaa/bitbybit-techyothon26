import { BADGE_DEFINITIONS, ECO_LEVELS, type BadgeDefinition } from '@/constants/badges';
import { SortingEvent, WasteCategory } from '@/types';

export interface BadgeProgress extends BadgeDefinition {
  current: number;
  unlocked: boolean;
  progress: number;
}

export interface EcoLevelInfo {
  level: number;
  title: string;
  color: string;
  points: number;
  progress: number;
  nextLevelPoints: number | null;
}

const POINTS_PER_CATEGORY: Record<WasteCategory, number> = {
  recyclable: 15,
  dry: 10,
  wet: 10,
  hazardous: 20,
  ewaste: 20,
};

export function computeEcoPoints(events: SortingEvent[]): number {
  return events.reduce((sum, e) => sum + (POINTS_PER_CATEGORY[e.category] ?? 5), 0);
}

export function computeEcoLevel(points: number): EcoLevelInfo {
  const def = ECO_LEVELS.find((l) => points <= l.maxPoints) ?? ECO_LEVELS[ECO_LEVELS.length - 1];
  const next = ECO_LEVELS.find((l) => l.level === def.level + 1);
  const range = def.maxPoints - def.minPoints + 1;
  const progress = Math.min((points - def.minPoints) / range, 1);
  return {
    level: def.level,
    title: def.title,
    color: def.color,
    points,
    progress,
    nextLevelPoints: next ? next.minPoints : null,
  };
}

export function computeBadgeProgress(events: SortingEvent[]): BadgeProgress[] {
  const totalScans = events.length;
  const distinctDays = new Set(events.map((e) => e.timestamp.split('T')[0])).size;
  const counts: Record<WasteCategory, number> = { recyclable: 0, dry: 0, wet: 0, hazardous: 0, ewaste: 0 };
  events.forEach((e) => { counts[e.category] += 1; });

  return BADGE_DEFINITIONS.map((badge) => {
    let current = 0;
    if (badge.type === 'total') current = totalScans;
    else if (badge.type === 'days') current = distinctDays;
    else if (badge.type === 'category' && badge.category) current = counts[badge.category];

    return {
      ...badge,
      current: Math.min(current, badge.target),
      unlocked: current >= badge.target,
      progress: Math.min(current / badge.target, 1),
    };
  });
}
