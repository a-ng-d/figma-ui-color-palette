import * as React from 'react'
import Tabs from '../components/Tabs'
import Scale from '../modules/Scale'
import Settings from '../modules/Settings'
import About from '../modules/About'
import Actions from '../modules/Actions'
import Shortcuts from '../modules/Shortcuts'
import { palette } from '../../utils/palettePackage'

interface Props {
  hasCaptions: boolean
  preset: any
  paletteName: string
  onHighlightReopen: any
  onPresetChange: any
  onCustomPreset: any
  onSettingsChange: any
}

export default class CreatePalette extends React.Component<Props> {
  constructor(props) {
    super(props)
    this.state = {
      context: 'Scale',
      hasCaptions: true,
    }
  }

  // Handlers
  slideHandler = () => {
    return
  }

  checkHandler = (e: any) => {
    this.setState({
      hasCaptions: e.target.checked,
      onGoingStep: 'captions changed',
    })
    palette.captions = e.target.checked
  }

  navHandler = (e: any) =>
    this.setState({
      context: e.target.innerText,
      onGoingStep: 'tab changed',
    })

  presetHandler = (e: any) => this.props.onPresetChange(e)

  scaleHandler = (e: any) => this.props.onCustomPreset(e)

  settingsHandler = (e: any) => this.props.onSettingsChange(e)

  // Direct actions
  onCreate = () =>
    parent.postMessage(
      { pluginMessage: { type: 'create-palette', data: palette } },
      '*'
    )
  
  // Renders
  render() {
    palette.captions = this.state['hasCaptions']
    palette.preset = this.props.preset
    let actions, controls, help

    if (this.state['context'] === 'About') {
      actions = help = null
    } else {
      actions = (
        <Actions
          context="create"
          hasCaptions={this.state['hasCaptions']}
          onCreatePalette={this.onCreate}
          onChangeCaptions={this.checkHandler}
        />
      )

      help = (
        <Shortcuts
          actions={[
            {
              label: 'Read the documentation',
              isLink: true,
              url: 'https://docs.ui-color-palette.com',
              action: null,
            },
            {
              label: 'Give feedback',
              isLink: true,
              url: 'https://kutt.it/voice-of-uicp-users',
              action: null,
            },
            {
              label: "What's new",
              isLink: false,
              url: '',
              action: this.props.onHighlightReopen,
            },
          ]}
        />
      )
    }

    switch (this.state['context']) {
      case 'Scale': {
        controls = (
          <Scale
            hasPreset={true}
            preset={this.props.preset}
            onChangePreset={this.presetHandler}
            onScaleChange={this.slideHandler}
            onAddScale={this.scaleHandler}
            onRemoveScale={this.scaleHandler}
            onGoingStep={this.state['onGoingStep']}
          />
        )
        break
      }
      case 'Settings': {
        controls = (
          <Settings
            paletteName={this.props.paletteName}
            onSettingsChange={this.settingsHandler}
          />
        )
        break
      }
      case 'About': {
        controls = <About />
      }
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
          <div className="controls">{controls}</div>
          {actions}
        </section>
        {help}
      </>
    )
  }
}
