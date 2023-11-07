import type { PaletteConfiguration, PresetConfiguration } from './types'

export const palette: PaletteConfiguration = {
  name: '',
  description: '',
  min: undefined,
  max: undefined,
  preset: {},
  scale: {},
  colorSpace: 'LCH',
  view: 'PALETTE_WITH_PROPERTIES',
  textColorsTheme: {
    lightColor: '#FFFFFF',
    darkColor: '#000000',
  },
}

export const presets: Array<PresetConfiguration> = [
  {
    name: 'Material Design 50-900 (Google)',
    scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
    min: 24,
    max: 96,
    id: 'MATERIAL',
  },
  {
    name: 'Ant Design 1-10',
    scale: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    min: 24,
    max: 96,
    id: 'ANT',
  },
  {
    name: 'ADS Foundations 50-500 (Atlassian)',
    scale: [50, 75, 100, 200, 300, 400, 500],
    min: 24,
    max: 96,
    id: 'ADS',
  },
  {
    name: 'ADS Foundations, Neutral 50-500 (Atlassian)',
    scale: [
      0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500, 600, 700,
      800, 900,
    ],
    min: 8,
    max: 100,
    id: 'ADS_NEUTRAL',
  },
  {
    name: 'Carbon 10-100 (IBM)',
    scale: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    min: 24,
    max: 96,
    id: 'CARBON',
  },
  {
    name: 'Base 50-700 (Uber)',
    scale: [50, 100, 200, 300, 400, 500, 600, 700],
    min: 24,
    max: 96,
    id: 'BASE',
  },
  {
    name: 'Custom',
    scale: [1, 2],
    min: 10,
    max: 90,
    id: 'CUSTOM',
  },
]

export const notifications: Array<string> = []
