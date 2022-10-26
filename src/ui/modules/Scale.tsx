import * as React from 'react';
import Button from '../components/Button';
import Dropdown from '../components/Dropdown';
import Slider from '../components/Slider';
import Message from '../components/Message';
import { palette, presets } from '../../palette-package';

interface Props {
  hasPreset: boolean;
  preset: any;
  scale: any;
  onChangePreset: any;
  onScaleChange: any;
  onAddScale: any;
  onRemoveScale: any;
  onGoingStep: any
};

export default class Scale extends React.Component<Props> {

  Create = () => {
    this.props.onGoingStep != 'captions changed' ? palette.scale = {} : '';
    return (
      <div className='lightness-scale'>
        <div className='section-controls'>
          <div className='section-title'>Lightness scale</div>
          <Dropdown
            id='presets'
            options={Object.entries(presets).map(entry => entry[1].name)}
            onChange={this.props.onChangePreset}
          />
          {this.props.onGoingStep === 'scale item edited' ?
            <Button
              icon='minus'
              type='icon'
              label={null}
              state=''
              feature='remove'
              action={this.props.onRemoveScale}
            />
          : null}
          {this.props.onGoingStep === 'scale item max limit' ?
            <Button
              icon='minus'
              type='icon'
              label={null}
              state=''
              feature='remove'
              action={this.props.onRemoveScale}
            />
          : null}
          {this.props.preset.name === 'Custom' ?
            <Button
              icon='plus'
              type='icon'
              label={null}
              state={this.props.onGoingStep === 'scale item max limit' ? 'disabled' : ''}
              feature='add'
              action={this.props.onAddScale}
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
          onChange={this.props.onScaleChange}
        /> :
        <Slider
          type='CUSTOM'
          knobs={this.props.preset.scale}
          min=''
          max=''
          scale={palette.scale}
          onChange={this.props.onScaleChange}
        />}
        <Message
          icon='library'
          messages= {[
            'Hold Shift ⇧ while dragging the first or the last knob to distribute knobs\' horizontal spacing',
            'Hold Ctrl ⌃ or Cmd ⌘ while dragging a knob to move them all'
          ]}
        />
      </div>
    )
  }

  Edit = () => {
    palette.scale = {};
    return (
      <div className='lightness-scale'>
        <div className='section-controls'>
          <div className='section-title'>Lightness scale</div>
          <div className='label'>{this.props.preset.name}</div>
        </div>
        <Slider
          type='CUSTOM'
          knobs={this.props.preset.scale}
          min=''
          max=''
          scale={this.props.scale}
          onChange={this.props.onScaleChange}
        />
        <Message
          icon='library'
          messages= {[
            'Hold Shift ⇧ while dragging the first or the last knob to distribute knobs\' horizontal spacing',
            'Hold Ctrl ⌃ or Cmd ⌘ while dragging a knob to move them all'
          ]}
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
