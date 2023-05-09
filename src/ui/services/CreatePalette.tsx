import * as React from 'react'
import type {
  PresetConfiguration,
  TextColorsThemeHexModel,
} from '../../utils/types'
import Feature from '../components/Feature'
import Tabs from '../components/Tabs'
import Scale from '../modules/Scale'
import Settings from '../modules/Settings'
import About from '../modules/About'
import Actions from '../modules/Actions'
import Shortcuts from '../modules/Shortcuts'
import { palette } from '../../utils/palettePackage'
import { features } from '../../utils/features'

interface Props {
  hasProperties: boolean
  preset: PresetConfiguration
  paletteName: string
  textColorsTheme: TextColorsThemeHexModel
  onHighlightReopen: React.ChangeEventHandler
  onPresetChange: React.ChangeEventHandler
  onCustomPreset: React.ChangeEventHandler
  onSettingsChange: React.ChangeEventHandler
}

export default class CreatePalette extends React.Component<Props> {
  constructor(props) {
    super(props)
    this.state = {
      context:
        features.filter(
          (feature) =>
            feature.type === 'CONTEXT' &&
            feature.service.includes('create') &&
            feature.isActive
        )[0] != undefined
          ? features
              .filter(
                (feature) =>
                  feature.type === 'CONTEXT' &&
                  feature.service.includes('create') &&
                  feature.isActive
              )[0]
              .name.charAt(0) +
            features
              .filter(
                (feature) =>
                  feature.type === 'CONTEXT' &&
                  feature.service.includes('create') &&
                  feature.isActive
              )[0]
              .name.slice(1)
              .toLowerCase()
          : '',
      hasProperties: true,
    }
  }

  // Handlers
  slideHandler = () => {
    return
  }

  checkHandler = (e) => {
    this.setState({
      hasProperties: e.target.checked,
      onGoingStep: 'properties changed',
    })
    palette.properties = e.target.checked
  }

  navHandler = (e: React.SyntheticEvent) =>
    this.setState({
      context: (e.target as HTMLElement).innerText,
      onGoingStep: 'tab changed',
    })

  presetHandler = (e) => this.props.onPresetChange(e)

  scaleHandler = (e) => this.props.onCustomPreset(e)

  settingsHandler = (e) => this.props.onSettingsChange(e)

  // Direct actions
  onCreate = () =>
    parent.postMessage(
      { pluginMessage: { type: 'create-palette', data: palette } },
      '*'
    )

  setPrimaryContexts = () => {
    const contexts: Array<string> = []
    if (features.find((feature) => feature.name === 'SCALE').isActive)
      contexts.push('Scale')
    if (features.find((feature) => feature.name === 'SETTINGS').isActive)
      contexts.push('Settings')
    return contexts
  }

  setSecondaryContexts = () => {
    const contexts: Array<string> = []
    if (features.find((feature) => feature.name === 'ABOUT').isActive)
      contexts.push('About')
    return contexts
  }

  // Renders
  render() {
    palette.properties = this.state['hasProperties']
    palette.preset = this.props.preset
    let actions, controls, help

    if (this.state['context'] === 'About') {
      actions = help = null
    } else {
      actions = (
        <Actions
          context="create"
          hasProperties={this.state['hasProperties']}
          onCreatePalette={this.onCreate}
          onChangeProperties={this.checkHandler}
        />
      )

      help = (
        <Feature
          isActive={
            features.find((feature) => feature.name === 'SHORTCUTS').isActive
          }
        >
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
                url: 'https://uicp.link/feedback',
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
        </Feature>
      )
    }

    switch (this.state['context']) {
      case 'Scale': {
        controls = (
          <Scale
            hasPreset={true}
            preset={this.props.preset}
            onChangePreset={this.presetHandler}
            onChangeScale={this.slideHandler}
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
            textColorsTheme={this.props.textColorsTheme}
            settings={['base', 'contrast-management']}
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
          primaryTabs={this.setPrimaryContexts()}
          secondaryTabs={this.setSecondaryContexts()}
          active={this.state['context']}
          onClick={this.navHandler}
        />
        <section className="section--scrollable">
          <div className="controls">{controls}</div>
          {actions}
        </section>
        {help}
      </>
    )
  }
}
