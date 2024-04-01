import * as React from 'react'
import { createRoot } from 'react-dom/client'
import type {
  ActionsList,
  AlgorithmVersionConfiguration,
  visionSimulationModeConfiguration,
  ColorConfiguration,
  ColorSpaceConfiguration,
  DispatchProcess,
  EditorType,
  HexModel,
  Language,
  PlanStatus,
  PresetConfiguration,
  PriorityContext,
  ScaleConfiguration,
  SettingsMessage,
  SourceColorConfiguration,
  TextColorsThemeHexModel,
  ThemeConfiguration,
  TrialStatus,
  ViewConfiguration,
  ThirdParty,
  ExtractOfPaletteConfiguration,
  ExportConfiguration,
  Service,
  NamingConvention,
} from '../utils/types'
import Dispatcher from './modules/Dispatcher'
import Feature from './components/Feature'
import CreatePalette from './services/CreatePalette'
import EditPalette from './services/EditPalette'
import TransferPalette from './services/TransferPalette'
import PriorityContainer from './modules/PriorityContainer'
import Shortcuts from './modules/Shortcuts'
import { palette, presets } from '../utils/palettePackage'
import doLightnessScale from '../utils/doLightnessScale'
import features from '../utils/config'
import 'figma-plugin-ds/dist/figma-plugin-ds.css'
import './stylesheets/app.css'
import './stylesheets/app-components.css'
import { locals } from '../content/locals'

interface States {
  service: Service
  sourceColors: Array<SourceColorConfiguration>
  name: string
  description: string
  preset: PresetConfiguration
  namingConvention: NamingConvention
  scale: ScaleConfiguration
  newColors: Array<ColorConfiguration>
  colorSpace: ColorSpaceConfiguration
  visionSimulationMode: visionSimulationModeConfiguration
  themes: Array<ThemeConfiguration>
  view: ViewConfiguration
  textColorsTheme: TextColorsThemeHexModel
  algorithmVersion: AlgorithmVersionConfiguration
  export: ExportConfiguration
  palettesList: Array<ExtractOfPaletteConfiguration>
  editorType: EditorType
  planStatus: PlanStatus
  trialStatus: TrialStatus
  trialRemainingTime: number
  lang: Language
  priorityContainerContext: PriorityContext
  isLoaded: boolean
  onGoingStep: string
}

let isPaletteSelected = false
const container = document.getElementById('app'),
  root = createRoot(container)

const settingsMessage: SettingsMessage = {
  type: 'UPDATE_SETTINGS',
  data: {
    name: '',
    description: '',
    colorSpace: 'LCH',
    visionSimulationMode: 'NONE',
    textColorsTheme: {
      lightColor: '#FFFFFF',
      darkColor: '#000000',
    },
    algorithmVersion: 'v2',
  },
  isEditedInRealTime: false,
}

const defaultPreset: PresetConfiguration = {
  name: 'Material Design, 50-900 (Google)',
  scale: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
  min: 24,
  max: 96,
  isDistributed: true,
  id: 'MATERIAL',
}

class App extends React.Component<Record<string, never>, States> {
  dispatch: { [key: string]: DispatchProcess }

  constructor(props: Record<string, never>) {
    super(props)
    this.dispatch = {
      textColorsTheme: new Dispatcher(
        () => parent.postMessage({ pluginMessage: settingsMessage }, '*'),
        500
      ) as DispatchProcess,
    }
    this.state = {
      service: 'CREATE',
      sourceColors: [],
      name: '',
      description: '',
      preset:
        presets.find((preset) => preset.id === 'MATERIAL') ?? defaultPreset,
      namingConvention: 'ONES',
      scale: {},
      newColors: [],
      colorSpace: 'LCH',
      visionSimulationMode: 'NONE',
      themes: [],
      view: 'PALETTE_WITH_PROPERTIES',
      textColorsTheme: {
        lightColor: '#FFFFFF',
        darkColor: '#000000',
      },
      algorithmVersion: 'v1',
      export: {
        format: 'JSON',
        context: 'TOKENS_GLOBAL',
        label: '',
        colorSpace: 'RGB',
        mimeType: 'application/json',
        data: '',
      },
      palettesList: [],
      editorType: 'figma',
      planStatus: 'UNPAID',
      trialStatus: 'UNUSED',
      trialRemainingTime: 168,
      lang: 'en-US',
      priorityContainerContext: 'EMPTY',
      isLoaded: false,
      onGoingStep: '',
    }
  }

