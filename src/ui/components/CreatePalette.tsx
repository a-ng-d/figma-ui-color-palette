import * as React from 'react';
import Slider from './Slider';
import Button from './Button';
import Checkbox from './Checkbox';
import Message from './Message';
import { palette } from '../data';

interface Props {
  hasCaptions: boolean;
  isColorSelected: boolean;
  onCaptionsChange: any;
  onGoingStep: string
};

export default class CreatePalette extends React.Component<Props> {

  // Events
  onCreate = () => parent.postMessage({ pluginMessage: { type: 'create-palette', palette } }, '*')

  slideHandler = () => { }

  checkHandler = (e: any) => {
    this.props.onCaptionsChange(e.target.checked);
    palette.captions = e.target.checked;
  }

  // Templates
  Message = () => {
    return (
      <div className='message'>
        <Message
          icon='library'
          messages= 'Select your starting colors on the canvas'
        />
      </div>
    )
  }

  Scale = () => {
    return (
      <>
      <div className='lightness-scale'>
        <div className='section-title'>Lightness scale</div>
        {this.props.onGoingStep != 'captions changed' ?
        <Slider
          type='EQUAL'
          knobsList='50 100 200 300 400 500 600 700 800 900'
          min='24'
          max='96'
          scale={null}
          onChange={this.slideHandler}
        /> :
        <Slider
          type='CUSTOM'
          knobsList='50 100 200 300 400 500 600 700 800 900'
          min=''
          max=''
          scale={JSON.stringify(palette.scale)}
          onChange={this.slideHandler}
        />}
        <Message
          icon='library'
          messages= 'Hold Shift ⇧ while dragging 50 or 900 to distribute knobs\' horizontal spacing ; Hold Ctrl ⌃ or Cmd ⌘ while dragging a knob to move them all'
        />
      </div>
      <div className='actions'>
        <Button type='primary' label='Create a color palette' action={this.onCreate} />
        <Checkbox id='showCaptions' label='Show captions' isChecked={this.props.hasCaptions} onChange={this.checkHandler} />
      </div>
      </>
    )
  }

  render() {
    palette.captions = this.props.hasCaptions;
    return (
      <section>
      {!this.props.isColorSelected ? <this.Message /> : null}
      {this.props.isColorSelected ? <this.Scale /> : null}
      </section>
    )
  }

}
