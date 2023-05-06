import * as React from 'react'
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

class App extends React.Component {
  constructor(props) {
    super(props)
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
      textColorsTheme: {},
      algorithmVersion: 'v1',
      hasHighlight: false,
    }
  }

  // Handlers
  propertiesHandler = (bool: boolean) =>
    this.setState({ hasProperties: bool, onGoingStep: 'properties changed' })

  presetHandler = (e: any) => {
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

  customHandler = (e: any) => {
    const scale = this.state['preset']['scale']
    switch (e.target.dataset.feature) {
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
    switch (e.target.dataset.feature) {
      case 'rename-palette': {
        palette.name = e.target.value
        this.setState({
          paletteName: e.target.value,
          onGoingStep: 'settings changed',
        })
        e._reactName === 'onBlur' && this.state['service'] === 'Edit'
          ? parent.postMessage(
              {
                pluginMessage: {
                  type: 'update-settings',
                  data: {
                    name: e.target.value,
                    algorithmVersion: this.state['algorithmVersion'],
                  },
                },
              },
              '*'
            )
          : null
        e.key === 'Enter' && this.state['service'] === 'Edit'
          ? parent.postMessage(
              {
                pluginMessage: {
                  type: 'update-settings',
                  data: {
                    name: e.target.value,
                    algorithmVersion: this.state['algorithmVersion'],
                  },
                },
              },
              '*'
            )
          : null

        break
      }
      case 'update-algorithm-version': {
        this.setState({
          algorithmVersion: !e.target.checked ? 'v1' : 'v2',
          onGoingStep: 'settings changed',
        })
        parent.postMessage(
          {
            pluginMessage: {
              type: 'update-settings',
              data: {
                name: this.state['paletteName'],
                algorithmVersion: !e.target.checked ? 'v1' : 'v2',
              },
            },
          },
          '*'
        )
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
    onmessage = (e: any) => {
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
              paletteName: '',
              preset: presets.material,
              onGoingStep: 'selection empty',
            })
            palette.name = ''
            palette.preset = {}
            isPaletteSelected = false
            break
          }
          case 'color-selected': {
            if (isPaletteSelected) {
              this.setState({
                service: 'Create',
                hasProperties: true,
                onGoingStep: 'colors selected',
                preset: presets.material,
                paletteName: '',
              })
              palette.name = ''
              palette.preset = presets.material
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
