import * as React from 'react'
import chroma from 'chroma-js'
import type {
  Language,
  PresetConfiguration,
  SourceColorConfiguration,
  TextColorsThemeHexModel,
} from '../../utils/types'
import Message from '../components/Message'
import Bar from '../components/Bar'
import Tabs from '../components/Tabs'
import Scale from '../modules/Scale'
import Settings from '../modules/Settings'
import { palette } from '../../utils/palettePackage'
import features from '../../utils/config'
import { locals } from '../../content/locals'
import Actions from '../modules/Actions'

interface Props {
  sourceColors: Array<SourceColorConfiguration> | []
  name: string
  description: string
  preset: PresetConfiguration
  colorSpace: string
  view: string
  textColorsTheme: TextColorsThemeHexModel
  planStatus: 'UNPAID' | 'PAID'
  lang: Language
  onChangePreset: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void
  onCustomPreset: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void
  onChangeSettings: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void
}

export default class CreatePalette extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props)
    this.state = {
      context:
        features.filter(
          (feature) =>
            feature.type === 'CONTEXT' &&
            feature.service.includes('CREATE') &&
            feature.isActive
        )[0] != undefined
          ? features.filter(
              (feature) =>
                feature.type === 'CONTEXT' &&
                feature.service.includes('CREATE') &&
                feature.isActive
            )[0].name
          : '',
    }
  }

  // Handlers
  navHandler = (e: React.SyntheticEvent) =>
    this.setState({
      context: (e.target as HTMLElement).dataset.feature,
    })

  // Direct actions
  onCreatePalette = () =>
    parent.postMessage({
      pluginMessage: {
        type: 'CREATE_PALETTE',
        data: {
          sourceColors: this.props.sourceColors,
          palette: palette,
        }
      }},
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
    let controls

    switch (this.state['context']) {
      case 'SOURCE': {
        controls = (
          <>
            <div className="list-controller controls__control controls__control--horizontal">
              <div className="controls__control__part">
                <div className="section-controls">
                  <div className="section-controls__left-part">
                    <div className="section-title">
                      {locals[this.props.lang].source.canvas.title}
                    </div>
                    <div className="type">{`(${this.props.sourceColors.filter(sourceColor => sourceColor.source === 'CANVAS').length})`}</div>
                  </div>
                  <div className="section-controls__right-part">
                  </div>
                </div>
                {
                  this.props.sourceColors.filter(sourceColor => sourceColor.source === 'CANVAS').length > 0
                  ? (
                    <ul className="list">
                      {this.props.sourceColors.map((sourceColor, index) => {
                        return (
                          <li
                            key={index}
                            className="list__item"
                          >
                            <div className="source-colors">
                              <div
                                className="source-colors__thumbnail"
                                style={{
                                  backgroundColor: `rgb(${sourceColor.rgb.r * 255}, ${sourceColor.rgb.g * 255}, ${sourceColor.rgb.b * 255})`
                                }}
                              ></div>
                              <div className="source-colors__name">
                                <div className="type">
                                  {sourceColor.name}
                                </div>
                                <div className="type type--secondary">
                                  {`(${
                                    chroma(sourceColor.rgb.r * 255, sourceColor.rgb.g * 255, sourceColor.rgb.b * 255)
                                      .hex()
                                      .toUpperCase()
                                  })`}
                                </div>
                              </div>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  )
                  : (
                    <Message
                      icon="list-tile"
                      messages={[locals[this.props.lang].onboarding.selectColor]}
                    />
                  )
                }   
              </div>
              <div className="controls__control__part">
                <div className="section-controls">
                  <div className="section-controls__left-part">
                    <div className="section-title">
                      {locals[this.props.lang].source.coolors.title}
                    </div>
                  </div>
                  <div className="section-controls__right-part">
                  </div>
                </div>
              </div>
            </div>
            <Actions
              context="CREATE"
              sourceColors={this.props.sourceColors}
              planStatus={this.props.planStatus}
              lang={this.props.lang}
              onCreatePalette={this.props.sourceColors.length > 0 ? this.onCreatePalette : () => null}
            />
          </>
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
