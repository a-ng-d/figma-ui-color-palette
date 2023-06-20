import * as React from 'react'
import { createRoot } from 'react-dom/client'
import type {
  ActionsList,
  ColorConfiguration,
  DispatchProcess,
  SettingsMessage,
} from '../utils/types'
import Dispatcher from './modules/Dispatcher'
import Feature from './components/Feature'
import Onboarding from './services/Onboarding'
import CreatePalette from './services/CreatePalette'
import EditPalette from './services/EditPalette'
import Highlight from './modules/Highlight'
import package_json from './../../package.json'
import { palette, presets } from '../utils/palettePackage'
import features from '../utils/features'
import { v4 as uuidv4 } from 'uuid'
import 'figma-plugin-ds/dist/figma-plugin-ds.css'
import './stylesheets/app.css'
import './stylesheets/components.css'
import Dialog from './modules/Dialog'

let isPaletteSelected = false
const container = document.getElementById('react-page'),
  root = createRoot(container)

const settingsMessage: SettingsMessage = {
  type: 'UPDATE_SETTINGS',
  data: {
    name: '',
    textColorsTheme: {
      lightColor: '',
      darkColor: '',
    },
    algorithmVersion: '',
  },
  isEditedInRealTime: false,
}

class App extends React.Component {
  dispatch: { [key: string]: DispatchProcess }

  constructor(props) {
    super(props)
    this.dispatch = {
      textColorsTheme: new Dispatcher(
        () => parent.postMessage({ pluginMessage: settingsMessage }, '*'),
        500
      ),
    }
    this.state = {
      service: 'None',
      paletteName: '',
      preset: presets.material,
      newScale: {},
      newColors: {},
      view: 'PALETTE_WITH_PROPERTIES',
      textColorsTheme: {
        lightColor: '#FFFFFF',
        darkColor: '#000000',
      },
      algorithmVersion: 'v1',
      export: {
        format: '',
        mimeType: '',
        data: '',
      },
      editorType: 'figma',
      hasHighlight: false,
      planStatus: 'UNPAID',
      hasGetProPlanDialog: false,
      onGoingStep: '',
    }
  }

  // Handlers
  presetHandler = (e: React.SyntheticEvent) => {
    const setMaterialDesignPreset = () =>
      this.setState({
        preset: presets.material,
        onGoingStep: 'preset changed',
      })

    const setAntDesignPreset = () =>
      this.setState({
        preset: presets.ant,
        onGoingStep: 'preset changed',
      })

    const setAdsPreset = () =>
      this.setState({
        preset: presets.atlassian,
        onGoingStep: 'preset changed',
      })

    const setAdsNeutralPreset = () =>
      this.setState({
        preset: presets.atlassianNeutral,
        onGoingStep: 'preset changed',
      })

    const setCarbonPreset = () =>
      this.setState({
        preset: presets.carbon,
        onGoingStep: 'preset changed',
      })

    const setBasePreset = () =>
      this.setState({
        preset: presets.base,
        onGoingStep: 'preset changed',
      })

    const setCustomPreset = () => {
      presets.custom.scale = [1, 2]
      this.setState({
        preset: presets.custom,
        onGoingStep: 'preset changed',
      })
    }

    const actions: ActionsList = {
      MATERIAL: () => setMaterialDesignPreset(),
      ANT: () => setAntDesignPreset(),
      ADS: () => setAdsPreset(),
      ADS_NEUTRAL: () => setAdsNeutralPreset(),
      CARBON: () => setCarbonPreset(),
      BASE: () => setBasePreset(),
      CUSTOM: () => setCustomPreset(),
    }

    return actions[(e.target as HTMLElement).dataset.value]?.()
  }

