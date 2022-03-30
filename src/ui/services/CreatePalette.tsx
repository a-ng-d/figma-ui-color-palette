import * as React from 'react';
import Slider from '../components/Slider';
import Button from '../components/Button';
import Checkbox from '../components/Checkbox';
import Message from '../components/Message';
import Dropdown from '../components/Dropdown';
import { palette } from '../modules/data';

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
          messages= 'Select your starting colors on the Figma canvas－from the layers filled with a solid color'
        />
      </div>
    )
  }

  Scale = () => {
    return (
      <div className='lightness-scale'>
        <div className='title-with-icon'>
          <div className='section-title'>Lightness scale</div>
          <Dropdown
            id='presets'
            options={['50-900 (Material Design)', 'Custom']}
          />
        </div>
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
          scale={palette.scale}
          onChange={this.slideHandler}
        />}
        <Message
          icon='library'
          messages= 'Hold Shift ⇧ while dragging 50 or 900 to distribute knobs\' horizontal spacing ; Hold Ctrl ⌃ or Cmd ⌘ while dragging a knob to move them all'
        />
      </div>
    )
  }

  Actions = () => {
    return (
      <div className='actions'>
        <Button type='primary' label='Create a color palette' action={this.onCreate} />
        <Checkbox id='showCaptions' label='Show captions' isChecked={this.props.hasCaptions} onChange={this.checkHandler} />
      </div>
    )
  }

  Controls = () => {
    return (
      <>
      <div className='controls'>
        <this.Scale />
      </div>
      <this.Actions />
      </>
    )
  }

  render() {
    palette.captions = this.props.hasCaptions;
    return (
      <section>
      {!this.props.isColorSelected ? <this.Message /> : null}
      {this.props.isColorSelected ? <this.Controls /> : null}
      </section>
    )
  }

}
