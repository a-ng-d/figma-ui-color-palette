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
      isSelected: false
    }
  }

  // Events
  handleClick = (e: any) => {
    this.setState({ activeTab: e.target.innerText })
  }

  render() {
    onmessage = (e: any) => {
      if (e.data.pluginMessage === 'empty-selection' || e.data.pluginMessage === '')
        this.setState({ isSelected: false })
      else
        this.setState({ isSelected: true })
    };

    return (
      <main>
        <Tabs tabs='Create Update' active={this.state['activeTab']} onClick={this.handleClick}/>
        {this.state['activeTab'] === 'Create' ? <CreatePalette /> : null}
        {this.state['activeTab'] === 'Update' ? <UpdatePalette palette={this.state['isSelected']}/> : null}
      </main>
    )
  }

};

ReactDOM.render(<App />, document.getElementById('react-page'))
