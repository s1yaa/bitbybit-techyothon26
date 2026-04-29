import { WASTE_CATEGORIES } from '@/constants/waste';
import { WasteCategory } from '@/types';
import * as Speech from 'expo-speech';

export function speak(category: WasteCategory, label: string): void {
  const binName = WASTE_CATEGORIES[category]?.bin ?? category;
  const message = `This is ${label}. Please use the ${binName}.`;

  Speech.stop();
  Speech.speak(message, {
    language: 'en-US',
    pitch: 1.0,
    rate: 0.92,
  });
}

export function stop(): void {
  Speech.stop();
}