  componentDidMount = () =>
    setTimeout(() => this.setState({ isLoaded: true }), 1000)

  // Handlers
  colorsFromImportHandler = (
    sourceColorsFromImport: Array<SourceColorConfiguration>,
    source: ThirdParty
  ) => {
    this.setState({
      sourceColors: this.state['sourceColors']
        .filter(
          (sourceColors: SourceColorConfiguration) =>
            sourceColors.source != source
        )
        .concat(sourceColorsFromImport),
    })
  }

  presetsHandler = (e: React.SyntheticEvent) => {
    const setMaterialDesignPreset = () =>
      this.setState({
        preset:
          presets.find((preset) => preset.id === 'MATERIAL') ?? defaultPreset,
        onGoingStep: 'preset changed',
      })

    const setMaterial3Preset = () =>
      this.setState({
        preset:
          presets.find((preset) => preset.id === 'MATERIAL_3') ?? defaultPreset,
        onGoingStep: 'preset changed',
      })

    const setTailwindPreset = () =>
      this.setState({
        preset:
          presets.find((preset) => preset.id === 'TAILWIND') ?? defaultPreset,
        onGoingStep: 'preset changed',
      })

    const setAntDesignPreset = () =>
      this.setState({
        preset: presets.find((preset) => preset.id === 'ANT') ?? defaultPreset,
        onGoingStep: 'preset changed',
      })

    const setAdsPreset = () =>
      this.setState({
        preset: presets.find((preset) => preset.id === 'ADS') ?? defaultPreset,
        onGoingStep: 'preset changed',
      })

    const setAdsNeutralPreset = () =>
      this.setState({
        preset:
          presets.find((preset) => preset.id === 'ADS_NEUTRAL') ??
          defaultPreset,
        onGoingStep: 'preset changed',
      })

    const setCarbonPreset = () =>
      this.setState({
        preset:
          presets.find((preset) => preset.id === 'CARBON') ?? defaultPreset,
        onGoingStep: 'preset changed',
      })

    const setBasePreset = () =>
      this.setState({
        preset: presets.find((preset) => preset.id === 'BASE') ?? defaultPreset,
        onGoingStep: 'preset changed',
      })

    const setCustomPreset = () => {
      const customPreset = presets.find((preset) => preset.id === 'CUSTOM')
      if (customPreset != undefined) customPreset.scale = [1, 2]
      this.setState({
        preset: customPreset ?? defaultPreset,
        onGoingStep: 'preset changed',
      })
    }

    const actions: ActionsList = {
      MATERIAL: () => setMaterialDesignPreset(),
      MATERIAL_3: () => setMaterial3Preset(),
      TAILWIND: () => setTailwindPreset(),
      ANT: () => setAntDesignPreset(),
      ADS: () => setAdsPreset(),
      ADS_NEUTRAL: () => setAdsNeutralPreset(),
      CARBON: () => setCarbonPreset(),
      BASE: () => setBasePreset(),
      CUSTOM: () => setCustomPreset(),
      NULL: () => null,
    }

    return actions[(e.target as HTMLElement).dataset.value ?? 'NULL']?.()
  }

