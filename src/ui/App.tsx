import * as React from 'react'
import { createRoot } from 'react-dom/client'
import type { Actions, ColorConfiguration, DispatchProcess, SettingsMessage } from '../utils/types'
import Dispatcher from './modules/Dispatcher'
import Feature from './components/Feature'
import Onboarding from './services/Onboarding'
import CreatePalette from './services/CreatePalette'
import EditPalette from './services/EditPalette'
import Highlight from './modules/Highlight'
import package_json from './../../package.json'
import { palette, presets } from '../utils/palettePackage'
import { features } from '../utils/features'
import { v4 as uuidv4 } from 'uuid'
import 'figma-plugin-ds/dist/figma-plugin-ds.css'
import './stylesheets/app.css'
import './stylesheets/components.css'

let isPaletteSelected = false
const container = document.getElementById('react-page'),
  root = createRoot(container)

const settingsMessage: SettingsMessage = {
  type: 'update-settings',
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
      hasHighlight: false,
      planStatus: 'UNPAID',
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
      console.log('ok')
      this.setState({
        preset: presets.custom,
        onGoingStep: 'preset changed',
      })
    }

    const actions: Actions = {
      MATERIAL: () => setMaterialDesignPreset(),
      ANT: () => setAntDesignPreset(),
      ADS: () => setAdsPreset(),
      ADS_NEUTRAL: () => setAdsNeutralPreset(),
      CARBON: () => setCarbonPreset(),
      BASE: () => setBasePreset(),
      CUSTOM: () => setCustomPreset()
    }

    return actions[(e.target as HTMLInputElement).value]()
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
          },
        })
      }
    }

    const actions: Actions = {
      ADD: () => addStop(),
      REMOVE: () => removeStop(),
    }

    return actions[(e.target as HTMLInputElement).dataset.feature]()
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

    const changeTextLightColor = () => {
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

    const changeTextDarkColor = () => {
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

    const actions: Actions = {
      RENAME_PALETTE: () => renamePalette(),
      CHANGE_TEXT_LIGHT_COLOR: () => changeTextLightColor(),
      CHANGE_TEXT_DARK_COLOR: () => changeTextDarkColor(),
      UPDATE_ALGORITHM_VERSION: () => updateAlgorythmVersion()
    }

    return actions[e.target.dataset.feature]()
  }
  
  viewHandler = (view: string) =>
    this.setState({ view: view, onGoingStep: 'view changed' })

  highlightHandler = (action: string) => {
    const openHighlight = () => this.setState({ hasHighlight: true })
    
    const closeHighlight = () => {
      parent.postMessage(
        {
          pluginMessage: {
            type: 'close-highlight',
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
        switch (
          e.data.pluginMessage.type == undefined
            ? 'undefined'
            : e.data.pluginMessage.type
        ) {
          case 'plan-status':
            this.setState({ planStatus: e.data.pluginMessage.data })
            break

          case 'highlight-status':
            this.setState({ hasHighlight: !e.data.pluginMessage.data })
            break

          case 'empty-selection': {
            this.setState({
              service: 'None',
              paletteName: '',
              preset: presets.material,
              textColorsTheme: {
                lightColor: '#FFFFFF',
                darkColor: '#000000',
              },
              onGoingStep: 'selection empty',
            })
            palette.name = ''
            palette.preset = {}
            palette.textColorsTheme = {
              lightColor: '#FFFFFF',
              darkColor: '#000000',
            }
            isPaletteSelected = false
            break
          }
          case 'color-selected': {
            if (isPaletteSelected) {
              this.setState({
                service: 'Create',
                paletteName: '',
                preset: presets.material,
                textColorsTheme: {
                  lightColor: '#FFFFFF',
                  darkColor: '#000000',
                },
                onGoingStep: 'colors selected',
              })
              palette.name = ''
              palette.preset = presets.material
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
            break
          }
          case 'palette-selected': {
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
                  type: 'export-palette',
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
            break
          }
          case 'export-palette-json': {
            this.setState({
              export: {
                format: 'JSON',
                mimeType: 'application/json',
                data: JSON.stringify(e.data.pluginMessage.data, null, '  '),
              },
              onGoingStep: 'export previewed',
            })
            break
          }
          case 'export-palette-css': {
            this.setState({
              export: {
                format: 'CSS',
                mimeType: 'text/css',
                data: `:root {\n  ${e.data.pluginMessage.data.join(
                  ';\n  '
                )}\n}`,
              },
              onGoingStep: 'export previewed',
            })
            break
          }
          case 'export-palette-csv': {
            this.setState({
              export: {
                format: 'CSV',
                mimeType: 'text/csv',
                data: e.data.pluginMessage.data,
              },
              onGoingStep: 'export previewed',
            })
          }
        }
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
              textColorsTheme={this.state['textColorsTheme']}
              planStatus={this.state['planStatus']}
              onHighlightReopen={this.highlightHandler('OPEN')}
              onPresetChange={this.presetHandler}
              onCustomPreset={this.customHandler}
              onSettingsChange={this.settingsHandler}
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
              planStatus={this.state['planStatus']}
              onHighlightReopen={this.highlightHandler('OPEN')}
              onChangeScale={this.slideHandler}
              onChangeStop={this.customSlideHandler}
              onColorChange={this.colorHandler}
              onChangeView={this.viewHandler}
              onSettingsChange={this.settingsHandler}
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
              onHighlightReopen={this.highlightHandler('OPEN')}
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
      </main>
    )
  }
}

root.render(<App />)
