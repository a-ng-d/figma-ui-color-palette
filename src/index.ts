import { presets } from '@ui-lib/stores/presets'
import {
  ExchangeConfiguration,
  ViewConfiguration,
} from '@a_ng_d/utils-ui-color-palette'
import { doScale } from '@a_ng_d/figmug-utils'
import setPaletteMigration from './utils/setPaletteMigration'
import globalConfig from './global.config'
import processSelection from './bridges/processSelection'
import loadUI from './bridges/loadUI'
import loadParameters from './bridges/loadParameters'
import createPalette from './bridges/creations/createPalette'
import createDocument from './bridges/creations/createDocument'
import checkPlanStatus from './bridges/checks/checkTrialStatus'

// Fonts
figma.loadFontAsync({ family: 'Inter', style: 'Regular' })
figma.loadFontAsync({ family: 'Inter', style: 'Medium' })
figma.loadFontAsync({ family: 'Martian Mono', style: 'Medium' })
figma.loadFontAsync({ family: 'Lexend', style: 'Medium' })

// Parameters
figma.parameters.on(
  'input',
  ({ parameters, key, query, result }: ParameterInputEvent) =>
    loadParameters({ parameters, key, query, result })
)

// Loader
figma.on('run', async ({ parameters }: RunEvent) => {
  if (parameters === undefined) {
    figma.on('selectionchange', () => processSelection())
    figma.on('selectionchange', async () => await checkPlanStatus())
    loadUI()
  } else {
    const selectedPreset = presets.find(
      (preset) => preset.name === parameters.preset
    )
    createPalette(
      {
        data: {
          sourceColors: figma.currentPage.selection
            .filter(
              (element) =>
                element.type !== 'GROUP' &&
                element.type !== 'EMBED' &&
                element.type !== 'CONNECTOR' &&
                element.getPluginDataKeys().length === 0 &&
                ((element as FrameNode).fills as readonly SolidPaint[]).filter(
                  (fill: Paint) => fill.type === 'SOLID'
                ).length !== 0
            )
            .map((element) => {
              return {
                name: element.name,
                rgb: ((element as FrameNode).fills as readonly SolidPaint[])[0]
                  .color,
                source: 'CANVAS',
                id: '',
                isRemovable: false,
              }
            }),
          exchange: {
            name:
              parameters.name === undefined
                ? ''
                : parameters.name.substring(0, 64),
            description: '',
            preset: presets.find((preset) => preset.name === parameters.preset),
            scale: doScale(
              selectedPreset?.stops ?? [1, 2],
              selectedPreset?.min ?? 0,
              selectedPreset?.max ?? 100,
              selectedPreset?.easing ?? 'LINEAR'
            ),
            shift: {
              chroma: 100,
            },
            areSourceColorsLocked: false,
            colorSpace: parameters.space.toUpperCase().replace(' ', '_'),
            visionSimulationMode: 'NONE',
            algorithmVersion: globalConfig.versions.algorithmVersion,
            textColorsTheme: {
              lightColor: '#FFFFFF',
              darkColor: '#000000',
            },
          } as ExchangeConfiguration,
        },
      },
      false
    )
      .then((palette) => {
        let view = 'PALETTE' as ViewConfiguration
        if (parameters.view.includes('Color')) view = 'SHEET'
        else if (parameters.view.includes('properties'))
          view = 'PALETTE_WITH_PROPERTIES'

        createDocument(palette.meta.id, view)
      })
      .then(() => figma.closePlugin())
  }
})

// Migration
if (figma.editorType !== 'dev')
  figma.on('run', async () => {
    await figma.currentPage.loadAsync()
    figma.currentPage
      .findAllWithCriteria({
        pluginData: {},
      })
      .forEach((document) => {
        const type = document.getPluginData('type')
        const version = document.getPluginData('version')

        if (
          type === 'UI_COLOR_PALETTE' &&
          version !== globalConfig.versions.paletteVersion
        )
          setPaletteMigration(document)
      })
  })
figma.on('currentpagechange', async () => {
  await figma.currentPage.loadAsync()
  figma.currentPage
    .findAllWithCriteria({
      pluginData: {},
    })
    .forEach((document) => {
      const type = document.getPluginData('type')
      const version = document.getPluginData('version')

      if (
        type === 'UI_COLOR_PALETTE' &&
        version !== globalConfig.versions.paletteVersion
      )
        setPaletteMigration(document)
    })
})