  customHandler = (e: React.SyntheticEvent) => {
    const scale = this.state['preset']?.['scale'] ?? [1, 2]

    const addStop = () => {
      if (scale.length < 24) {
        scale.push(scale.slice(-1)[0] + scale[0])
        this.setState({
          preset: {
            name: presets.find((preset) => preset.id === 'CUSTOM')?.name ?? '',
            scale: scale,
            min: palette.min ?? 0,
            max: palette.max ?? 100,
            isDistributed: true,
            id: 'CUSTOM',
          },
        })
      }
    }

    const removeStop = () => {
      if (scale.length > 2) {
        scale.pop()
        this.setState({
          preset: {
            name: presets.find((preset) => preset.id === 'CUSTOM')?.name ?? '',
            scale: scale,
            min: palette.min ?? 0,
            max: palette.max ?? 100,
            isDistributed: true,
            id: 'CUSTOM',
          },
        })
      }
    }

    const changeNamingConvention = () => {
      const option = (e.target as HTMLInputElement).dataset
        .value as NamingConvention
      this.setState({
        namingConvention: option,
        preset: {
          name: presets.find((preset) => preset.id === 'CUSTOM')?.name ?? '',
          scale: scale.map((stop, index) => {
            if (option === 'TENS') return (index + 1) * 10
            else if (option === 'HUNDREDS') return (index + 1) * 100
            return (index + 1) * 1
          }),
          min: palette.min ?? 0,
          max: palette.max ?? 100,
          isDistributed: true,
          id: 'CUSTOM',
        },
      })
    }

    const actions: ActionsList = {
      ADD_STOP: () => addStop(),
      REMOVE_STOP: () => removeStop(),
      UPDATE_NAMING_CONVENTION: () => changeNamingConvention(),
      NULL: () => null,
    }

    return actions[(e.target as HTMLInputElement).dataset.feature ?? 'NULL']?.()
  }

  slideHandler = () =>
    this.setState({
      scale: palette.scale,
      themes: this.state['themes'].map((theme: ThemeConfiguration) => {
        if (theme.isEnabled) theme.scale = palette.scale
        return theme
      }),
      onGoingStep: 'scale changed',
    })

  customSlideHandler = () =>
    this.setState({
      preset:
        Object.keys(palette.preset).length == 0
          ? this.state['preset']
          : palette.preset,
      scale: palette.scale,
      themes: this.state['themes'].map((theme: ThemeConfiguration) => {
        if (theme.isEnabled) theme.scale = palette.scale
        else
          theme.scale = doLightnessScale(
            Object.keys(palette.scale).map((stop) => {
              return parseFloat(stop.replace('lightness-', ''))
            }),
            theme.scale[
              Object.keys(theme.scale)[Object.keys(theme.scale).length - 1]
            ],
            theme.scale[Object.keys(theme.scale)[0]]
          )
        return theme
      }),
      onGoingStep: 'stops changed',
    })

  colorsHandler = (colors: Array<ColorConfiguration>) =>
    this.setState({
      newColors: colors,
      onGoingStep: 'colors changed',
    })

  themesHandler = (themes: Array<ThemeConfiguration>) =>
    this.setState({
      scale: themes.find((theme) => theme.isEnabled)?.scale ?? {},
      themes: themes,
      onGoingStep: 'themes changed',
    })

