import * as React from 'react';
import * as ReactDOM from 'react-dom';
import CreatePalette from './components/CreatePalette';
import EditPalette from './components/EditPalette';
import Tabs from './components/Tabs';
import '../../node_modules/figma-plugin-ds/dist/figma-plugin-ds.css';
import './app.css';
import chroma from 'chroma-js';
import { palette } from './data';

declare function require(path: string): any;

class App extends React.Component {

  dispatch: any;

  constructor(props) {
    super(props);
    this.dispatch = {
      active: null,
      blocked: false,
      interval: '',
      send(type) {
        this.interval = setInterval(() => parent.postMessage({ pluginMessage: { type: type, palette } }, '*'), 1000)
        this.blocked = true
      },
      stop() {
        clearInterval(this.interval);
        this.blocked = false
      },
      get color() {
        return this.active;
      },
      set color(bool) {
        if (!this.blocked)
          this.send('update-colors')
        else if (this.blocked && !bool)
          this.stop();
        this.active = bool;
      }
    };
    this.state = {
      activeTab: 'Create',
      isPaletteSelected: false,
      isColorSelected: false,
      newScale: null,
      hasCaptions: true,
      onGoingStep: '',
      newColors: null
    }
  }

  // Events
  navHandler = (e: any) => {
    this.setState({ activeTab: e.target.innerText, onGoingStep: 'tab changed' });
    parent.postMessage({ pluginMessage: { type: 'get-infos' } }, '*');
  }

  captionsHandler = (bool: boolean) => this.setState({ hasCaptions: bool, onGoingStep: 'captions changed' })

  colorHandler = (e: any) => {
    const name = e.nativeEvent.path.filter(el => el.className === 'colors__item')[0].id;
    let colors;

    switch (e.target.id) {

      case 'hex':
        colors = JSON.parse(this.state['newColors']).map(item => {
          const rgb = chroma(e.target.value)._rgb;
          if (item.name === name)
            return {
              name: name,
              rgb: {
                r: rgb[0] / 255,
                g: rgb[1] / 255,
                b: rgb[2] / 255
              }
            }
          else
            return item
        });
        this.setState({
          newColors: JSON.stringify(colors),
          onGoingStep: 'color changed'
        });
        (palette as any).colors = colors;
        this.dispatch.color = true
        e._reactName === 'onBlur' ? this.dispatch.color = false : '';
        break;

      case 'lightness':
        colors = JSON.parse(this.state['newColors']).map(item => {
          const rgb = chroma(item.rgb.r * 255, item.rgb.g * 255, item.rgb.b * 255).set('lch.l', e.target.value)._rgb
          if (item.name === name)
            return {
              name: name,
              rgb: {
                r: rgb[0] / 255,
                g: rgb[1] / 255,
                b: rgb[2] / 255
              }
            }
          else
            return item
        });
        this.setState({
          newColors: JSON.stringify(colors),
          onGoingStep: 'color changed'
        });
        (palette as any).colors = colors;
        parent.postMessage({ pluginMessage: { type: 'update-colors', palette } }, '*');
        break;

      case 'chroma':
        colors = JSON.parse(this.state['newColors']).map(item => {
          const rgb = chroma(item.rgb.r * 255, item.rgb.g * 255, item.rgb.b * 255).set('lch.c', e.target.value)._rgb
          if (item.name === name)
            return {
              name: name,
              rgb: {
                r: rgb[0] / 255,
                g: rgb[1] / 255,
                b: rgb[2] / 255
              }
            }
          else
            return item
        });
        this.setState({
          newColors: JSON.stringify(colors),
          onGoingStep: 'color changed'
        });
        (palette as any).colors = colors;
        parent.postMessage({ pluginMessage: { type: 'update-colors', palette } }, '*');
        break;

      case 'hue':
        colors = JSON.parse(this.state['newColors']).map(item => {
          const rgb = chroma(item.rgb.r * 255, item.rgb.g * 255, item.rgb.b * 255).set('lch.h', e.target.value)._rgb
          if (item.name === name)
            return {
              name: name,
              rgb: {
                r: rgb[0] / 255,
                g: rgb[1] / 255,
                b: rgb[2] / 255
              }
            }
          else
            return item
        });
        this.setState({
          newColors: JSON.stringify(colors),
          onGoingStep: 'color changed'
        });
        (palette as any).colors = colors;
        parent.postMessage({ pluginMessage: { type: 'update-colors', palette } }, '*');
        break;

      case 'delete':
        colors = JSON.parse(this.state['newColors']).filter(item => item.name != name);
        this.setState({
          newColors: JSON.stringify(colors),
          onGoingStep: 'color changed'
        });
        (palette as any).colors = colors

    }
  }

  render() {
    onmessage = (e: any) => {
      switch (JSON.parse(e.data.pluginMessage).type) {

        case 'empty-selection':
          this.setState({ isPaletteSelected: false, isColorSelected: false, hasCaptions: true, onGoingStep: 'selection empty' });
          break;

        case 'color-selected':
          this.setState({ isPaletteSelected: false, isColorSelected: true, activeTab: 'Create', onGoingStep: 'colors selected' });
          break;

        case 'palette-selected':
          if (JSON.parse(e.data.pluginMessage).data.captions === 'hasNotCaptions')
            this.setState({ isPaletteSelected: true, activeTab: 'Edit', isColorSelected: false, newScale: JSON.parse(e.data.pluginMessage).data.scale, hasCaptions: false, newColors: JSON.parse(e.data.pluginMessage).data.colors, onGoingStep: 'palette selected' })
          else if (JSON.parse(e.data.pluginMessage).data.captions === 'hasCaptions')
            this.setState({ isPaletteSelected: true, activeTab: 'Edit', isColorSelected: false, newScale: JSON.parse(e.data.pluginMessage).data.scale, hasCaptions: true, newColors: JSON.parse(e.data.pluginMessage).data.colors, onGoingStep: 'palette selected' })

      }
    };

    return (
      <main>
        <Tabs tabs='Create Edit' active={this.state['activeTab']} onClick={this.navHandler}/>
        {this.state['activeTab'] === 'Create' ? <CreatePalette isColorSelected={this.state['isColorSelected']} hasCaptions={this.state['hasCaptions']} onCaptionsChange={this.captionsHandler} onGoingStep={this.state['onGoingStep']} /> : null}
        {this.state['activeTab'] === 'Edit' ? <EditPalette isPaletteSelected={this.state['isPaletteSelected']} scale={this.state['newScale']} hasCaptions={this.state['hasCaptions']} colors={this.state['newColors']} onCaptionsChange={this.captionsHandler} onColorChange={this.colorHandler} /> : null}
      </main>
    )
  }

};

ReactDOM.render(<App />, document.getElementById('react-page'))
