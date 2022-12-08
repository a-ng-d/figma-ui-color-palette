import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Dispatcher from './modules/Dispatcher';
import CreatePalette from './services/CreatePalette';
import EditPalette from './services/EditPalette';
import Onboarding from './services/Onboarding';
import 'figma-plugin-ds/dist/figma-plugin-ds.css';
import './stylesheets/app.css';
import './stylesheets/components.css';
import chroma from 'chroma-js';
import { palette, presets } from '../utils/palettePackage';
import { v4 as uuidv4 } from 'uuid';

declare function require(path: string): any;

class App extends React.Component {

  dispatch: any;

  constructor(props) {
    super(props);
    this.dispatch = {
      colors: new Dispatcher(
        () => parent.postMessage({ pluginMessage: { type: 'update-colors', data: this.state['newColors'] } }, '*'),
        500
      )
    };
    this.state = {
      service: 'None',
      newScale: {},
      hasCaptions: true,
      onGoingStep: '',
      newColors: {},
      context: 'Scale',
      preset: {},
      export: {
        format: '',
        mimeType: '',
        data: ''
      },
      paletteName: ''
    }
  }

  // Events
  navHandler = (e: any) => this.setState({ context: e.target.innerText, onGoingStep: 'tab changed' })

  captionsHandler = (bool: boolean) => this.setState({ hasCaptions: bool, onGoingStep: 'captions changed' })

