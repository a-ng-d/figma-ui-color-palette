import * as React from 'react';
import * as ReactDOM from 'react-dom';
import CreatePalette from './components/CreatePalette';
import EditPalette from './components/EditPalette';
import Tabs from './components/Tabs';
import '../../node_modules/figma-plugin-ds/dist/figma-plugin-ds.css';
import './app.css';

declare function require(path: string): any;

class App extends React.Component {

  constructor(props) {
    super(props);
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

  captionsHandler = (bool: boolean) => this.setState({ hasCaptions: bool, onGoingStep: 'captions changed' });

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
        {this.state['activeTab'] === 'Edit' ? <EditPalette isPaletteSelected={this.state['isPaletteSelected']} scale={this.state['newScale']} hasCaptions={this.state['hasCaptions']} colors={this.state['newColors']} onCaptionsChange={this.captionsHandler} /> : null}
      </main>
    )
  }

};

ReactDOM.render(<App />, document.getElementById('react-page'))
