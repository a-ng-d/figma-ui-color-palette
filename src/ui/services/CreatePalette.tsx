import * as React from 'react'
import type {
  ColorBlindModeConfiguration,
  Language,
  PresetConfiguration,
  SourceColorConfiguration,
  TextColorsThemeHexModel,
} from '../../utils/types'
import { Bar } from '@a-ng-d/figmug.layouts.bar'
import { Tabs } from '@a-ng-d/figmug.actions.tabs'
import Scale from '../modules/Scale'
import Settings from '../modules/Settings'
import { palette } from '../../utils/palettePackage'
import features from '../../utils/config'
import { locals } from '../../content/locals'
import doLightnessScale from '../../utils/doLightnessScale'
import Source from '../modules/Source'

interface Props {
  sourceColors: Array<SourceColorConfiguration> | []
  name: string
  description: string
  preset: PresetConfiguration
  colorSpace: string
  colorBlindMode: ColorBlindModeConfiguration
  view: string
  textColorsTheme: TextColorsThemeHexModel
  planStatus: 'UNPAID' | 'PAID'
  lang: Language
  onChangeColorsFromCoolors: (
    sourceColorsFromCoolers: Array<SourceColorConfiguration>
  ) => void
  onChangePreset: (
    e: React.MouseEvent<HTMLLIElement, MouseEvent> | React.KeyboardEvent
  ) => void
  onCustomPreset: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void
  onChangeSettings: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void
}

export default class CreatePalette extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props)
    this.state = {
      context:
        this.setContexts()[0] != undefined ? this.setContexts()[0].id : '',
      coolorsUrl: '',
    }
  }

  // Handlers
  navHandler = (e: React.SyntheticEvent) =>
    this.setState({
      context: (e.target as HTMLElement).dataset.feature,
    })

  // Direct actions
  onCreatePalette = () =>
    parent.postMessage(
      {
        pluginMessage: {
          type: 'CREATE_PALETTE',
          data: {
            sourceColors: this.props.sourceColors,
            palette: palette,
          },
        },
      },
      '*'
    )

  setContexts = () => {
    const contexts: Array<{
      label: string
      id: string
    }> = []
    if (features.find((feature) => feature.name === 'SOURCE')?.isActive)
      contexts.push({
        label: locals[this.props.lang].contexts.source,
        id: 'SOURCE',
      })
    if (features.find((feature) => feature.name === 'SCALE')?.isActive)
      contexts.push({
        label: locals[this.props.lang].contexts.scale,
        id: 'SCALE',
      })
    if (features.find((feature) => feature.name === 'SETTINGS')?.isActive)
      contexts.push({
        label: locals[this.props.lang].contexts.settings,
        id: 'SETTINGS',
      })
    return contexts
  }

  // Renders
  render() {
    palette.preset = this.props.preset
    palette.scale = doLightnessScale(
      this.props.preset.scale,
      this.props.preset.min ?? 0,
      this.props.preset.max ?? 100
    )
    let controls

    switch (this.state['context']) {
      case 'SOURCE': {
        controls = (
          <Source
            sourceColors={this.props.sourceColors}
            planStatus={this.props.planStatus}
            lang={this.props.lang}
            onChangeColorsFromCoolors={this.props.onChangeColorsFromCoolors}
            onCreatePalette={this.onCreatePalette}
          />
        )
        break
      }
      case 'SCALE': {
        controls = (
          <Scale
            sourceColors={this.props.sourceColors}
            hasPreset={true}
            preset={this.props.preset}
            planStatus={this.props.planStatus}
            lang={this.props.lang}
            onChangePreset={this.props.onChangePreset}
            onChangeScale={() => null}
            onAddStop={this.props.onCustomPreset}
            onRemoveStop={this.props.onCustomPreset}
            onCreatePalette={this.onCreatePalette}
          />
        )
        break
      }
      case 'SETTINGS': {
        controls = (
          <Settings
            context="CREATE"
            sourceColors={this.props.sourceColors}
            name={this.props.name}
            description={this.props.description}
            colorSpace={this.props.colorSpace}
            colorBlindMode={this.props.colorBlindMode}
            textColorsTheme={this.props.textColorsTheme}
            view={this.props.view}
            planStatus={this.props.planStatus}
            lang={this.props.lang}
            onChangeSettings={this.props.onChangeSettings}
            onCreatePalette={this.onCreatePalette}
          />
        )
        break
      }
    }

    return (
      <>
        <Bar
          leftPart={
            <Tabs
              tabs={this.setContexts()}
              active={this.state['context']}
              action={this.navHandler}
            />
          }
          border={['BOTTOM']}
          isOnlyText={true}
        />
        <section className="controller">
          <div className="controls">{controls}</div>
        </section>
      </>
    )
  }
}
