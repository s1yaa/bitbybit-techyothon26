import type { WasteCategory } from '../types';

export const WASTE_CATEGORIES: Record<
  WasteCategory,
  { label: string; bin: string; color: string; icon: string; description: string }
> = {
  wet: {
    label: 'Wet waste',
    bin: 'Green bin',
    color: '#5B9E50',
    icon: '🥬',
    description: 'Food scraps, peels, leftovers, garden waste',
  },
  dry: {
    label: 'Dry waste',
    bin: 'Blue bin',
    color: '#4A90C4',
    icon: '📦',
    description: 'Non-recyclable paper, dirty packaging, tissues',
  },
  recyclable: {
    label: 'Recyclable',
    bin: 'Yellow bin',
    color: '#EAB45C',
    icon: '♻️',
    description: 'Clean plastics, glass, metals, cardboard',
  },
  hazardous: {
    label: 'Hazardous',
    bin: 'Red bin',
    color: '#C94B4B',
    icon: '⚠️',
    description: 'Batteries, paint, chemicals, pesticides',
  },
  ewaste: {
    label: 'E-waste',
    bin: 'Purple bin',
    color: '#7F77DD',
    icon: '💻',
    description: 'Electronics, cables, phones, circuit boards',
  },
} as const

export const CO2_SAVINGS_KG: Record<WasteCategory, number> = {
  wet: 0.5,
  dry: 0.1,
  recyclable: 1.2,
  hazardous: 0.8,
  ewaste: 2.5,
}

export const LANDFILL_DIVERSION_KG: Record<WasteCategory, number> = {
  wet: 0.3,
  dry: 0.2,
  recyclable: 0.4,
  hazardous: 0.15,
  ewaste: 0.6,
}