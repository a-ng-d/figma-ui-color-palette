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
      activeTab: 'Create'
    }
  }

  handleClick = (e: any) => {
    this.setState({ activeTab: e.target.innerText })
  }

  render() {
    return (
      <main>
        <Tabs tabs='Create Update' active={this.state['activeTab']} onClick={this.handleClick}/>
        {this.state['activeTab'] === 'Create' ? <CreatePalette /> : null}
        {this.state['activeTab'] === 'Update' ? <UpdatePalette /> : null}
      </main>
    )
  }

};

ReactDOM.render(<App />, document.getElementById('react-page'))
