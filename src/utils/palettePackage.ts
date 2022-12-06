interface Preset {
  name: string,
  scale: Array<number>,
  min: number,
  max: number
}

interface Scale {
  [key: string]: string
}

interface Palette {
  scale: Scale,
  min: number,
  max: number,
  captions: boolean,
  preset: {}
}

export const palette: Palette = {
  scale: {},
  min: null,
  max: null,
  captions: true,
  preset: {}
};

export const presets = {
  material: {
    name: 'Material Design﹒Google (50-900)',
    scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
    min: 24,
    max: 96
  } as Preset,
  ant: {
    name: 'Ant Design (1-13)',
    scale: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    min: 16,
    max: 100
  } as Preset,
  atlassian: {
    name: 'ADS Foundations﹒Atlassian (0-900)',
    scale: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500, 600, 700, 800, 900],
    min: 8,
    max: 100
  } as Preset,
  carbon: {
    name: 'Carbon﹒IBM (10-100)',
    scale: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    min: 24,
    max: 96
  } as Preset,
  base: {
    name: 'Base﹒Uber (50-700)',
    scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
    min: 24,
    max: 100
  } as Preset,
  custom: {
    name: 'Custom',
    scale: [1, 2],
    min: 10,
    max: 90
  } as Preset
}
