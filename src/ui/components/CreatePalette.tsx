import * as React from 'react';
import Slider from './Slider';
import { lightness } from '../data';

export default class CreatePalette extends React.Component {

  // Events
  onCreate = () => {
    parent.postMessage({ pluginMessage: { type: 'create-palette', lightness } }, '*')
  }

  render() {
    return (
      <section>
        <div className='lightness-scale'>
          <div className='section-title'>Lightness scale</div>
          <Slider />
          <div className='onboarding-tip'>
            <div className='icon icon--library'></div>
            <div className='onboarding-tip__msg'>Hold Shift ⇧ while dragging 50 or 900 to distribute knobs' horizontal spacing</div>
            <div className='onboarding-tip__msg'>Hold Ctrl or Cmd ⌘ while dragging a scale to shift every one</div>
          </div>
        </div>
        <div className='actions'>
          <button className='button button--primary' onClick={this.onCreate}>Create a palette</button>
        </div>
      </section>
    )
  }

}
