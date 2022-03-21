import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Dispatcher from '../modules/Dispatcher';
import CreatePalette from './components/CreatePalette';
import EditPalette from './components/EditPalette';
import Tabs from './components/Tabs';
import '../../node_modules/figma-plugin-ds/dist/figma-plugin-ds.css';
import './app.css';
import chroma from 'chroma-js';
import { palette } from './data';
import {v4 as uuidv4} from 'uuid';

declare function require(path: string): any;

class App extends React.Component {

  dispatch: any;

  constructor(props) {
    super(props);
    this.dispatch = {
      colors: new Dispatcher(
        () => parent.postMessage({ pluginMessage: { type: 'update-colors', data: this.state['newColors'] } }, '*'),
        1000
      )
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
    let name, colors, id;
    try {
      name = e.nativeEvent.path.filter(el => el.className === 'colors__item')[0].id;
      id = e.nativeEvent.path.filter(el => el.className === 'colors__item')[0].getAttribute('data-id')
    } catch {};

    switch (e.target.id) {

      case 'hex':
        colors = this.state['newColors'].map(item => {
          const rgb = chroma(e.target.value)._rgb;
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
        colors.push({
          name: 'New UI Color',
          rgb: {
            r: .53,
            g: .92,
            b: .97
          },
          id: uuidv4()
        });
        this.setState({
          newColors: colors,
          onGoingStep: 'color changed'
        });
        parent.postMessage({ pluginMessage: { type: 'update-colors', data: colors } }, '*')
        break;

      case 'rename':
        colors = this.state['newColors'].map(item => {
          if (item.id === id)
            item.name = e.target.value
          return item
        });
        this.setState({
          newColors: colors,
          onGoingStep: 'color changed'
        });
        e._reactName === 'onBlur' ? setTimeout(() => this.state['onGoingStep'] === 'color changed' ? parent.postMessage({ pluginMessage: { type: 'update-colors', data: colors } }, '*') : null, 500) : null;
        e.key === 'Enter' ? parent.postMessage({ pluginMessage: { type: 'update-colors', data: colors } }, '*') : null

    }
  }

  render() {
    onmessage = (e: any) => {
      switch (e.data.pluginMessage.type) {

        case 'empty-selection':
          this.setState({ isPaletteSelected: false, isColorSelected: false, hasCaptions: true, onGoingStep: 'selection empty' });
          break;

        case 'color-selected':
          this.setState({ isPaletteSelected: false, isColorSelected: true, hasCaptions: true, activeTab: 'Create', onGoingStep: 'colors selected' });
          break;

        case 'palette-selected':
          const putIdsOnColors = e.data.pluginMessage.data.colors.map(color => {
            color.id === undefined ? color.id = uuidv4() : color.id = color.id;
            return color
          });
          if (e.data.pluginMessage.data.captions === 'hasNotCaptions')
            this.setState({ isPaletteSelected: true, activeTab: 'Edit', isColorSelected: false, newScale: e.data.pluginMessage.data.scale, hasCaptions: false, newColors: putIdsOnColors, onGoingStep: 'palette selected' })
          else if (e.data.pluginMessage.data.captions === 'hasCaptions')
            this.setState({ isPaletteSelected: true, activeTab: 'Edit', isColorSelected: false, newScale: e.data.pluginMessage.data.scale, hasCaptions: true, newColors: putIdsOnColors, onGoingStep: 'palette selected' });
          //parent.postMessage({ pluginMessage: { type: 'update-infos', data: this.state } }, '*');

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
