import * as React from 'react'
import type { SettingsMessage } from '../utils/types'
import Dispatcher from './modules/Dispatcher'
import { createRoot } from 'react-dom/client'
import Feature from './components/Feature'
import CreatePalette from './services/CreatePalette'
import EditPalette from './services/EditPalette'
import Onboarding from './services/Onboarding'
import Highlight from './modules/Highlight'
import 'figma-plugin-ds/dist/figma-plugin-ds.css'
import './stylesheets/app.css'
import './stylesheets/components.css'
import package_json from './../../package.json'
import { palette, presets } from '../utils/palettePackage'
import { features } from '../utils/features'
import { v4 as uuidv4 } from 'uuid'

let isPaletteSelected = false
const container = document.getElementById('react-page'),
  root = createRoot(container)

const settingsMessage: SettingsMessage = {
  type: 'update-settings',
  data: {
    name: '',
    algorithmVersion: '',
    textColorsTheme: {
      lightColor: '',
      darkColor: '',
    },
  },
  isEditedInRealTime: false,
}

class App extends React.Component {
  dispatch: any

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
      newScale: {},
      newColors: {},
      hasProperties: true,
      onGoingStep: '',
      preset: presets.material,
      export: {
        format: '',
        mimeType: '',
        data: '',
      },
      paletteName: '',
      textColorsTheme: {
        lightColor: '#FFFFFF',
        darkColor: '#000000',
      },
      algorithmVersion: 'v1',
      hasHighlight: false,
    }
  }

  // Handlers
  propertiesHandler = (bool: boolean) =>
    this.setState({ hasProperties: bool, onGoingStep: 'properties changed' })

  presetHandler = (e: React.SyntheticEvent) => {
    switch ((e.target as HTMLInputElement).value) {
      case presets.material.name: {
        this.setState({
          preset: presets.material,
          onGoingStep: 'preset changed',
        })
        break
      }
      case presets.ant.name: {
        this.setState({
          preset: presets.ant,
          onGoingStep: 'preset changed',
        })
        break
      }
      case presets.atlassian.name: {
        this.setState({
          preset: presets.atlassian,
          onGoingStep: 'preset changed',
        })
        break
      }
      case presets.atlassianNeutral.name: {
        this.setState({
          preset: presets.atlassianNeutral,
          onGoingStep: 'preset changed',
        })
        break
      }
      case presets.carbon.name: {
        this.setState({
          preset: presets.carbon,
          onGoingStep: 'preset changed',
        })
        break
      }
      case presets.base.name: {
        this.setState({
          preset: presets.base,
          onGoingStep: 'preset changed',
        })
        break
      }
      case presets.custom.name: {
        presets.custom.scale = [1, 2]
        this.setState({
          preset: presets.custom,
          onGoingStep: 'preset changed',
        })
      }
    }
  }

  customHandler = (e: React.SyntheticEvent) => {
    const scale = this.state['preset']['scale']
    switch ((e.target as HTMLElement).dataset.feature) {
      case 'add': {
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
        break
      }
      case 'remove': {
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
    }
  }

  slideHandler = () =>
    this.setState({
      newScale: palette.scale,
      onGoingStep: 'scale changed',
    })

  customSlideHandler = () =>
    this.setState({
      newScale: palette.scale,
      preset:
        Object.keys(palette.preset).length == 0
          ? this.state['preset']
          : palette.preset,
      onGoingStep: 'stop changed',
    })

  colorHandler = (colors) =>
    this.setState({
      newColors: colors,
      onGoingStep: 'color changed',
    })

  settingsHandler = (e: any) => {
    console.log(e)
    switch (e.target.dataset.feature) {
      case 'rename-palette': {
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
        break
      }
      case 'change-text-light-color': {
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
        break
      }
      case 'change-text-dark-color': {
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
        break
      }
      case 'update-algorithm-version': {
        settingsMessage.data.name = this.state['paletteName']
        settingsMessage.data.algorithmVersion = !e.target.checked ? 'v1' : 'v2'
        settingsMessage.data.textColorsTheme = this.state['textColorsTheme']
        this.setState({
          algorithmVersion: settingsMessage.data.algorithmVersion,
          onGoingStep: 'settings changed',
        })
        parent.postMessage({ pluginMessage: settingsMessage }, '*')
      }
    }
  }

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
          case 'highlight-status':
            this.setState({ hasHighlight: !e.data.pluginMessage.data })
            break

          case 'empty-selection': {
            this.setState({
              service: 'None',
              hasProperties: true,
              preset: presets.material,
              paletteName: '',
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
                hasProperties: true,
                preset: presets.material,
                paletteName: '',
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
                hasProperties: true,
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
              newScale: e.data.pluginMessage.data.scale,
              hasProperties:
                e.data.pluginMessage.data.properties === 'hasProperties'
                  ? true
                  : false,
              newColors: putIdsOnColors,
              preset: e.data.pluginMessage.data.preset,
              paletteName: e.data.pluginMessage.data.name,
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
              hasProperties={this.state['hasProperties']}
              paletteName={this.state['paletteName']}
              textColorsTheme={this.state['textColorsTheme']}
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
              scale={this.state['newScale']}
              colors={this.state['newColors']}
              preset={this.state['preset']}
              hasProperties={this.state['hasProperties']}
              export={this.state['export']}
              paletteName={this.state['paletteName']}
              textColorsTheme={this.state['textColorsTheme']}
              algorithmVersion={this.state['algorithmVersion']}
              onHighlightReopen={this.highlightHandler('OPEN')}
              onChangeScale={this.slideHandler}
              onChangeStop={this.customSlideHandler}
              onColorChange={this.colorHandler}
              onPropertiesChange={this.propertiesHandler}
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
            <Onboarding onHighlightReopen={this.highlightHandler('OPEN')} />
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
