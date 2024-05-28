import { Bar, Tabs } from '@a_ng_d/figmug-ui'
import React from 'react'

import { locals } from '../../content/locals'
import features from '../../utils/config'
import doLightnessScale from '../../utils/doLightnessScale'
import { palette } from '../../utils/palettePackage'
import type {
  ColorSpaceConfiguration,
  Language,
  NamingConventionConfiguration,
  PlanStatus,
  PresetConfiguration,
  SourceColorConfiguration,
  TextColorsThemeHexModel,
  ThirdParty,
  UserSession,
  ViewConfiguration,
  VisionSimulationModeConfiguration,
} from '../../utils/types'
import type { AppStates } from '../App'
import Palettes from '../contexts/Palettes'
import Scale from '../contexts/Scale'
import Settings from '../contexts/Settings'
import Source from '../contexts/Source'

interface CreatePaletteProps {
  sourceColors: Array<SourceColorConfiguration> | []
  name: string
  description: string
  preset: PresetConfiguration
  namingConvention: NamingConventionConfiguration
  colorSpace: ColorSpaceConfiguration
  visionSimulationMode: VisionSimulationModeConfiguration
  view: ViewConfiguration
  textColorsTheme: TextColorsThemeHexModel
  planStatus: PlanStatus
  userSession: UserSession
  lang: Language
  onChangeColorsFromImport: React.Dispatch<Partial<AppStates>>
  onChangePreset: React.Dispatch<Partial<AppStates>>
  onCustomPreset: React.Dispatch<Partial<AppStates>>
  onChangeSettings: React.Dispatch<Partial<AppStates>>
}

interface CreatePaletteStates {
  context: string | undefined
}

export default class CreatePalette extends React.Component<
  CreatePaletteProps,
  CreatePaletteStates
> {
  constructor(props: CreatePaletteProps) {
    super(props)
    this.state = {
      context:
        this.setContexts()[0] !== undefined ? this.setContexts()[1].id : '',
    }
  }

  // Handlers
  navHandler = (e: React.SyntheticEvent) =>
    this.setState({
      context: (e.target as HTMLElement).dataset.feature,
    })

  colorsFromImportHandler = (
    sourceColorsFromImport: Array<SourceColorConfiguration>,
    source: ThirdParty
  ) => {
    this.props.onChangeColorsFromImport({
      sourceColors: this.props.sourceColors
        .filter(
          (sourceColors: SourceColorConfiguration) =>
            sourceColors.source !== source
        )
        .concat(sourceColorsFromImport),
    })
  }

  // Direct actions
  onCreatePalette = () =>
    parent.postMessage(
      {
        pluginMessage: {
          type: 'CREATE_PALETTE',
          data: {
            sourceColors: this.props.sourceColors,
            palette: {
              ...palette,
              algoritmVersion: 'v2',
            },
          },
        },
      },
      '*'
    )

  setContexts = () => {
    const contexts: Array<{
      label: string
      id: string
      isUpdated: boolean
    }> = []
    if (features.find((feature) => feature.name === 'PALETTES')?.isActive)
      contexts.push({
        label: locals[this.props.lang].contexts.palettes,
        id: 'PALETTES',
        isUpdated:
          features.find((feature) => feature.name === 'PALETTES')?.isNew ??
          false,
      })
    if (features.find((feature) => feature.name === 'SOURCE')?.isActive)
      contexts.push({
        label: locals[this.props.lang].contexts.source,
        id: 'SOURCE',
        isUpdated:
          features.find((feature) => feature.name === 'SOURCE')?.isNew ?? false,
      })
    if (features.find((feature) => feature.name === 'SCALE')?.isActive)
      contexts.push({
        label: locals[this.props.lang].contexts.scale,
        id: 'SCALE',
        isUpdated:
          features.find((feature) => feature.name === 'SCALE')?.isNew ?? false,
      })
    if (features.find((feature) => feature.name === 'SETTINGS')?.isActive)
      contexts.push({
        label: locals[this.props.lang].contexts.settings,
        id: 'SETTINGS',
        isUpdated:
          features.find((feature) => feature.name === 'SETTINGS')?.isNew ??
          false,
      })
    return contexts
  }

  // Renders
  render() {
    palette.preset = this.props.preset
    palette.min = this.props.preset.min
    palette.max = this.props.preset.max
    palette.scale = doLightnessScale(
      this.props.preset.scale,
      this.props.preset.min ?? 0,
      this.props.preset.max ?? 100
    )
    let controls

    switch (this.state['context']) {
      case 'PALETTES': {
        controls = (
          <Palettes
            {...this.props}
          />
        )
        break
      }
      case 'SOURCE': {
        controls = (
          <Source
            {...this.props}
            onChangeColorsFromImport={this.colorsFromImportHandler}
            onCreatePalette={this.onCreatePalette}
          />
        )
        break
      }
      case 'SCALE': {
        controls = (
          <Scale
            hasPreset={true}
            {...this.props}
            onChangeScale={() => null}
            onCreatePalette={this.onCreatePalette}
          />
        )
        break
      }
      case 'SETTINGS': {
        controls = (
          <Settings
            context="CREATE"
            {...this.props}
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
              active={this.state['context'] ?? ''}
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
