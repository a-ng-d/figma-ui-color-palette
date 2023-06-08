import type { PaletteConfiguration, Presets } from './types'

export const palette: PaletteConfiguration = {
  name: '',
  preset: {},
  min: null,
  max: null,
  scale: {},
  view: 'PALETTE_WITH_PROPERTIES',
  textColorsTheme: {
    lightColor: '#FFFFFF',
    darkColor: '#000000',
  },
}

export const presets: Presets = {
  material: {
    name: 'Material Design 50-900 (Google)',
    scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
    min: 24,
    max: 96,
  },
  ant: {
    name: 'Ant Design 1-10',
    scale: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    min: 24,
    max: 96,
  },
  atlassian: {
    name: 'ADS Foundations 50-500 (Atlassian)',
    scale: [50, 75, 100, 200, 300, 400, 500],
    min: 24,
    max: 96,
  },
  atlassianNeutral: {
    name: 'ADS Foundations, Neutral 50-500 (Atlassian)',
    scale: [
      0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500, 600, 700,
      800, 900,
    ],
    min: 8,
    max: 100,
  },
  carbon: {
    name: 'Carbon 10-100 (IBM)',
    scale: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    min: 24,
    max: 96,
  },
  base: {
    name: 'Base 50-700 (Uber)',
    scale: [50, 100, 200, 300, 400, 500, 600, 700],
    min: 24,
    max: 96,
  },
  custom: {
    name: 'Custom',
    scale: [1, 2],
    min: 10,
    max: 90,
  },
}