  settingsHandler = (e: any) => {
    const renamePalette = () => {
      palette.name = e.target.value
      settingsMessage.data.name = e.target.value
      settingsMessage.data.description = this.state['description']
      settingsMessage.data.colorSpace = this.state['colorSpace']
      settingsMessage.data.visionSimulationMode =
        this.state['visionSimulationMode']
      settingsMessage.data.textColorsTheme = this.state['textColorsTheme']
      settingsMessage.data.algorithmVersion = this.state['algorithmVersion']

      this.setState({
        name: settingsMessage.data.name,
        onGoingStep: 'settings changed',
      })

      if (e._reactName === 'onBlur' && this.state['service'] === 'EDIT')
        parent.postMessage({ pluginMessage: settingsMessage }, '*')
      else if (e.key === 'Enter' && this.state['service'] === 'EDIT')
        parent.postMessage({ pluginMessage: settingsMessage }, '*')
    }

    const updateDescription = () => {
      palette.description = e.target.value
      settingsMessage.data.name = this.state['name']
      settingsMessage.data.description = e.target.value
      settingsMessage.data.colorSpace = this.state['colorSpace']
      settingsMessage.data.visionSimulationMode =
        this.state['visionSimulationMode']
      settingsMessage.data.textColorsTheme = this.state['textColorsTheme']
      settingsMessage.data.algorithmVersion = this.state['algorithmVersion']

      this.setState({
        description: settingsMessage.data.description,
        onGoingStep: 'settings changed',
      })

      if (e._reactName === 'onBlur' && this.state['service'] === 'EDIT')
        parent.postMessage({ pluginMessage: settingsMessage }, '*')
    }

    const updateView = () => {
      if (e.target.dataset.isBlocked === 'false') {
        palette.view = e.target.dataset.value
        this.setState({
          view: e.target.dataset.value,
          onGoingStep: 'view changed',
        })
        if (this.state['service'] === 'EDIT')
          parent.postMessage(
            { pluginMessage: { type: 'UPDATE_VIEW', data: palette } },
            '*'
          )
      }
    }

    const updateColorSpace = () => {
      palette.colorSpace = e.target.dataset.value
      settingsMessage.data.name = this.state['name']
      settingsMessage.data.description = this.state['description']
      settingsMessage.data.colorSpace = e.target.dataset.value
      settingsMessage.data.visionSimulationMode =
        this.state['visionSimulationMode']
      settingsMessage.data.textColorsTheme = this.state['textColorsTheme']
      settingsMessage.data.algorithmVersion = this.state['algorithmVersion']

      this.setState({
        colorSpace: settingsMessage.data.colorSpace,
        onGoingStep: 'settings changed',
      })

      if (this.state['service'] === 'EDIT')
        parent.postMessage({ pluginMessage: settingsMessage }, '*')
    }

    const updatevisionSimulationMode = () => {
      palette.visionSimulationMode = e.target.dataset.value
      settingsMessage.data.name = this.state['name']
      settingsMessage.data.description = this.state['description']
      settingsMessage.data.colorSpace = this.state['colorSpace']
      settingsMessage.data.visionSimulationMode = e.target.dataset.value
      settingsMessage.data.textColorsTheme = this.state['textColorsTheme']
      settingsMessage.data.algorithmVersion = this.state['algorithmVersion']

      this.setState({
        visionSimulationMode: settingsMessage.data.visionSimulationMode,
        onGoingStep: 'settings changed',
      })

      if (this.state['service'] === 'EDIT')
        parent.postMessage({ pluginMessage: settingsMessage }, '*')
    }

    const updateAlgorythmVersion = () => {
      settingsMessage.data.name = this.state['name']
      settingsMessage.data.description = this.state['description']
      settingsMessage.data.colorSpace = this.state['colorSpace']
      settingsMessage.data.visionSimulationMode =
        this.state['visionSimulationMode']
      settingsMessage.data.textColorsTheme = this.state['textColorsTheme']
      settingsMessage.data.algorithmVersion = !e.target.checked ? 'v1' : 'v2'

      this.setState({
        algorithmVersion: settingsMessage.data.algorithmVersion,
        onGoingStep: 'settings changed',
      })

      parent.postMessage({ pluginMessage: settingsMessage }, '*')
    }

    const updateTextLightColor = () => {
      const code: HexModel =
        e.target.value.indexOf('#') == -1
          ? '#' + e.target.value
          : e.target.value
      if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(code)) {
        settingsMessage.data.name = this.state['name']
        settingsMessage.data.description = this.state['description']
        settingsMessage.data.colorSpace = this.state['colorSpace']
        settingsMessage.data.visionSimulationMode =
          this.state['visionSimulationMode']
        settingsMessage.data.textColorsTheme.lightColor = code
        palette.textColorsTheme.lightColor = code
        settingsMessage.data.textColorsTheme.darkColor =
          this.state['textColorsTheme'].darkColor
        settingsMessage.data.algorithmVersion = this.state['algorithmVersion']

        this.setState({
          textColorsTheme: settingsMessage.data.textColorsTheme,
          onGoingStep: 'settings changed',
        })
      }
      if (e._reactName === 'onBlur' && this.state['service'] === 'EDIT') {
        this.dispatch.textColorsTheme.on.status = false
        parent.postMessage({ pluginMessage: settingsMessage }, '*')
      } else if (this.state['service'] === 'EDIT')
        this.dispatch.textColorsTheme.on.status = true
    }

