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
  paletteName: string;
  onCaptionsChange: any;
  onGoingStep: string;
  onPresetChange: any;
  onCustomPreset: any;
  onSettingsChange: any
};

export default class CreatePalette extends React.Component<Props> {

  constructor(props) {
    super(props);
    this.state = {
      context: 'Scale'
    }
  }

  // Handlers
  slideHandler = () => { }

  checkHandler = (e: any) => {
    this.props.onCaptionsChange(e.target.checked);
    palette.captions = e.target.checked
  }

  navHandler = (e: any) => this.setState({ context: e.target.innerText })

  presetHandler = (e: any) => this.props.onPresetChange(e)

  scaleHandler = (e: any) => this.props.onCustomPreset(e)

  settingsHandler = (e: any) => this.props.onSettingsChange(e)

  // Direct actions
  onCreate = () => parent.postMessage({ pluginMessage: { type: 'create-palette', palette } }, '*')

  render() {
    palette.captions = this.props.hasCaptions;
    palette.preset = this.props.preset;
    let actions, controls;

    if (this.state['context'] === 'About')
      actions = null
    else
      actions =
        <Actions
          context='create'
          hasCaptions={this.props.hasCaptions}
          onCreatePalette={this.onCreate}
          onChangeCaptions={this.checkHandler}
        />

    switch (this.state['context']) {
      case 'Scale':
        controls =
          <Scale
            hasPreset={true}
            preset={this.props.preset}
            onChangePreset={this.presetHandler}
            onScaleChange={this.slideHandler}
            onAddScale={this.scaleHandler}
            onRemoveScale={this.scaleHandler}
            onGoingStep={this.props.onGoingStep}
          />;
        break;

        case 'Settings':
          controls =
              <Settings
                paletteName={this.props.paletteName}
                onSettingsChange={this.settingsHandler}
              />;
            break;

        case 'About':
          controls = <About />
      }

    return (
      <>
        <Tabs
          primaryTabs={['Scale', 'Settings']}
          secondaryTabs={['About']}
          active={this.state['context']}
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
