import * as React from 'react';
import Slider from '../components/Slider';
import Button from '../components/Button';
import Checkbox from '../components/Checkbox';
import Message from '../components/Message';
import Dropdown from '../components/Dropdown';
import { palette, presets } from '../modules/data';

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
            options={Object.entries(presets).map(entry => entry[1].name)}
            onChange={this.presetHandler}
          />
          {this.props.onGoingStep === 'scale item edited' ?
            <Button
              id='remove'
              icon='minus'
              type='icon'
              label={null}
              state=''
              action={this.scaleHandler}
            />
          : null}
          {this.props.onGoingStep === 'scale item max limit' ?
            <Button
              id='remove'
              icon='minus'
              type='icon'
              label={null}
              state=''
              action={this.scaleHandler}
            />
          : null}
          {this.props.preset.name === 'Custom' ?
            <Button
              id='add'
              icon='plus'
              type='icon'
              label={null}
              state={this.props.onGoingStep === 'scale item max limit' ? 'disabled' : ''}
              action={this.scaleHandler}
            />
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
          id={null}
          icon={null}
          type='primary'
          label='Create a color palette'
          state=''
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
    palette.preset = this.props.preset;
    return (
      <section>
        <this.Controls />
      </section>
    )
  }

}
