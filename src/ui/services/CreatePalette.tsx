import * as React from 'react';
import Tabs from '../components/Tabs';
import Scale from '../modules/Scale';
import Settings from '../modules/Settings';
import About from '../modules/About';
import Actions from '../modules/Actions';
import { palette, presets } from '../../utils/palettePackage';

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

  // Handlers
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

  // Direct actions
  onCreate = () => parent.postMessage({ pluginMessage: { type: 'create-palette', palette } }, '*')

  render() {
    palette.captions = this.props.hasCaptions;
    palette.preset = this.props.preset;
    let actions, controls;

    if (this.props.context === 'About')
      actions = null
    else
      actions =
        <Actions
          context='create'
          hasCaptions={this.props.hasCaptions}
          exportType= {null}
          onCreatePalette={this.onCreate}
          onCreateLocalColors={null}
          onUpdateLocalColors={null}
          onChangeCaptions={this.checkHandler}
          onExportPalette={null}
        />

    switch (this.props.context) {
      case 'Scale':
        controls =
          <Scale
            hasPreset={true}
            preset={this.props.preset}
            scale={null}
            onChangePreset={this.presetHandler}
            onScaleChange={this.slideHandler}
            onAddScale={this.scaleHandler}
            onRemoveScale={this.scaleHandler}
            onGoingStep={this.props.onGoingStep}
          />;
        break;

        case 'Settings':
          controls = <Settings />;
          break;

        case 'About':
          controls = <About />
      }

    return (
      <>
        <Tabs
          primaryTabs={['Scale', 'Settings']}
          secondaryTabs={['About']}
          active={this.props.context}
          onClick={this.navHandler}
        />
        <section>
          <div className='controls'>
            {controls}
          </div>
          {actions}
        </section>
      </>
    )
  }

}
