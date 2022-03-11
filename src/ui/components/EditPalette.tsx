import * as React from 'react';
import Dispatcher from '../../modules/Dispatcher';
import Slider from './Slider';
import Switch from './Switch';
import Button from './Button';
import Message from './Message';
import ColorItem from './ColorItem';
import chroma from 'chroma-js';
import { palette } from '../data';

interface Props {
  isPaletteSelected: boolean;
  scale: string;
  hasCaptions: boolean;
  colors: string;
  onCaptionsChange: any;
  onColorChange: any
};

export default class EditPalette extends React.Component<Props> {

  dispatch: any;

  constructor(props) {
    super(props);
    this.dispatch = {
      scale: new Dispatcher(
        () => parent.postMessage({ pluginMessage: { type: 'update-scale', palette } }, '*'),
        1000
      )
    }
  }

  // Events
  slideHandler = (e: string) => e === 'released' ? this.dispatch.scale.on.status = false : this.dispatch.scale.on.status = true

  checkHandler = (e: any) => {
    this.props.onCaptionsChange(e.target.checked);
    palette.captions = e.target.checked;
    parent.postMessage({ pluginMessage: { type: 'update-captions', palette } }, '*')
  }

  colorHandler = (e: any) => this.props.onColorChange(e)

  onCreate = () => parent.postMessage({ pluginMessage: { type: 'create-local-styles', palette } }, '*')

  onUpdate = () => parent.postMessage({ pluginMessage: { type: 'update-local-styles', palette } }, '*')

  // Templates
  Message = () => {
    return (
      <div className='message'>
        <Message
          icon='theme'
          messages= 'Select an UI Color Palette to edit it'
        />
      </div>
    )
  }

  Scale = () => {
    return (
      <div className='lightness-scale'>
        <div className='section-title'>Lightness scale</div>
        <Slider
          type='CUSTOM'
          knobsList='50 100 200 300 400 500 600 700 800 900'
          min=''
          max=''
          scale={this.props.scale}
          onChange={this.slideHandler}
        />
        <Message
          icon='library'
          messages= 'Hold Shift ⇧ while dragging 50 or 900 to distribute knobs\' horizontal spacing ; Hold Ctrl ⌃ or Cmd ⌘ while dragging a knob to move them all'
        />
      </div>
    )
  }

  Colors = () => {
    return (
      <div className='starting-colors'>
        <div className='section-title'>Starting colors</div>
        <ul className='colors'>
          {JSON.parse(this.props.colors).map(color =>
            <ColorItem key={color.name} name={color.name} hex={chroma(color.rgb.r * 255, color.rgb.g * 255, color.rgb.b * 255).hex()} onColorChange={this.colorHandler} />
          )}
        </ul>
      </div>
    )
  }

  Actions = () => {
    return (
      <div className='actions'>
        <div className='buttons'>
          <Button type='secondary' label='Update the local styles' action={this.onUpdate} />
          <Button type='primary' label='Create local styles' action={this.onCreate} />
        </div>
        <Switch id='showCaptions' label='Show captions' isChecked={this.props.hasCaptions} onChange={this.checkHandler} />
      </div>
    )
  }

  Controls = () => {
    return (
      <>
      <div className='controls'>
        <this.Scale />
        <this.Colors />
      </div>
      <this.Actions />
      </>
    )
  }

  render() {
    palette.captions = this.props.hasCaptions;
    return (
      <section>
        {!this.props.isPaletteSelected ? <this.Message /> : null}
        {this.props.isPaletteSelected ? <this.Controls /> : null}
      </section>
    )
  }

}
