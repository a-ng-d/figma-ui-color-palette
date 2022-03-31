import * as React from 'react';
import Slider from '../components/Slider';
import Button from '../components/Button';
import Checkbox from '../components/Checkbox';
import Message from '../components/Message';
import Dropdown from '../components/Dropdown';
import { palette } from '../modules/data';

interface Props {
  hasCaptions: boolean;
  preset: any;
  onCaptionsChange: any;
  onGoingStep: string;
  onPresetChange: any;
  onCustomPreset: any
};

export default class CreatePalette extends React.Component<Props> {

  // Events
  onCreate = () => parent.postMessage({ pluginMessage: { type: 'create-palette', palette } }, '*')

  slideHandler = () => { }

  checkHandler = (e: any) => {
    this.props.onCaptionsChange(e.target.checked);
    palette.captions = e.target.checked;
  }

  presetHandler = (e: any) => this.props.onPresetChange(e)

  scaleHandler = (e: any) => this.props.onCustomPreset(e)

  // Templates
  Scale = () => {
    palette.scale = {};
    return (
      <div className='lightness-scale'>
        <div className='section-controls'>
          <div className='section-title'>Lightness scale</div>
          <Dropdown
            id='presets'
            options={['Material Design (50-900)', 'Ant Design (1-13)', 'Atlassian (0-900)', 'Custom']}
            onChange={this.presetHandler}
          />
          {this.props.onGoingStep === 'scale item edited' ?
            <div id='remove' className='icon-button' onClick={this.scaleHandler}>
              <div className='icon icon--minus'></div>
            </div>
          : null}
          {this.props.onGoingStep === 'scale item max limit' ?
            <div id='remove' className='icon-button' onClick={this.scaleHandler}>
              <div className='icon icon--minus'></div>
            </div>
          : null}
          {this.props.preset.name === 'Custom' ?
            <div id='add' className={`icon-button${this.props.onGoingStep === 'scale item max limit' ? ' disabled' : ''}`} onClick={this.scaleHandler}>
              <div className='icon icon--plus'></div>
            </div>
          : null}
        </div>
        {this.props.onGoingStep != 'captions changed' ?
        <Slider
          type='EQUAL'
          knobs={this.props.preset.scale}
          min={this.props.preset.min}
          max={this.props.preset.max}
          scale={null}
          onChange={this.slideHandler}
        /> :
        <Slider
          type='CUSTOM'
          knobs={this.props.preset.scale}
          min=''
          max=''
          scale={palette.scale}
          onChange={this.slideHandler}
        />}
        <Message
          icon='library'
          messages= {[
            'Hold Shift ⇧ while dragging 50 or 900 to distribute knobs\' horizontal spacing',
            'Hold Ctrl ⌃ or Cmd ⌘ while dragging a knob to move them all'
          ]}
        />
      </div>
    )
  }

  Actions = () => {
    return (
      <div className='actions'>
        <Button
          type='primary'
          label='Create a color palette'
          action={this.onCreate}
        />
        <Checkbox
          id='showCaptions'
          label='Show captions'
          isChecked={this.props.hasCaptions}
          onChange={this.checkHandler}
        />
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
        <this.Controls />
      </section>
    )
  }

}