    const updateTextDarkColor = () => {
      const code: HexModel =
        e.target.value.indexOf('#') == -1
          ? '#' + e.target.value
          : e.target.value
      if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(code)) {
        settingsMessage.data.name = this.state['name']
        settingsMessage.data.description = this.state['description']
        settingsMessage.data.colorSpace = this.state['colorSpace']
        settingsMessage.data.visionSimulationMode =
          this.state['visionSimulationMode']
        settingsMessage.data.textColorsTheme.lightColor =
          this.state['textColorsTheme'].lightColor
        settingsMessage.data.textColorsTheme.darkColor = code
        palette.textColorsTheme.darkColor = code
        settingsMessage.data.algorithmVersion = this.state['algorithmVersion']

        this.setState({
          textColorsTheme: settingsMessage.data.textColorsTheme,
          onGoingStep: 'settings changed',
        })
      }
      if (e._reactName === 'onBlur' && this.state['service'] === 'EDIT') {
        this.dispatch.textColorsTheme.on.status = false
        parent.postMessage({ pluginMessage: settingsMessage }, '*')
      } else if (this.state['service'] === 'EDIT')
        this.dispatch.textColorsTheme.on.status = true
    }

    const actions: ActionsList = {
      RENAME_PALETTE: () => renamePalette(),
      UPDATE_DESCRIPTION: () => updateDescription(),
      UPDATE_VIEW: () => updateView(),
      UPDATE_COLOR_SPACE: () => updateColorSpace(),
      UPDATE_COLOR_BLIND_MODE: () => updatevisionSimulationMode(),
      UPDATE_ALGORITHM_VERSION: () => updateAlgorythmVersion(),
      CHANGE_TEXT_LIGHT_COLOR: () => updateTextLightColor(),
      CHANGE_TEXT_DARK_COLOR: () => updateTextDarkColor(),
    }

    return actions[e.target.dataset.feature]?.()
  }

  // Render
  render() {
    onmessage = (e: MessageEvent) => {
      try {
        const checkEditorType = () =>
          this.setState({ editorType: e.data.pluginMessage.data })

        const checkHighlightStatus = () =>
          this.setState({
            priorityContainerContext:
              e.data.pluginMessage.data === 'NO_RELEASE_NOTE' ||
              e.data.pluginMessage.data === 'READ_RELEASE_NOTE'
                ? 'EMPTY'
                : 'HIGHLIGHT',
          })

        const checkPlanStatus = () =>
          this.setState({
            planStatus: e.data.pluginMessage.data.planStatus,
            trialStatus: e.data.pluginMessage.data.trialStatus,
            trialRemainingTime: e.data.pluginMessage.data.trialRemainingTime,
          })

        const updateWhileEmptySelection = () => {
          this.setState({
            service: 'CREATE',
            sourceColors: this.state['sourceColors'].filter(
              (sourceColor: SourceColorConfiguration) =>
                sourceColor.source != 'CANVAS'
            ),
            name: '',
            description: '',
            preset:
              presets.find((preset) => preset.id === 'MATERIAL') ??
              defaultPreset,
            namingConvention: 'ONES',
            colorSpace: 'LCH',
            visionSimulationMode: 'NONE',
            view: 'PALETTE_WITH_PROPERTIES',
            textColorsTheme: {
              lightColor: '#FFFFFF',
              darkColor: '#000000',
            },
            onGoingStep: 'selection empty',
          })
          palette.name = ''
          palette.description = ''
          palette.preset = defaultPreset
          palette.colorSpace = 'LCH'
          palette.visionSimulationMode = 'NONE'
          palette.view = 'PALETTE_WITH_PROPERTIES'
          palette.textColorsTheme = {
            lightColor: '#FFFFFF',
            darkColor: '#000000',
          }
          isPaletteSelected = false
        }

        const updateWhileColorSelected = () => {
          if (isPaletteSelected) {
            this.setState({
              name: '',
              description: '',
              preset:
                presets.find((preset) => preset.id === 'MATERIAL') ??
                defaultPreset,
              namingConvention: 'ONES',
              colorSpace: 'LCH',
              visionSimulationMode: 'NONE',
              view: 'PALETTE_WITH_PROPERTIES',
              textColorsTheme: {
                lightColor: '#FFFFFF',
                darkColor: '#000000',
              },
            })
            palette.name = ''
            palette.description = ''
            palette.preset =
              presets.find((preset) => preset.id === 'MATERIAL') ??
              defaultPreset
            palette.colorSpace = 'LCH'
            palette.visionSimulationMode = 'NONE'
            palette.view = 'PALETTE_WITH_PROPERTIES'
            palette.textColorsTheme = {
              lightColor: '#FFFFFF',
              darkColor: '#000000',
            }
          }
          this.setState({
            service: 'CREATE',
            sourceColors: this.state['sourceColors']
              .filter(
                (sourceColor: SourceColorConfiguration) =>
                  sourceColor.source != 'CANVAS'
              )
              .concat(e.data.pluginMessage.data),
            onGoingStep: 'colors selected',
          })
          isPaletteSelected = false
        }

        const updateWhilePaletteSelected = () => {
          isPaletteSelected = true
          palette.preset = e.data.pluginMessage.data.preset
          parent.postMessage(
            {
              pluginMessage: {
                type: 'EXPORT_PALETTE',
                export: this.state['export'].context,
                colorSpace: this.state['export'].colorSpace,
              },
            },
            '*'
          )
          this.setState({
            service:
              e.data.pluginMessage.data.editorType != 'dev'
                ? 'EDIT'
                : 'TRANSFER',
            sourceColors: [],
            name: e.data.pluginMessage.data.name,
            description: e.data.pluginMessage.data.description,
            preset: e.data.pluginMessage.data.preset,
            scale: e.data.pluginMessage.data.scale,
            newColors: e.data.pluginMessage.data.colors,
            colorSpace: e.data.pluginMessage.data.colorSpace,
            visionSimulationMode:
              e.data.pluginMessage.data.visionSimulationMode,
            themes: e.data.pluginMessage.data.themes,
            view: e.data.pluginMessage.data.view,
            textColorsTheme: e.data.pluginMessage.data.textColorsTheme,
            algorithmVersion: e.data.pluginMessage.data.algorithmVersion,
            onGoingStep: 'palette selected',
          })
        }

        const exportPaletteToJson = () =>
          this.setState({
            export: {
              format: 'JSON',
              context: e.data.pluginMessage.context,
              label: `${locals[this.state['lang']].actions.export} ${
                locals[this.state['lang']].export.tokens.label
              }`,
              colorSpace: 'RGB',
              mimeType: 'application/json',
              data: JSON.stringify(e.data.pluginMessage.data, null, '  '),
            },
            onGoingStep: 'export previewed',
          })

        const exportPaletteToCss = () =>
          this.setState({
            export: {
              format: 'CSS',
              colorSpace: e.data.pluginMessage.colorSpace,
              context: e.data.pluginMessage.context,
              label: `${locals[this.state['lang']].actions.export} ${
                locals[this.state['lang']].export.css.customProperties
              }`,
              mimeType: 'text/css',
              data: `:root {\n  ${e.data.pluginMessage.data.join('\n  ')}\n}`,
            },
            onGoingStep: 'export previewed',
          })

        const exportPaletteToTaiwind = () =>
          this.setState({
            export: {
              format: 'TAILWIND',
              context: e.data.pluginMessage.context,
              label: `${locals[this.state['lang']].actions.export} ${
                locals[this.state['lang']].export.tailwind.config
              }`,
              colorSpace: 'HEX',
              mimeType: 'text/javascript',
              data: `/** @type {import('tailwindcss').Config} */\nmodule.exports = ${JSON.stringify(
                e.data.pluginMessage.data,
                null,
                '  '
              )}`,
            },
            onGoingStep: 'export previewed',
          })

        const exportPaletteToSwiftUI = () =>
          this.setState({
            export: {
              format: 'SWIFT',
              context: e.data.pluginMessage.context,
              label: `${locals[this.state['lang']].actions.export} ${
                locals[this.state['lang']].export.apple.swiftui
              }`,
              colorSpace: 'HEX',
              mimeType: 'text/swift',
              data: `import SwiftUI\n\npublic extension Color {\n  static let Token = Color.TokenColor()\n  struct TokenColor {\n    ${e.data.pluginMessage.data.join(
                '\n    '
              )}\n  }\n}`,
            },
            onGoingStep: 'export previewed',
          })

        const exportPaletteToUIKit = () =>
          this.setState({
            export: {
              format: 'SWIFT',
              context: e.data.pluginMessage.context,
              label: `${locals[this.state['lang']].actions.export} ${
                locals[this.state['lang']].export.apple.uikit
              }`,
              colorSpace: 'HEX',
              mimeType: 'text/swift',
              data: `import UIKit\n\nstruct Color {\n  ${e.data.pluginMessage.data.join(
                '\n\n  '
              )}\n}`,
            },
            onGoingStep: 'export previewed',
          })

        const exportPaletteToKt = () =>
          this.setState({
            export: {
              format: 'KT',
              context: e.data.pluginMessage.context,
              label: `${locals[this.state['lang']].actions.export} ${
                locals[this.state['lang']].export.android.compose
              }`,
              colorSpace: 'HEX',
              mimeType: 'text/x-kotlin',
              data: `import androidx.compose.ui.graphics.Color\n\n${e.data.pluginMessage.data.join(
                '\n'
              )}`,
            },
            onGoingStep: 'export previewed',
          })

        const exportPaletteToXml = () =>
          this.setState({
            export: {
              format: 'XML',
              context: e.data.pluginMessage.context,
              label: `${locals[this.state['lang']].actions.export} ${
                locals[this.state['lang']].export.android.resources
              }`,
              colorSpace: 'HEX',
              mimeType: 'text/xml',
              data: `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n  ${e.data.pluginMessage.data.join(
                '\n  '
              )}\n</resources>`,
            },
            onGoingStep: 'export previewed',
          })

        const exportPaletteToCsv = () =>
          this.setState({
            export: {
              format: 'CSV',
              context: e.data.pluginMessage.context,
              label: `${locals[this.state['lang']].actions.export} ${
                locals[this.state['lang']].export.csv.spreadsheet
              }`,
              colorSpace: 'HEX',
              mimeType: 'text/csv',
              data: e.data.pluginMessage.data,
            },
            onGoingStep: 'export previewed',
          })

        const exposePalettes = (data: Array<ExtractOfPaletteConfiguration>) =>
          this.setState({
            palettesList: data,
          })

        const getProPlan = () =>
          this.setState({
            planStatus: e.data.pluginMessage.data,
            priorityContainerContext: 'WELCOME_TO_PRO',
          })

        const enableTrial = () =>
          this.setState({
            planStatus: 'PAID',
            trialStatus: 'PENDING',
            priorityContainerContext: 'WELCOME_TO_TRIAL',
          })

        const actions: ActionsList = {
          EDITOR_TYPE: () => checkEditorType(),
          HIGHLIGHT_STATUS: () => checkHighlightStatus(),
          PLAN_STATUS: () => checkPlanStatus(),
          EMPTY_SELECTION: () => updateWhileEmptySelection(),
          COLOR_SELECTED: () => updateWhileColorSelected(),
          PALETTE_SELECTED: () => updateWhilePaletteSelected(),
          EXPORT_PALETTE_JSON: () => exportPaletteToJson(),
          EXPORT_PALETTE_CSS: () => exportPaletteToCss(),
          EXPORT_PALETTE_TAILWIND: () => exportPaletteToTaiwind(),
          EXPORT_PALETTE_SWIFTUI: () => exportPaletteToSwiftUI(),
          EXPORT_PALETTE_UIKIT: () => exportPaletteToUIKit(),
          EXPORT_PALETTE_KT: () => exportPaletteToKt(),
          EXPORT_PALETTE_XML: () => exportPaletteToXml(),
          EXPORT_PALETTE_CSV: () => exportPaletteToCsv(),
          EXPOSE_PALETTES: () => exposePalettes(e.data.pluginMessage?.data),
          GET_PRO_PLAN: () => getProPlan(),
          ENABLE_TRIAL: () => enableTrial(),
          DEFAULT: () => null,
        }

        return actions[e.data.pluginMessage?.type ?? 'DEFAULT']?.()
      } catch (error) {
        console.error(error)
      }
    }

    if (this.state['isLoaded'])
      return (
        <main className="ui">
          <Feature
            isActive={
              features.find((feature) => feature.name === 'CREATE')?.isActive &&
              this.state['editorType'] != 'dev' &&
              this.state['service'] === 'CREATE'
            }
          >
            <CreatePalette
              sourceColors={this.state['sourceColors']}
              name={this.state['name']}
              description={this.state['description']}
              preset={this.state['preset']}
              namingConvention={this.state['namingConvention']}
              colorSpace={this.state['colorSpace']}
              visionSimulationMode={this.state['visionSimulationMode']}
              view={this.state['view']}
              textColorsTheme={this.state['textColorsTheme']}
              planStatus={this.state['planStatus']}
              lang={this.state['lang']}
              onChangeColorsFromImport={this.colorsFromImportHandler}
              onChangePreset={this.presetsHandler}
              onCustomPreset={this.customHandler}
              onChangeSettings={this.settingsHandler}
            />
          </Feature>
          <Feature
            isActive={
              features.find((feature) => feature.name === 'EDIT')?.isActive &&
              this.state['editorType'] != 'dev' &&
              this.state['service'] === 'EDIT'
            }
          >
            <EditPalette
              name={this.state['name']}
              description={this.state['description']}
              preset={this.state['preset']}
              scale={this.state['scale']}
              colors={this.state['newColors']}
              colorSpace={this.state['colorSpace']}
              visionSimulationMode={this.state['visionSimulationMode']}
              themes={this.state['themes']}
              view={this.state['view']}
              textColorsTheme={this.state['textColorsTheme']}
              algorithmVersion={this.state['algorithmVersion']}
              export={this.state['export']}
              editorType={this.state['editorType']}
              planStatus={this.state['planStatus']}
              lang={this.state['lang']}
              onChangeScale={this.slideHandler}
              onChangeStop={this.customSlideHandler}
              onChangeColors={this.colorsHandler}
              onChangeThemes={this.themesHandler}
              onChangeSettings={this.settingsHandler}
            />
          </Feature>
          <Feature
            isActive={
              features.find((feature) => feature.name === 'TRANSFER')
                ?.isActive && this.state['editorType'] === 'dev'
            }
          >
            <TransferPalette
              name={this.state['name']}
              description={this.state['description']}
              preset={this.state['preset']}
              scale={this.state['scale']}
              colors={this.state['newColors']}
              colorSpace={this.state['colorSpace']}
              visionSimulationMode={this.state['visionSimulationMode']}
              themes={this.state['themes']}
              view={this.state['view']}
              textColorsTheme={this.state['textColorsTheme']}
              algorithmVersion={this.state['algorithmVersion']}
              export={this.state['export']}
              palettesList={this.state['palettesList']}
              service={this.state['service']}
              editorType={this.state['editorType']}
              planStatus={this.state['planStatus']}
              lang={this.state['lang']}
            />
          </Feature>
          <PriorityContainer
            context={this.state['priorityContainerContext']}
            planStatus={this.state['planStatus']}
            trialStatus={this.state['trialStatus']}
            lang={this.state['lang']}
            onClose={() => this.setState({ priorityContainerContext: 'EMPTY' })}
          />
          <Feature
            isActive={
              features.find((feature) => feature.name === 'SHORTCUTS')?.isActive
            }
          >
            <Shortcuts
              editorType={this.state['editorType']}
              planStatus={this.state['planStatus']}
              trialStatus={this.state['trialStatus']}
              trialRemainingTime={this.state['trialRemainingTime']}
              lang={this.state['lang']}
              onReOpenFeedback={() =>
                this.setState({ priorityContainerContext: 'FEEDBACK' })
              }
              onReOpenTrialFeedback={() =>
                this.setState({ priorityContainerContext: 'TRIAL_FEEDBACK' })
              }
              onReOpenHighlight={() =>
                this.setState({ priorityContainerContext: 'HIGHLIGHT' })
              }
              onReOpenAbout={() =>
                this.setState({ priorityContainerContext: 'ABOUT' })
              }
              onGetProPlan={() => {
                if (this.state['trialStatus'] === 'EXPIRED')
                  parent.postMessage(
                    { pluginMessage: { type: 'GET_PRO_PLAN' } },
                    '*'
                  )
                else this.setState({ priorityContainerContext: 'TRY' })
              }}
            />
          </Feature>
        </main>
      )
  }
}

root.render(<App />)
