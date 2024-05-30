import checkPlanStatus from './bridges/checks/checkPlanStatus'
import createPalette from './bridges/creations/createPalette'
import loadParameters from './bridges/loadParameters'
import loadUI from './bridges/loadUI'
import processSelection from './bridges/processSelection'
import { PaletteConfiguration } from './types/configurations'
import doLightnessScale from './utils/doLightnessScale'
import { presets } from './utils/palettePackage'
import setPaletteMigration from './utils/setPaletteMigration'

// Fonts
figma.loadFontAsync({ family: 'Inter', style: 'Regular' })
figma.loadFontAsync({ family: 'Inter', style: 'Medium' })
figma.loadFontAsync({ family: 'Red Hat Mono', style: 'Medium' })

// Parameters
figma.parameters.on(
  'input',
  ({ parameters, key, query, result }: ParameterInputEvent) =>
    loadParameters({ parameters, key, query, result })
)

// Loader
figma.on('run', async ({ parameters }: RunEvent) => {
  if (parameters === undefined) loadUI()
  else {
    const selectedPreset = presets.find(
      (preset) => preset.name === parameters.preset
    )
    createPalette({
      data: {
        sourceColors: figma.currentPage.selection
          .filter(
            (element) =>
              element.type !== 'GROUP' &&
              element.type !== 'EMBED' &&
              element.type !== 'CONNECTOR' &&
              element.getPluginDataKeys().length === 0 &&
              (element as any).fills.filter(
                (fill: Paint) => fill.type === 'SOLID'
              ).length !== 0
          )
          .map((element) => {
            return {
              name: element.name,
              rgb: (element as any).fills[0].color,
              source: 'CANVAS',
              id: '',
              isRemovable: false
            }
          }),
        palette: {
          name: parameters.name === undefined ? '' : parameters.name,
          description: '',
          preset: presets.find((preset) => preset.name === parameters.preset),
          scale: doLightnessScale(
            selectedPreset?.scale ?? [1, 2],
            selectedPreset?.min ?? 0,
            selectedPreset?.max ?? 100,
            selectedPreset?.isDistributed ? true : false
          ),
          colorSpace: parameters.space.toUpperCase().replace(' ', '_'),
          visionSimulationMode: 'NONE',
          view: parameters.view.toUpperCase().split(' ').join('_'),
          textColorsTheme: {
            lightColor: '#FFFFFF',
            darkColor: '#000000',
          },
          algorithmVersion: 'v2',
        } as PaletteConfiguration,
      },
    })
    figma.closePlugin()
  }
})

// Migration
figma.on('run', async () => {
  await figma.currentPage.loadAsync()
  figma.currentPage
    .findAllWithCriteria({
      pluginData: {},
    })
    .forEach((palette) => {
      setPaletteMigration(palette)
    })
})
figma.on('currentpagechange', async () => {
  await figma.currentPage.loadAsync()
  figma.currentPage
    .findAllWithCriteria({
      pluginData: {},
    })
    .forEach((palette) => {
      setPaletteMigration(palette)
    })
})

// Selection
figma.on('selectionchange', () => processSelection())
figma.on('selectionchange', async () => await checkPlanStatus())
