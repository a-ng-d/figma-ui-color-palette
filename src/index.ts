import { doScale } from '@unoff/utils'
import { presets } from '@ui-lib/stores/presets'
import zh_Hans_CN from '@ui-lib/content/translations/zh-Hans-CN.json'
import pt_BR from '@ui-lib/content/translations/pt-BR.json'
import ko_KR from '@ui-lib/content/translations/ko-KR.json'
import ja_JP from '@ui-lib/content/translations/ja-JP.json'
import fr_FR from '@ui-lib/content/translations/fr-FR.json'
import es_ES from '@ui-lib/content/translations/es-ES.json'
import en_US from '@ui-lib/content/translations/en-US.json'
import {
  ExchangeConfiguration,
  ViewConfiguration,
} from '@a_ng_d/utils-ui-color-palette'
import setPaletteMigration from './utils/setPaletteMigration'
import { createI18n } from './utils/i18n'
import globalConfig from './global.config'
import loadUI from './bridges/loadUI'
import loadParameters from './bridges/loadParameters'
import processSelection from './bridges/gets/processSelection'
import createPalette from './bridges/creations/createPalette'
import createDocument from './bridges/creations/createDocument'
import checkTrialStatus from './bridges/checks/checkTrialStatus'

declare const __PLUGIN__: 'fig' | 'one'

// Fonts
figma.loadFontAsync({ family: 'Inter', style: 'Regular' })
figma.loadFontAsync({ family: 'Inter', style: 'Medium' })
figma.loadFontAsync({ family: 'Martian Mono', style: 'Medium' })
figma.loadFontAsync({ family: 'Lexend', style: 'Medium' })

// Locales
export let tolgee: ReturnType<typeof createI18n>

// Parameters
figma.parameters.on(
  'input',
  ({ parameters, key, query, result }: ParameterInputEvent) =>
    loadParameters({ parameters, key, query, result })
)

// Loader
figma.on('run', async ({ parameters }: RunEvent) => {
  tolgee = createI18n(
    {
      'zh-Hans-CN': zh_Hans_CN,
      'pt-BR': pt_BR,
      'fr-FR': fr_FR,
      'en-US': en_US,
      'es-ES': es_ES,
      'ja-JP': ja_JP,
      'ko-KR': ko_KR,
    },
    globalConfig.lang
  )

  if (parameters === undefined) {
    figma.on('selectionchange', () => processSelection())
    figma.on(
      'selectionchange',
      async () => await checkTrialStatus({ context: 'UI', plugin: __PLUGIN__ })
    )
    loadUI().then(() => setTimeout(() => processSelection(), 3000))
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
                element.getSharedPluginDataKeys('uicp').length === 0 &&
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
          version !== globalConfig.versions.paletteVersion &&
          __PLUGIN__ === 'fig'
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
        version !== globalConfig.versions.paletteVersion &&
        __PLUGIN__ === 'fig'
      )
        setPaletteMigration(document)
    })
})