  customHandler = (e: React.SyntheticEvent) => {
    const scale = this.state['preset']['scale']

    const addStop = () => {
      if (scale.length < 24) {
        scale.push(scale.length + 1)
        this.setState({
          preset: {
            name: presets.custom.name,
            scale: scale,
            min: palette.min,
            max: palette.max,
            id: presets.custom.id,
          },
        })
      }
    }

    const removeStop = () => {
      if (scale.length > 2) {
        scale.pop()
        this.setState({
          preset: {
            name: presets.custom.name,
            scale: scale,
            min: palette.min,
            max: palette.max,
            id: presets.custom.id,
          },
        })
      }
    }

    const actions: ActionsList = {
      ADD: () => addStop(),
      REMOVE: () => removeStop(),
    }

    return actions[(e.target as HTMLInputElement).dataset.feature]?.()
  }

  slideHandler = () =>
    this.setState({
      newScale: palette.scale,
      onGoingStep: 'scale changed',
    })

  customSlideHandler = () =>
    this.setState({
      preset:
        Object.keys(palette.preset).length == 0
          ? this.state['preset']
          : palette.preset,
      newScale: palette.scale,
      onGoingStep: 'stop changed',
    })

  colorHandler = (colors: Array<ColorConfiguration>) =>
    this.setState({
      newColors: colors,
      onGoingStep: 'color changed',
    })

  settingsHandler = (e) => {
    const renamePalette = () => {
      palette.name = e.target.value
      settingsMessage.data.name = e.target.value
      settingsMessage.data.algorithmVersion = this.state['algorithmVersion']
      settingsMessage.data.textColorsTheme = this.state['textColorsTheme']
      this.setState({
        paletteName: settingsMessage.data.name,
        onGoingStep: 'settings changed',
      })
      if (e._reactName === 'onBlur' && this.state['service'] === 'Edit')
        parent.postMessage({ pluginMessage: settingsMessage }, '*')
      else if (e.key === 'Enter' && this.state['service'] === 'Edit')
        parent.postMessage({ pluginMessage: settingsMessage }, '*')
    }

    const updateTextLightColor = () => {
      const code: string =
        e.target.value.indexOf('#') == -1
          ? '#' + e.target.value
          : e.target.value
      if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(code)) {
        palette.textColorsTheme.lightColor = code
        settingsMessage.data.name = this.state['paletteName']
        settingsMessage.data.algorithmVersion = this.state['algorithmVersion']
        settingsMessage.data.textColorsTheme.lightColor =
          palette.textColorsTheme.lightColor
        settingsMessage.data.textColorsTheme.darkColor =
          this.state['textColorsTheme'].darkColor
        this.setState({
          textColorsTheme: settingsMessage.data.textColorsTheme,
          onGoingStep: 'settings changed',
        })
      }
      if (e._reactName === 'onBlur' && this.state['service'] === 'Edit') {
        this.dispatch.textColorsTheme.on.status = false
        parent.postMessage({ pluginMessage: settingsMessage }, '*')
      } else if (this.state['service'] === 'Edit')
        this.dispatch.textColorsTheme.on.status = true
    }

