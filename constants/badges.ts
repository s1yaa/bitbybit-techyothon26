import { WasteCategory } from '@/types';

export type BadgeTier = 'beginner' | 'advanced';
export type BadgeType = 'total' | 'category' | 'days';

export interface BadgeDefinition {
  id: string;
  emoji: string;
  title: string;
  description: string;
  tier: BadgeTier;
  type: BadgeType;
  target: number;
  category?: WasteCategory;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  { id: 'first_step', emoji: '🌿', title: 'First Step', description: 'Complete your first scan', tier: 'beginner', type: 'total', target: 1 },
  { id: 'getting_clean', emoji: '🧼', title: 'Getting Clean', description: 'Scan 5 items total', tier: 'beginner', type: 'total', target: 5 },
  { id: 'sorting_rookie', emoji: '🗂️', title: 'Sorting Rookie', description: 'Use app on 3 different days', tier: 'beginner', type: 'days', target: 3 },
  { id: 'plastic_hero', emoji: '🧴', title: 'Plastic Hero', description: '20 recyclable items', tier: 'advanced', type: 'category', category: 'recyclable', target: 20 },
  { id: 'compost_king', emoji: '🍃', title: 'Compost King', description: '15 wet waste items', tier: 'advanced', type: 'category', category: 'wet', target: 15 },
  { id: 'dry_master', emoji: '📦', title: 'Dry Master', description: '20 dry waste items', tier: 'advanced', type: 'category', category: 'dry', target: 20 },
  { id: 'hazard_hunter', emoji: '☢️', title: 'Hazard Hunter', description: '5 hazardous items', tier: 'advanced', type: 'category', category: 'hazardous', target: 5 },
];

export interface EcoLevelDef {
  level: number;
  title: string;
  minPoints: number;
  maxPoints: number;
  color: string;
}

export const ECO_LEVELS: EcoLevelDef[] = [
  { level: 1, title: 'Eco Beginner',  minPoints: 0,   maxPoints: 49,   color: '#86efac' },
  { level: 2, title: 'Eco Explorer',  minPoints: 50,  maxPoints: 149,  color: '#4ade80' },
  { level: 3, title: 'Eco Warrior',   minPoints: 150, maxPoints: 299,  color: '#22c55e' },
  { level: 4, title: 'Eco Champion',  minPoints: 300, maxPoints: 499,  color: '#16a34a' },
  { level: 5, title: 'Eco Master',    minPoints: 500, maxPoints: 9999, color: '#15803d' },
];
