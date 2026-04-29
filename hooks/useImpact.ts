import {
  calcCO2Saved,
  calcLandfillDiverted,
  getCategoryBreakdown,
} from '@/lib/impact';
import { SortingEvent } from '@/types';
import { useEffect, useState } from 'react';

const MOCK_EVENTS: SortingEvent[] = [
  { id: '1', category: 'recyclable', label: 'Plastic bottle', confidence: 0.94, timestamp: new Date().toISOString() },
  { id: '2', category: 'dry', label: 'Paper', confidence: 0.91, timestamp: new Date().toISOString() },
  { id: '3', category: 'wet', label: 'Food waste', confidence: 0.88, timestamp: new Date().toISOString() },
  { id: '4', category: 'recyclable', label: 'Can', confidence: 0.92, timestamp: new Date().toISOString() },
  { id: '5', category: 'hazardous', label: 'Battery', confidence: 0.97, timestamp: new Date().toISOString() },
  { id: '6', category: 'ewaste', label: 'Old phone', confidence: 0.95, timestamp: new Date().toISOString() },
  { id: '7', category: 'dry', label: 'Cardboard', confidence: 0.9, timestamp: new Date().toISOString() },
  { id: '8', category: 'wet', label: 'Vegetable peels', confidence: 0.87, timestamp: new Date().toISOString() },
  { id: '9', category: 'recyclable', label: 'Glass bottle', confidence: 0.93, timestamp: new Date().toISOString() },
  { id: '10', category: 'dry', label: 'Wrapper', confidence: 0.85, timestamp: new Date().toISOString() },
];

export function useImpact() {
  const [events, setEvents] = useState<SortingEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setEvents(MOCK_EVENTS);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const totalSorted = events.length;
  const co2Saved = calcCO2Saved(events);
  const landfillDiverted = calcLandfillDiverted(events);
  const breakdown = getCategoryBreakdown(events);

  const weeklyTrend = getWeeklyTrend(events);

  return {
    events,
    totalSorted,
    co2Saved,
    landfillDiverted,
    breakdown,
    weeklyTrend,
    isLoading,
  };
}


function getWeeklyTrend(events: SortingEvent[]) {
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