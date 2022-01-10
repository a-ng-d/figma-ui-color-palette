import * as React from 'react';
import * as ReactDOM from 'react-dom';
import CreatePalette from './components/CreatePalette';
import UpdatePalette from './components/UpdatePalette';
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
      hasCaptions: true
    }
  }

  // Events
  navHandler = (e: any) => {
    this.setState({ activeTab: e.target.innerText });
    parent.postMessage({ pluginMessage: { type: 'get-infos' } }, '*');
  }

  render() {
    onmessage = (e: any) => {
      switch (JSON.parse(e.data.pluginMessage).type) {

        case 'empty-selection':
          this.setState({ isPaletteSelected: false, isColorSelected: false });
          break;

        case 'color-selected':
          this.setState({ isPaletteSelected: false, isColorSelected: true });
          break;

        case 'palette-selected':
          if (JSON.parse(e.data.pluginMessage).data.captions === 'hasNotCaptions')
            this.setState({ isPaletteSelected: true, newScale: JSON.parse(e.data.pluginMessage).data.scale, hasCaptions: false })
          else if (JSON.parse(e.data.pluginMessage).data.captions === 'hasCaptions')
            this.setState({ isPaletteSelected: true, newScale: JSON.parse(e.data.pluginMessage).data.scale, hasCaptions: true })

      }
    };

    return (
      <main>
        <Tabs tabs='Create Update' active={this.state['activeTab']} onClick={this.navHandler}/>
        {this.state['activeTab'] === 'Create' ? <CreatePalette isColorSelected={this.state['isColorSelected']} hasCaptions={this.state['hasCaptions']} /> : null}
        {this.state['activeTab'] === 'Update' ? <UpdatePalette isPaletteSelected={this.state['isPaletteSelected']} scale={this.state['newScale']} hasCaptions={this.state['hasCaptions']} /> : null}
      </main>
    )
  }

};

ReactDOM.render(<App />, document.getElementById('react-page'))
