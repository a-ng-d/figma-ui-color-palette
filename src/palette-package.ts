export const palette = {
  scale: {},
  min: null,
  max: null,
  captions: true,
  preset: {}
};

export const presets = {
  material: {
    name: 'Material Design (50-900)',
    scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
    min: 24,
    max: 96
  },
  ant: {
    name: 'Ant Design (1-13)',
    scale: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    min: 16,
    max: 100
  },
  atlassian: {
    name: 'Atlassian (0-900)',
    scale: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500, 600, 700, 800, 900],
    min: 8,
    max: 100
  },
  custom: {
    name: 'Custom',
    scale: [1, 2],
    min: 0,
    max: 100
  }
}
