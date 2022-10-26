import * as React from 'react';
import Slider from '../components/Slider';
import Button from '../components/Button';
import Checkbox from '../components/Checkbox';
import Message from '../components/Message';
import Dropdown from '../components/Dropdown';
import Actions from '../modules/Actions';
import Scale from '../modules/Scale';
import { palette, presets } from '../../palette-package';

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

  Controls = () => {
    return (
      <>
        <div className='controls'>
          <Scale
            hasPreset={true}
            preset={this.props.preset}
            scale={null}
            onChangePreset={this.presetHandler}
            onScaleChange={this.slideHandler}
            onAddScale={this.scaleHandler}
            onRemoveScale={this.scaleHandler}
            onGoingStep={this.props.onGoingStep}
          />
        </div>
        <Actions
          context='create'
          hasCaptions={this.props.hasCaptions}
          onCreatePalette={this.onCreate}
          onCreateLocalColors={null}
          onUpdateLocalColors={null}
          onChangeCaptions={this.checkHandler}
        />
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
