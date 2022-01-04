import * as React from 'react';
import Slider from './Slider';
import Button from './Button';
import Checkbox from './Checkbox';
import { palette } from '../data';

interface Props {
  hasCaption: boolean
};

export default class CreatePalette extends React.Component<Props> {

  // Events
  onCreate = () => {
    parent.postMessage({ pluginMessage: { type: 'create-palette', palette } }, '*')
  }

  slideHandler = () => { }

  onCaption = (e: any) => {
    this.setState({ hasCaption: e.target.checked });
    palette.caption = e.target.checked
  }

  render() {
    return (
      <section>
        <div className='lightness-scale'>
          <div className='section-title'>Lightness scale</div>
          <Slider
            type='EQUAL'
            knobsList='50 100 200 300 400 500 600 700 800 900'
            min='24'
            max='96'
            scale='null'
            onChange={this.slideHandler}
          />
          <div className='onboarding-tip'>
            <div className='icon icon--library'></div>
            <div className='onboarding-tip__msg'>Hold Shift ⇧ while dragging 50 or 900 to distribute knobs' horizontal spacing</div>
            <div className='onboarding-tip__msg'>Hold Ctrl or Cmd ⌘ while dragging a scale to shift every one</div>
          </div>
        </div>
        <div className='actions'>
          <Button type='primary' label='Create palette' action={this.onCreate} />
          <Checkbox id='showCaptions' label='Show captions' isChecked={true} onChange={this.onCaption} />
        </div>
      </section>
    )
  }

}
