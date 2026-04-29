import { computeBadgeProgress, computeEcoLevel, computeEcoPoints } from '@/lib/badges';
import { useScanStore } from '@/store/scanStore';
import { useMemo } from 'react';

export function useBadges() {
  const events = useScanStore((s) => s.events);

  const badgeProgress = useMemo(() => computeBadgeProgress(events), [events]);
  const ecoPoints    = useMemo(() => computeEcoPoints(events), [events]);
  const ecoLevel     = useMemo(() => computeEcoLevel(ecoPoints), [ecoPoints]);
  const unlockedCount = useMemo(() => badgeProgress.filter((b) => b.unlocked).length, [badgeProgress]);

  return { badgeProgress, ecoLevel, unlockedCount, totalBadges: badgeProgress.length };
}
