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
import features from '../../utils/features'

interface Props {
  paletteName: string
  preset: PresetConfiguration
  textColorsTheme: TextColorsThemeHexModel
  planStatus: string
  onReopenHighlight: React.ChangeEventHandler
  onChangePreset: React.ChangeEventHandler
  onCustomPreset: React.ChangeEventHandler
  onChangeSettings: React.ChangeEventHandler
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
          : ''
    }
  }

  // Handlers
  presetHandler = (e) => this.props.onChangePreset(e)

  scaleHandler = (e) => this.props.onCustomPreset(e)
  
  slideHandler = () => {
    return
  }

  settingsHandler = (e) => this.props.onChangeSettings(e)

  viewHandler = (e) => {
    if (e.target[e.target.selectedIndex].dataset.isBlocked === 'false')
      palette.view = e.target.value
  }

  navHandler = (e: React.SyntheticEvent) =>
    this.setState({
      context: (e.target as HTMLElement).innerText
    })

  // Direct actions
  onCreate = () =>
    parent.postMessage(
      { pluginMessage: { type: 'CREATE_PALETTE', data: palette } },
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
    palette.preset = this.props.preset
    let actions, controls, help

    if (this.state['context'] === 'About') {
      actions = help = null
    } else {
      actions = (
        <Actions
          context="create"
          planStatus={this.props.planStatus}
          onCreatePalette={this.onCreate}
          onChangeView={this.viewHandler}
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
                action: this.props.onReopenHighlight,
              },
            ]}
            planStatus={this.props.planStatus}
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
            planStatus={this.props.planStatus}
            onChangeSettings={this.settingsHandler}
          />
        )
        break
      }
      case 'About': {
        controls =
          <About
            planStatus={this.props.planStatus}
          />
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
        </section>
        {actions}
        {help}
      </>
    )
  }
}
