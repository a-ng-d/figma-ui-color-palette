import * as React from 'react'
import type {
  PresetConfiguration,
  TextColorsThemeHexModel,
} from '../../utils/types'
import Tabs from '../components/Tabs'
import Scale from '../modules/Scale'
import Settings from '../modules/Settings'
import About from '../modules/About'
import { palette } from '../../utils/palettePackage'
import features from '../../utils/features'
import { locals } from '../../content/locals'

interface Props {
  paletteName: string
  preset: PresetConfiguration
  view: string
  textColorsTheme: TextColorsThemeHexModel
  planStatus: string
  onReopenHighlight: React.ChangeEventHandler
  onChangePreset: React.ChangeEventHandler
  onCustomPreset: React.ChangeEventHandler
  onChangeView: (view: string) => void
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
            feature.service.includes('CREATE') &&
            feature.isActive
        )[0] != undefined
          ? features
              .filter(
                (feature) =>
                  feature.type === 'CONTEXT' &&
                  feature.service.includes('CREATE') &&
                  feature.isActive
              )[0].name
          : '',
    }
  }

  // Handlers
  presetHandler = (e) => this.props.onChangePreset(e)

  scaleHandler = (e) => this.props.onCustomPreset(e)

  settingsHandler = (e) => this.props.onChangeSettings(e)

  viewHandler = (e) => {
    if (e.target.dataset.isBlocked === 'false') {
      palette.view = e.target.dataset.value
      this.props.onChangeView(e.target.dataset.value)
    }
  }

  navHandler = (e: React.SyntheticEvent) =>
    this.setState({
      context: (e.target as HTMLElement).dataset.feature,
    })

  // Direct actions
  onCreate = () =>
    parent.postMessage(
      { pluginMessage: { type: 'CREATE_PALETTE', data: palette } },
      '*'
    )

  setPrimaryContexts = () => {
    const contexts: Array<{
      label: string
      id: string
    }> = []
    if (features.find((feature) => feature.name === 'SCALE').isActive)
      contexts.push({
        label: locals.en.contexts.scale,
        id: 'SCALE'
      })
    if (features.find((feature) => feature.name === 'SETTINGS').isActive)
      contexts.push({
        label: locals.en.contexts.settings,
        id: 'SETTINGS'
      })
    return contexts
  }

  setSecondaryContexts = () => {
    const contexts: Array<{
      label: string
      id: string
    }> = []
    if (features.find((feature) => feature.name === 'ABOUT').isActive)
      contexts.push({
        label: locals.en.contexts.about,
        id: 'ABOUT'
      })
    return contexts
  }

  // Renders
  render() {
    palette.preset = this.props.preset
    let controls

    switch (this.state['context']) {
      case 'SCALE': {
        controls = (
          <Scale
            hasPreset={true}
            preset={this.props.preset}
            view={this.props.view}
            planStatus={this.props.planStatus}
            onChangePreset={this.presetHandler}
            onChangeScale={() => null}
            onAddStop={this.scaleHandler}
            onRemoveStop={this.scaleHandler}
            onChangeView={this.viewHandler}
            onCreatePalette={this.onCreate}
            onReopenHighlight={this.props.onReopenHighlight}
          />
        )
        break
      }
      case 'SETTINGS': {
        controls = (
          <Settings
            paletteName={this.props.paletteName}
            textColorsTheme={this.props.textColorsTheme}
            settings={['BASE', 'CONTRAST_MANAGEMENT']}
            context="CREATE"
            view={this.props.view}
            planStatus={this.props.planStatus}
            onChangeSettings={this.settingsHandler}
            onCreatePalette={this.onCreate}
            onChangeView={this.viewHandler}
            onReopenHighlight={this.props.onReopenHighlight}
          />
        )
        break
      }
      case 'About': {
        controls = <About planStatus={this.props.planStatus} />
      }
    }

    return (
      <>
        <Tabs
          primaryTabs={this.setPrimaryContexts()}
          secondaryTabs={this.setSecondaryContexts()}
          active={this.state['context']}
          action={this.navHandler}
        />
        <section>
          <div className="controls">{controls}</div>
        </section>
      </>
    )
  }
}
