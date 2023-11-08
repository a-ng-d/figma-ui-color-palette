import processSelection from './bridges/processSelection'
import checkPlanStatus from './bridges/checkPlanStatus'
import createPalette from './bridges/createPalette'
import { presets } from './utils/palettePackage'
import doLightnessScale from './utils/doLightnessScale'
import loadUI from './bridges/loadUI'
import loadParameters from './bridges/loadParameters'

let palette: SceneNode

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
  if (parameters == undefined) loadUI(palette)
  else {
    const selectedPreset = presets.find(
      (preset) => preset.name === parameters.preset
    )
    createPalette(
      {
        data: {
          sourceColors: figma.currentPage.selection
            .filter(
              (element) =>
                element.type != 'GROUP' &&
                element.type != 'EMBED' &&
                element.type != 'CONNECTOR' &&
                element.getPluginDataKeys().length == 0 &&
                (element as any).fills.filter(
                  (fill: Paint) => fill.type === 'SOLID'
                ).length != 0
            )
            .map((element) => {
              return {
                name: element.name,
                rgb: (element as any).fills[0].color,
                source: 'CANVAS',
                id: '',
              }
            }),
          palette: {
            name: parameters.name == undefined ? '' : parameters.name,
            description: '',
            preset: presets.find((preset) => preset.name === parameters.preset),
            scale: doLightnessScale(
              selectedPreset?.scale ?? [1, 2],
              selectedPreset?.min ?? 0,
              selectedPreset?.max ?? 100
            ),
            colorSpace: parameters.space.toUpperCase().replace(' ', '_'),
            view: parameters.view.toUpperCase().replace(' ', '_'),
            textColorsTheme: {
              lightColor: '#FFFFFF',
              darkColor: '#000000',
            },
          },
        },
      },
      palette
    )
    figma.closePlugin()
  }
})

// Selection
figma.on('selectionchange', () => processSelection())
figma.on('selectionchange', async () => await checkPlanStatus())
