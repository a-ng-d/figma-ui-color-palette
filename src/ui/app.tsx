import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Slider from './components/slider'
import '../../node_modules/figma-plugin-ds/dist/figma-plugin-ds.css';
import './app.css';
import { lightness } from './data';

declare function require(path: string): any;

class App extends React.Component {

  // Events
  onCreate = () => {
    parent.postMessage({ pluginMessage: { type: 'make-palette', lightness } }, '*')
  }

  render() {
    return <main>
      <section id='lightness-scale'>
        <div className='section-title'>Lightness scale</div>
        <Slider />
        <div className="onboarding-tip">
          <div className="icon icon--library"></div>
          <div className="onboarding-tip__msg">Hold Shift ⇧ while dragging 50 or 900 to distribute knobs' horizontal spacing</div>
          <div className="onboarding-tip__msg">Hold Ctrl or Cmd ⌘ while dragging a scale to shift every one</div>
        </div>
      </section>
      <section id='actions'>
        <button className='button button--primary' onClick={this.onCreate}>Generate a palette</button>
      </section>
    </main>
  }
};

ReactDOM.render(<App />, document.getElementById('react-page'))
