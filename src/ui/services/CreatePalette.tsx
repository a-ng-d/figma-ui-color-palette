import * as React from 'react';
import Tabs from '../components/Tabs';
import Scale from '../modules/Scale';
import About from '../modules/About';
import Actions from '../modules/Actions';
import { palette, presets } from '../../palette-package';

interface Props {
  hasCaptions: boolean;
  preset: any;
  context: string;
  onCaptionsChange: any;
  onGoingStep: string;
  onContextChange: any;
  onPresetChange: any;
  onCustomPreset: any
};

export default class CreatePalette extends React.Component<Props> {

  // Events
  onCreate = () => parent.postMessage({ pluginMessage: { type: 'create-palette', palette } }, '*')

  slideHandler = () => { }

  checkHandler = (e: any) => {
    this.props.onCaptionsChange(e.target.checked);
    palette.captions = e.target.checked
  }

  navHandler = (e: any) => {
    this.props.onContextChange(e)
    this.setState({
      selectedElement: {
        id: '',
        position: null
      }
    })
  }

  presetHandler = (e: any) => this.props.onPresetChange(e)

  scaleHandler = (e: any) => this.props.onCustomPreset(e)

  render() {
    palette.captions = this.props.hasCaptions;
    palette.preset = this.props.preset;
    return (
      <>
        <Tabs
          primaryTabs={['Scale']}
          secondaryTabs={['About']}
          active={this.props.context}
          onClick={this.navHandler}
        />
        <section>
          <div className='controls'>
            {this.props.context === 'Scale' ?
            <Scale
              hasPreset={true}
              preset={this.props.preset}
              scale={null}
              onChangePreset={this.presetHandler}
              onScaleChange={this.slideHandler}
              onAddScale={this.scaleHandler}
              onRemoveScale={this.scaleHandler}
              onGoingStep={this.props.onGoingStep}
            /> : null}
            {this.props.context === 'About' ? <About /> : null}
          </div>
          {this.props.context != 'About' ?
          <Actions
            context='create'
            hasCaptions={this.props.hasCaptions}
            onCreatePalette={this.onCreate}
            onCreateLocalColors={null}
            onUpdateLocalColors={null}
            onChangeCaptions={this.checkHandler}
          /> : null}
        </section>
      </>
    )
  }

}