  colorHandler = (e: any) => {
    let name, colors, id, element;
    try {
      element = e.nativeEvent.path.filter(el => {
        try { return el.classList.contains('colors__item') }
        catch {}
      })[0];
      name = element.id;
      id = element.getAttribute('data-id')
    } catch {};

    switch (e.target.dataset.feature) {

      case 'hex':
        const code = e.target.value.indexOf('#') == -1 ? '#' + e.target.value : e.target.value
        if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(code)) {
          colors = this.state['newColors'].map(item => {
            const rgb = chroma(e.target.value.indexOf('#') == -1 ? '#' + e.target.value : e.target.value)._rgb;
            if (item.id === id)
              item.rgb = {
                r: rgb[0] / 255,
                g: rgb[1] / 255,
                b: rgb[2] / 255
              }
            return item
          });
          this.setState({
            newColors: colors,
            onGoingStep: 'color changed'
          })
        };
        e._reactName === 'onBlur' ? this.dispatch.colors.on.status = false : this.dispatch.colors.on.status = true;
        break;

      case 'lightness':
        colors = this.state['newColors'].map(item => {
          const rgb = chroma(item.rgb.r * 255, item.rgb.g * 255, item.rgb.b * 255).set('lch.l', e.target.value)._rgb
          if (item.id === id)
            item.rgb = {
              r: rgb[0] / 255,
              g: rgb[1] / 255,
              b: rgb[2] / 255
            }
          return item
        });
        this.setState({
          newColors: colors,
          onGoingStep: 'color changed'
        });
        parent.postMessage({ pluginMessage: { type: 'update-colors', data: colors } }, '*');
        break;

      case 'chroma':
        colors = this.state['newColors'].map(item => {
          const rgb = chroma(item.rgb.r * 255, item.rgb.g * 255, item.rgb.b * 255).set('lch.c', e.target.value)._rgb
          if (item.id === id)
            item.rgb = {
              r: rgb[0] / 255,
              g: rgb[1] / 255,
              b: rgb[2] / 255
            }
          return item
        });
        this.setState({
          newColors: colors,
          onGoingStep: 'color changed'
        });
        parent.postMessage({ pluginMessage: { type: 'update-colors', data: colors } }, '*');
        break;

      case 'hue':
        colors = this.state['newColors'].map(item => {
          const rgb = chroma(item.rgb.r * 255, item.rgb.g * 255, item.rgb.b * 255).set('lch.h', e.target.value)._rgb
          if (item.id === id)
            item.rgb = {
              r: rgb[0] / 255,
              g: rgb[1] / 255,
              b: rgb[2] / 255
            }
          return item
        });
        this.setState({
          newColors: colors,
          onGoingStep: 'color changed'
        });
        parent.postMessage({ pluginMessage: { type: 'update-colors', data: colors } }, '*');
        break;

      case 'remove':
        colors = this.state['newColors'].filter(item => item.id != id);
        this.setState({
          newColors: colors,
          onGoingStep: 'color changed'
        });
        parent.postMessage({ pluginMessage: { type: 'update-colors', data: colors } }, '*');
        break;

      case 'add':
        colors = this.state['newColors'];
        const hasAlreadyNewUIColor = colors.filter(color => color.name.includes('New UI Color'));
        colors.push({
          name: `New UI Color ${hasAlreadyNewUIColor.length + 1}`,
          rgb: {
            r: .53,
            g: .92,
            b: .97
          },
          id: uuidv4(),
          oklch: false,
          hueShifting: 0
        });
        this.setState({
          newColors: colors,
          onGoingStep: 'color changed'
        });
        parent.postMessage({ pluginMessage: { type: 'update-colors', data: colors } }, '*');
        break;

      case 'rename':
        const hasSameName = this.state['newColors'].filter(color => color.name === e.target.value);
        colors = this.state['newColors'].map(item => {
          if (item.id === id)
            item.name = hasSameName.length > 1 ? e.target.value + ' 2' : e.target.value
          return item
        });
        this.setState({
          newColors: colors,
          onGoingStep: 'color changed'
        });
        e._reactName === 'onBlur' ? setTimeout(() => this.state['onGoingStep'] === 'color changed' ? parent.postMessage({ pluginMessage: { type: 'update-colors', data: colors } }, '*') : null, 500) : null;
        e.key === 'Enter' ? parent.postMessage({ pluginMessage: { type: 'update-colors', data: colors } }, '*') : null;
        break;

      case 'oklch':
        colors = this.state['newColors'].map(item => {
          if (item.id === id)
            item.oklch = e.target.checked
          return item
        });
        this.setState({
          newColors: colors,
          onGoingStep: 'color changed'
        });
        parent.postMessage({ pluginMessage: { type: 'update-colors', data: colors } }, '*');
        break;

      case 'shift-hue':
        colors = this.state['newColors'].map(item => {
          if (item.id === id)
            item.hueShifting = parseFloat(e.target.value)
          return item
        });
        this.setState({
          newColors: colors,
          onGoingStep: 'color changed'
        });
        parent.postMessage({ pluginMessage: { type: 'update-colors', data: colors } }, '*')

    }
  }

  orderHandler = (source: any, target: any) => {
    let colors = this.state['newColors'].map(el => el),
        position;

    const colorsWithoutSource = colors.splice(source.position, 1)[0];

    if (target.hasGuideAbove && target.position > source.position)
      position = parseFloat(target.position) - 1
    else if (target.hasGuideBelow && target.position > source.position)
      position = parseFloat(target.position)
    else if (target.hasGuideAbove && target.position < source.position)
      position = parseFloat(target.position)
    else if (target.hasGuideBelow && target.position < source.position)
      position = parseFloat(target.position) + 1
    else
      position = parseFloat(target.position);

    colors.splice(position, 0, colorsWithoutSource);
    this.setState({
      newColors: colors,
      onGoingStep: 'color changed'
    });
    parent.postMessage({ pluginMessage: { type: 'update-colors', data: colors } }, '*')
  }

  presetHandler = (e: any) => {
    switch ((e.target as HTMLInputElement).value) {

      case presets.material.name:
        this.setState({
          preset: presets.material,
          onGoingStep: 'preset changed'
        })
        break;

      case presets.ant.name:
        this.setState({
          preset: presets.ant,
          onGoingStep: 'preset changed'
        })
        break;

      case presets.atlassian.name:
        this.setState({
          preset: presets.atlassian,
          onGoingStep: 'preset changed'
        })
        break;

      case presets.custom.name:
        presets.custom.scale = [1, 2];
        this.setState({
          preset: presets.custom,
          onGoingStep: 'preset changed'
        })

    }
  }

  customHandler = (e: any) => {
    let scale = this.state['preset']['scale'];
    switch (e.target.dataset.feature) {

      case 'add':
        if (scale.length < 24) {
          scale.push(scale.length + 1)
          this.setState({
            preset: {
              name: presets.custom.name,
              scale: scale,
              min: palette.min,
              max: palette.max
            }
          })
        }
        break;

      case 'remove':
        if (scale.length > 2) {
          scale.pop()
          this.setState({
            preset: {
              name: presets.custom.name,
              scale: scale,
              min: palette.min,
              max: palette.max
            }
          })
        }

    }
  }

  slideHandler = () => this.setState({
    newScale: palette.scale,
    onGoingStep: 'scale changed'
  })

  customSlideHandler = () => this.setState({
    newScale: palette.scale,
    preset: palette.preset,
    onGoingStep: 'stop changed'
  })

  settingsHandler = (e: any) => {
    switch (e.target.dataset.feature) {

      case 'rename-palette':
        this.setState({
          paletteName: e.target.value,
          onGoingStep: 'settings changed'
        })
    }
  }

  render() {
    onmessage = (e: any) => {
      switch (e.data.pluginMessage.type) {

        case 'empty-selection':
          this.setState({
            service: 'None',
            hasCaptions: true,
            onGoingStep: 'selection empty'
          });
          palette.preset = {}
          break;

        case 'color-selected':
          this.setState({
            service: 'Create',
            context: 'Scale',
            hasCaptions: true,
            onGoingStep: 'colors selected',
            preset: presets.material
          });
          break;

        case 'palette-selected':
          const putIdsOnColors = e.data.pluginMessage.data.colors.map(color => {
            color.id === undefined ? color.id = uuidv4() : color.id = color.id;
            return color
          });
          palette.preset = {};
          if (e.data.pluginMessage.data.captions === 'hasNotCaptions')
            this.setState({
              service: 'Edit',
              context: 'Scale',
              newScale: e.data.pluginMessage.data.scale,
              hasCaptions: false,
              newColors: putIdsOnColors,
              preset: e.data.pluginMessage.data.preset,
              paletteName: e.data.pluginMessage.data.name,
              onGoingStep: 'palette selected'
            })
          else if (e.data.pluginMessage.data.captions === 'hasCaptions')
            this.setState({
              service: 'Edit',
              context: 'Scale',
              newScale: e.data.pluginMessage.data.scale,
              hasCaptions: true,
              newColors: putIdsOnColors,
              preset: e.data.pluginMessage.data.preset,
              paletteName: e.data.pluginMessage.data.name,
              onGoingStep: 'palette selected'
            })
          break;

        case 'export-palette-json':
          this.setState({
            export: {
              format: 'JSON',
              mimeType: 'application/json',
              data: JSON.stringify(e.data.pluginMessage.data, null, '  '),
            },
            onGoingStep: 'export previewed'
          });
          break;

        case 'export-palette-css':
          this.setState({
            export: {
              format: 'CSS',
              mimeType: 'text/css',
              data: `:root {\n  ${e.data.pluginMessage.data.join(';\n  ')}\n}`
            },
            onGoingStep: 'export previewed'
          })

      }
    };

    return (
      <main>
        {this.state['service'] === 'Create' ?
          <CreatePalette
            preset={this.state['preset']}
            hasCaptions={this.state['hasCaptions']}
            context={this.state['context']}
            paletteName={this.state['paletteName']}
            onCaptionsChange={this.captionsHandler}
            onGoingStep={this.state['onGoingStep']}
            onPresetChange={this.presetHandler}
            onCustomPreset={this.customHandler}
            onContextChange={this.navHandler}
            onSettingsChange={this.settingsHandler}
          />
        : null}
        {this.state['service'] === 'Edit' ?
          <EditPalette
            scale={this.state['newScale']}
            colors={this.state['newColors']}
            preset={this.state['preset']}
            context={this.state['context']}
            hasCaptions={this.state['hasCaptions']}
            export={this.state['export']}
            paletteName={this.state['paletteName']}
            onScaleChange={this.slideHandler}
            onChangeStop={this.customSlideHandler}
            onCaptionsChange={this.captionsHandler}
            onColorChange={this.colorHandler}
            onSettingsChange={this.settingsHandler}
            onContextChange={this.navHandler}
            onOrderChange={this.orderHandler}
            onGoingStep={this.state['onGoingStep']}
          />
        : null}
        {this.state['service'] === 'None' ? <Onboarding /> : null}
      </main>
    )
  }

};

ReactDOM.render(<App />, document.getElementById('react-page'))
