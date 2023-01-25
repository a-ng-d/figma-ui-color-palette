import * as React from 'react';
import Button from '../components/Button';
import Dropdown from '../components/Dropdown';
import Slider from '../components/Slider';
import Message from '../components/Message';
import { palette, presets } from '../../utils/palettePackage';

interface Props {
  hasPreset: boolean;
  preset: any;
  scale?: any;
  onChangePreset?: any;
  onScaleChange: any;
  onAddScale?: any;
  onRemoveScale?: any;
  onGoingStep?: any
};

export default class Scale extends React.Component<Props> {

  setOnboardingMessages = () => {
    const messages: Array<string> = []

    if (this.props.preset.name === 'Custom' && !this.props.hasPreset)
      messages.push(
        'Click on the slider range to add a stop',
        'Press Backspace ⌫ after selecting a stop to remove it'
      )

    if (!this.props.hasPreset)
      messages.push(
        'Press ← or → to shift the stops with accuracy'
      )

    messages.push(
      'Hold Shift ⇧ while dragging the first or the last stop to distribute stops\' horizontal spacing',
      'Hold Ctrl ⌃ or Cmd ⌘ while dragging a stop to move them all'
    )

    return messages
  }

  Create = () => {
    this.props.onGoingStep != 'captions changed' ? palette.scale = {} : '';
    return (
      <div className='lightness-scale controls__control'>
        <div className='section-controls'>
          <div className='section-title'>Lightness scale</div>
          <Dropdown
            id='presets'
            options={Object.entries(presets).map(entry => entry[1].name)}
            selected={this.props.preset.name}
            onChange={this.props.onChangePreset}
          />
          {this.props.preset.scale.length > 2 && this.props.preset.name === 'Custom' ?
            <Button
              icon='minus'
              type='icon'
              feature='remove'
              action={this.props.onRemoveScale}
            />
          : null}
          {this.props.preset.name === 'Custom' ?
            <Button
              icon='plus'
              type='icon'
              state={this.props.preset.scale.length == 24 ? 'disabled' : ''}
              feature='add'
              action={this.props.onAddScale}
            />
          : null}
        </div>
        {this.props.onGoingStep != 'captions changed' ?
        <Slider
          type='EQUAL'
          hasPreset={this.props.hasPreset}
          presetName={this.props.preset.name}
          knobs={this.props.preset.scale}
          min={this.props.preset.min}
          max={this.props.preset.max}
          onChange={this.props.onScaleChange}
        /> :
        <Slider
          type='CUSTOM'
          hasPreset={this.props.hasPreset}
          presetName={this.props.preset.name}
          knobs={this.props.preset.scale}
          scale={palette.scale}
          onChange={this.props.onScaleChange}
        />}
        <Message
          icon='library'
          messages= {this.setOnboardingMessages()}
        />
      </div>
    )
  }

  Edit = () => {
    palette.scale = {};
    return (
      <div className='lightness-scale controls__control'>
        <div className='section-controls'>
          <div className='section-title'>Lightness scale</div>
          <div className='label'>{this.props.preset.name}</div>
        </div>
        <Slider
          type='CUSTOM'
          hasPreset={this.props.hasPreset}
          presetName={this.props.preset.name}
          knobs={this.props.preset.scale}
          scale={this.props.scale}
          onChange={this.props.onScaleChange}
        />
        <Message
          icon='library'
          messages= {this.setOnboardingMessages()}
        />
      </div>
    )
  }

  render() {
    return (
      <>
        {!this.props.hasPreset ? <this.Edit /> : <this.Create />}
      </>
    )
  }

}