    const updateTextDarkColor = () => {
      const code: string =
        e.target.value.indexOf('#') == -1
          ? '#' + e.target.value
          : e.target.value
      settingsMessage.data.name = this.state['paletteName']
      settingsMessage.data.algorithmVersion = this.state['algorithmVersion']
      settingsMessage.data.textColorsTheme.lightColor =
        this.state['textColorsTheme'].lightColor
      settingsMessage.data.textColorsTheme.darkColor = code
      if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(code)) {
        palette.textColorsTheme.darkColor = code
        this.setState({
          textColorsTheme: settingsMessage.data.textColorsTheme,
          onGoingStep: 'settings changed',
        })
      }
      if (e._reactName === 'onBlur' && this.state['service'] === 'Edit') {
        this.dispatch.textColorsTheme.on.status = false
        parent.postMessage({ pluginMessage: settingsMessage }, '*')
      } else if (this.state['service'] === 'Edit')
        this.dispatch.textColorsTheme.on.status = true
    }

    const updateAlgorythmVersion = () => {
      settingsMessage.data.name = this.state['paletteName']
      settingsMessage.data.algorithmVersion = !e.target.checked ? 'v1' : 'v2'
      settingsMessage.data.textColorsTheme = this.state['textColorsTheme']
      this.setState({
        algorithmVersion: settingsMessage.data.algorithmVersion,
        onGoingStep: 'settings changed',
      })
      parent.postMessage({ pluginMessage: settingsMessage }, '*')
    }

    const actions: ActionsList = {
      RENAME_PALETTE: () => renamePalette(),
      CHANGE_TEXT_LIGHT_COLOR: () => updateTextLightColor(),
      CHANGE_TEXT_DARK_COLOR: () => updateTextDarkColor(),
      UPDATE_ALGORITHM_VERSION: () => updateAlgorythmVersion(),
    }

    return actions[e.target.dataset.feature]?.()
  }

  viewHandler = (view: string) =>
    this.setState({ view: view, onGoingStep: 'view changed' })

  highlightHandler = (action: string) => {
    const openHighlight = () => this.setState({ hasHighlight: true })

    const closeHighlight = () => {
      parent.postMessage(
        {
          pluginMessage: {
            type: 'CLOSE_HIGHLIGHT',
            data: {
              version: package_json.version,
              isRead: true,
            },
          },
        },
        '*'
      )
      this.setState({ hasHighlight: false })
    }

    const actions = {
      OPEN: () => openHighlight(),
      CLOSE: () => closeHighlight(),
    }

    return actions[action]
  }

  // Render
  render() {
    onmessage = (e: MessageEvent) => {
      try {
        const checkEditorType = () =>
          this.setState({ editorType: e.data.pluginMessage.data })

        const checkHighlightStatus = () =>
          this.setState({
            hasHighlight:
              e.data.pluginMessage.data === 'NO_RELEASE_NOTE' ||
              e.data.pluginMessage.data === 'READ_RELEASE_NOTE'
                ? false
                : true,
          })

        const checkPlanStatus = () =>
          this.setState({
            planStatus: e.data.pluginMessage.data,
          })

        const updateWhileEmptySelection = () => {
          this.setState({
            service: 'None',
            paletteName: '',
            preset: presets.material,
            view: 'PALETTE_WITH_PROPERTIES',
            textColorsTheme: {
              lightColor: '#FFFFFF',
              darkColor: '#000000',
            },
            onGoingStep: 'selection empty',
          })
          palette.name = ''
          palette.preset = {}
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
              service: 'Create',
              paletteName: '',
              preset: presets.material,
              view: 'PALETTE_WITH_PROPERTIES',
              textColorsTheme: {
                lightColor: '#FFFFFF',
                darkColor: '#000000',
              },
              onGoingStep: 'colors selected',
            })
            palette.name = ''
            palette.preset = presets.material
            palette.view = 'PALETTE_WITH_PROPERTIES'
            palette.textColorsTheme = {
              lightColor: '#FFFFFF',
              darkColor: '#000000',
            }
          } else
            this.setState({
              service: 'Create',
              onGoingStep: 'colors selected',
            })
          isPaletteSelected = false
        }

        const updateWhilePaletteSelected = () => {
          const putIdsOnColors = e.data.pluginMessage.data.colors.map(
            (color) => {
              color.id === undefined ? (color.id = uuidv4()) : null
              return color
            }
          )
          isPaletteSelected = true
          palette.preset = {}
          parent.postMessage(
            {
              pluginMessage: {
                type: 'EXPORT_PALETTE',
                export: this.state['export'].format,
              },
            },
            '*'
          )
          this.setState({
            service: 'Edit',
            paletteName: e.data.pluginMessage.data.name,
            preset: e.data.pluginMessage.data.preset,
            newScale: e.data.pluginMessage.data.scale,
            newColors: putIdsOnColors,
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
              mimeType: 'application/json',
              data: JSON.stringify(e.data.pluginMessage.data, null, '  '),
            },
            onGoingStep: 'export previewed',
          })

        const exportPaletteToCss = () =>
          this.setState({
            export: {
              format: 'CSS',
              mimeType: 'text/css',
              data: `:root {\n  ${e.data.pluginMessage.data.join(';\n  ')}\n}`,
            },
            onGoingStep: 'export previewed',
          })

        const exportPaletteToCsv = () =>
          this.setState({
            export: {
              format: 'CSV',
              mimeType: 'text/csv',
              data: e.data.pluginMessage.data,
            },
            onGoingStep: 'export previewed',
          })
        
        const exportPaletteToiOS = () =>
          this.setState({
            export: {
              format: 'iOS',
              mimeType: 'text/swift',
              data: e.data.pluginMessage.data.join(';\n\n'),
            },
            onGoingStep: 'export previewed',
          })

        const getProPlan = () =>
          this.setState({
            planStatus: e.data.pluginMessage.data,
            hasGetProPlanDialog: true,
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
          EXPORT_PALETTE_CSV: () => exportPaletteToCsv(),
          EXPORT_PALETTE_IOS: () => exportPaletteToiOS(),
          GET_PRO_PLAN: () => getProPlan(),
        }

        return actions[e.data.pluginMessage.type]?.()
      } catch (error) {
        console.error(error)
      }
    }

    return (
      <main>
        <Feature
          isActive={
            features.find((feature) => feature.name === 'CREATE').isActive
          }
        >
          {this.state['service'] === 'Create' ? (
            <CreatePalette
              preset={this.state['preset']}
              paletteName={this.state['paletteName']}
              view={this.state['view']}
              textColorsTheme={this.state['textColorsTheme']}
              planStatus={this.state['planStatus']}
              onReopenHighlight={this.highlightHandler('OPEN')}
              onChangePreset={this.presetHandler}
              onCustomPreset={this.customHandler}
              onChangeView={(view: string) =>
                this.setState({ view: view, onGoingStep: 'view changed' })
              }
              onChangeSettings={this.settingsHandler}
            />
          ) : null}
        </Feature>
        <Feature
          isActive={
            features.find((feature) => feature.name === 'EDIT').isActive
          }
        >
          {this.state['service'] === 'Edit' ? (
            <EditPalette
              paletteName={this.state['paletteName']}
              preset={this.state['preset']}
              scale={this.state['newScale']}
              colors={this.state['newColors']}
              view={this.state['view']}
              textColorsTheme={this.state['textColorsTheme']}
              algorithmVersion={this.state['algorithmVersion']}
              export={this.state['export']}
              editorType={this.state['editorType']}
              planStatus={this.state['planStatus']}
              onReopenHighlight={this.highlightHandler('OPEN')}
              onChangeScale={this.slideHandler}
              onChangeStop={this.customSlideHandler}
              onChangeColor={this.colorHandler}
              onChangeView={this.viewHandler}
              onChangeSettings={this.settingsHandler}
            />
          ) : null}
        </Feature>
        <Feature
          isActive={
            features.find((feature) => feature.name === 'ONBOARDING').isActive
          }
        >
          {this.state['service'] === 'None' ? (
            <Onboarding
              onReopenHighlight={this.highlightHandler('OPEN')}
              planStatus={this.state['planStatus']}
            />
          ) : null}
        </Feature>
        <Feature
          isActive={
            features.find((feature) => feature.name === 'HIGHLIGHT').isActive
          }
        >
          {this.state['hasHighlight'] ? (
            <Highlight closeHighlight={this.highlightHandler('CLOSE')} />
          ) : null}
        </Feature>
        <Feature
          isActive={
            features.find((feature) => feature.name === 'GET_PRO_PLAN').isActive
          }
        >
          {this.state['hasGetProPlanDialog'] ? (
            <Dialog
              title="Welcome to UI Color Palette Pro"
              image=""
              content="You have successfully upgraded to the Pro plan, unlocking a range of tools to enhance the accessibility, accuracy and deployment options."
              label="Let's discover"
              action={() => this.setState({ hasGetProPlanDialog: false })}
            />
          ) : null}
        </Feature>
      </main>
    )
  }
}

root.render(<App />)
