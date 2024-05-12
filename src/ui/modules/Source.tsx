import React from 'react'
import chroma from 'chroma-js'
import { uid } from 'uid'
import type {
  EditorType,
  Language,
  SourceColorConfiguration,
  ThirdParty,
  ImportUrl,
  PlanStatus,
} from '../../utils/types'
import Feature from '../components/Feature'
import { Message } from '@a_ng_d/figmug-ui'
import { FormItem } from '@a_ng_d/figmug-ui'
import { Input } from '@a_ng_d/figmug-ui'
import { Accordion } from '@a_ng_d/figmug-ui'
import { texts } from '@a_ng_d/figmug-ui'
import { SectionTitle } from '@a_ng_d/figmug-ui'
import { ColorItem } from '@a_ng_d/figmug-ui'
import Actions from './Actions'
import features from '../../utils/config'
import isBlocked from '../../utils/isBlocked'
import { locals } from '../../content/locals'

interface SourceProps {
  sourceColors: Array<SourceColorConfiguration>
  planStatus: PlanStatus
  editorType?: EditorType
  lang: Language
  onChangeColorsFromImport: (
    onChangeColorsFromImport: Array<SourceColorConfiguration>,
    source: ThirdParty
  ) => void
  onCreatePalette: () => void
}

interface SourceStates {
  coolorsUrl: ImportUrl
  realtimeColorsUrl: ImportUrl
  isCoolorsImportOpen: boolean
  isRealtimeColorsImportOpen: boolean
}

export default class Source extends React.Component<SourceProps, SourceStates> {
  constructor(props: SourceProps) {
    super(props)
    this.state = {
      coolorsUrl: {
        value: '' as string,
        state: 'DEFAULT' as 'DEFAULT' | 'ERROR',
        canBeSubmitted: false,
        helper: undefined,
      },
      isCoolorsImportOpen: false,
      realtimeColorsUrl: {
        value: '' as string,
        state: 'DEFAULT' as 'DEFAULT' | 'ERROR',
        canBeSubmitted: false,
        helper: undefined,
      },
      isRealtimeColorsImportOpen: false,
    }
  }

  componentWillUnmount(): void {
    this.setState({
      coolorsUrl: {
        value: '',
        state: 'DEFAULT',
        canBeSubmitted: false,
        helper: undefined,
      },
    })
  }

  // Handlers
  isTypingCoolorsUrlHandler = (e: React.SyntheticEvent) =>
    this.setState((state) => ({
      coolorsUrl: {
        value: (e.target as HTMLInputElement).value,
        state: !(e.target as HTMLInputElement).value.includes(
          'https://coolors.co'
        )
          ? 'DEFAULT'
          : state['coolorsUrl'].state,
        canBeSubmitted: (e.target as HTMLInputElement).value.includes(
          'https://coolors.co'
        )
          ? true
          : false,
        helper: !(e.target as HTMLInputElement).value.includes(
          'https://coolors.co'
        )
          ? {
              type: 'INFO',
              message: locals[this.props.lang].source.coolors.url.infoMessage,
            }
          : state['coolorsUrl'].helper,
      },
    }))

  isTypingRealtimeColorsUrlHandler = (e: React.SyntheticEvent) =>
    this.setState((state) => ({
      realtimeColorsUrl: {
        value: (e.target as HTMLInputElement).value,
        state: !(e.target as HTMLInputElement).value.includes(
          'https://www.realtimecolors.com'
        )
          ? 'DEFAULT'
          : state['realtimeColorsUrl'].state,
        canBeSubmitted: (e.target as HTMLInputElement).value.includes(
          'https://www.realtimecolors.com'
        )
          ? true
          : false,
        helper: !(e.target as HTMLInputElement).value.includes(
          'https://www.realtimecolors.com'
        )
          ? {
              type: 'INFO',
              message:
                locals[this.props.lang].source.realtimeColors.url.infoMessage,
            }
          : state['realtimeColorsUrl'].helper,
      },
    }))

  importColorsFromCoolorsHandler = () => {
    const url: string = this.state['coolorsUrl'].value,
      hexs = url.match(/([0-9a-fA-F]{6}-)+[0-9a-fA-F]{6}/)

    if (hexs != null) {
      this.props.onChangeColorsFromImport(
        hexs[0].split('-').map((hex) => {
          const gl = chroma(hex).gl()
          return {
            name: hex,
            rgb: {
              r: gl[0],
              g: gl[1],
              b: gl[2],
            },
            source: 'COOLORS',
            id: uid(),
          }
        }),
        'COOLORS'
      )
      this.setState({
        coolorsUrl: {
          value: '',
          state: 'DEFAULT',
          canBeSubmitted: false,
          helper: undefined,
        },
      })
    } else
      this.setState({
        coolorsUrl: {
          value: this.state['coolorsUrl'].value,
          state: 'ERROR',
          canBeSubmitted: this.state['coolorsUrl'].canBeSubmitted,
          helper: {
            type: 'ERROR',
            message: locals[this.props.lang].source.coolors.url.errorMessage,
          },
        },
      })
  }

  importColorsFromRealtimeColorsHandler = () => {
    const url: string = this.state['realtimeColorsUrl'].value,
      hexs = url.match(/([0-9a-fA-F]{6}-)+[0-9a-fA-F]{6}/)

    if (hexs != null) {
      this.props.onChangeColorsFromImport(
        hexs[0].split('-').map((hex) => {
          const gl = chroma(hex).gl()
          return {
            name: hex,
            rgb: {
              r: gl[0],
              g: gl[1],
              b: gl[2],
            },
            source: 'REALTIME_COLORS',
            id: uid(),
          }
        }),
        'REALTIME_COLORS'
      )
      this.setState({
        realtimeColorsUrl: {
          value: '',
          state: 'DEFAULT',
          canBeSubmitted: false,
          helper: undefined,
        },
      })
    } else
      this.setState({
        realtimeColorsUrl: {
          value: this.state['realtimeColorsUrl'].value,
          state: 'ERROR',
          canBeSubmitted: this.state['realtimeColorsUrl'].canBeSubmitted,
          helper: {
            type: 'ERROR',
            message:
              locals[this.props.lang].source.realtimeColors.url.errorMessage,
          },
        },
      })
  }

  // Templates
  SelectedColors = () => {
    return (
      <>
        <div className="section-controls">
          <div className="section-controls__left-part">
            <SectionTitle label={locals[this.props.lang].source.canvas.title} />
            <div className={`type ${texts.type}`}>{`(${
              this.props.sourceColors.filter(
                (sourceColor) => sourceColor.source === 'CANVAS'
              ).length
            })`}</div>
          </div>
          <div className="section-controls__right-part"></div>
        </div>
        {this.props.sourceColors.filter(
          (sourceColor) => sourceColor.source === 'CANVAS'
        ).length > 0 ? (
          <ul className="list">
            {this.props.sourceColors
              .filter((sourceColor) => sourceColor.source === 'CANVAS')
              .map((sourceColor) => {
                return (
                  <ColorItem
                    key={sourceColor.id}
                    name={sourceColor.name}
                    hex={chroma(
                      sourceColor.rgb.r * 255,
                      sourceColor.rgb.g * 255,
                      sourceColor.rgb.b * 255
                    )
                      .hex()
                      .toUpperCase()}
                    uuid={sourceColor.id}
                  />
                )
              })}
          </ul>
        ) : (
          <Message
            icon="info"
            messages={[locals[this.props.lang].source.canvas.tip]}
          />
        )}
      </>
    )
  }

  CoolorsColors = () => {
    return (
      <>
        <Accordion
          label={locals[this.props.lang].source.coolors.title}
          indicator={this.props.sourceColors
            .filter((sourceColor) => sourceColor.source === 'COOLORS')
            .length.toString()}
          helper={locals[this.props.lang].source.coolors.helper}
          isExpanded={this.state['isCoolorsImportOpen']}
          isBlocked={isBlocked('SOURCE_COOLORS', this.props.planStatus)}
          isNew={
            features.find((feature) => feature.name === 'SOURCE_COOLORS')?.isNew
          }
          onAdd={() => {
            this.setState({ isCoolorsImportOpen: true })
          }}
          onEmpty={() => {
            this.props.onChangeColorsFromImport([], 'COOLORS')
            this.setState({
              isCoolorsImportOpen: false,
              coolorsUrl: {
                value: '',
                state: 'DEFAULT',
                canBeSubmitted: false,
                helper: undefined,
              },
            })
          }}
        >
          <div className="settings__item">
            <FormItem
              id="coolors-palette-url"
              helper={this.state['coolorsUrl'].helper}
              shouldFill={false}
            >
              <Input
                type="TEXT"
                state={this.state['coolorsUrl'].state}
                placeholder={
                  locals[this.props.lang].source.coolors.url.placeholder
                }
                value={this.state['coolorsUrl'].value}
                onChange={this.isTypingCoolorsUrlHandler}
                onConfirm={() => {
                  if (this.state['coolorsUrl'].canBeSubmitted) {
                    this.importColorsFromCoolorsHandler()
                  }
                }}
                onBlur={() => {
                  if (this.state['coolorsUrl'].canBeSubmitted) {
                    this.importColorsFromCoolorsHandler()
                  }
                }}
              />
            </FormItem>
          </div>
          <ul className="list">
            {this.props.sourceColors
              .filter((sourceColor) => sourceColor.source === 'COOLORS')
              .map((sourceColor) => {
                return (
                  <ColorItem
                    key={sourceColor.id}
                    name={sourceColor.name}
                    hex={chroma(
                      sourceColor.rgb.r * 255,
                      sourceColor.rgb.g * 255,
                      sourceColor.rgb.b * 255
                    )
                      .hex()
                      .toUpperCase()}
                    uuid={sourceColor.id}
                  />
                )
              })}
          </ul>
        </Accordion>
      </>
    )
  }

  RealtimeColorsColors = () => {
    return (
      <>
        <Accordion
          label={locals[this.props.lang].source.realtimeColors.title}
          indicator={this.props.sourceColors
            .filter((sourceColor) => sourceColor.source === 'REALTIME_COLORS')
            .length.toString()}
          helper={locals[this.props.lang].source.realtimeColors.helper}
          isExpanded={this.state['isRealtimeColorsImportOpen']}
          isBlocked={isBlocked('SOURCE_REALTIME_COLORS', this.props.planStatus)}
          isNew={
            features.find(
              (feature) => feature.name === 'SOURCE_REALTIME_COLORS'
            )?.isNew
          }
          onAdd={() => {
            this.setState({ isRealtimeColorsImportOpen: true })
          }}
          onEmpty={() => {
            this.props.onChangeColorsFromImport([], 'REALTIME_COLORS')
            this.setState({
              isRealtimeColorsImportOpen: false,
              realtimeColorsUrl: {
                value: '',
                state: 'DEFAULT',
                canBeSubmitted: false,
                helper: undefined,
              },
            })
          }}
        >
          <div className="settings__item">
            <FormItem
              id="realtime-colors-url"
              helper={this.state['realtimeColorsUrl'].helper}
              shouldFill={false}
            >
              <Input
                type="TEXT"
                state={this.state['realtimeColorsUrl'].state}
                placeholder={
                  locals[this.props.lang].source.realtimeColors.url.placeholder
                }
                value={this.state['realtimeColorsUrl'].value}
                onChange={this.isTypingRealtimeColorsUrlHandler}
                onConfirm={() => {
                  if (this.state['realtimeColorsUrl'].canBeSubmitted) {
                    this.importColorsFromRealtimeColorsHandler()
                  }
                }}
                onBlur={() => {
                  if (this.state['realtimeColorsUrl'].canBeSubmitted) {
                    this.importColorsFromRealtimeColorsHandler()
                  }
                }}
              />
            </FormItem>
          </div>
          <ul className="list">
            {this.props.sourceColors
              .filter((sourceColor) => sourceColor.source === 'REALTIME_COLORS')
              .map((sourceColor) => {
                return (
                  <ColorItem
                    key={sourceColor.id}
                    name={sourceColor.name}
                    hex={chroma(
                      sourceColor.rgb.r * 255,
                      sourceColor.rgb.g * 255,
                      sourceColor.rgb.b * 255
                    )
                      .hex()
                      .toUpperCase()}
                    uuid={sourceColor.id}
                  />
                )
              })}
          </ul>
        </Accordion>
      </>
    )
  }

  // Render
  render() {
    return (
      <>
        <div className="controls__control controls__control--horizontal">
          <div className="control__block control__block--list">
            <Feature
              isActive={
                features.find((feature) => feature.name === 'SOURCE_CANVAS')
                  ?.isActive
              }
            >
              <this.SelectedColors />
            </Feature>
          </div>
          <div className="control__block control__block--no-padding">
            <Feature
              isActive={
                features.find((feature) => feature.name === 'SOURCE_COOLORS')
                  ?.isActive
              }
            >
              <this.CoolorsColors />
            </Feature>
            <Feature
              isActive={
                features.find(
                  (feature) => feature.name === 'SOURCE_REALTIME_COLORS'
                )?.isActive
              }
            >
              <this.RealtimeColorsColors />
            </Feature>
          </div>
        </div>
        <Actions
          context="CREATE"
          sourceColors={this.props.sourceColors}
          planStatus={this.props.planStatus}
          lang={this.props.lang}
          onCreatePalette={
            this.props.sourceColors.length > 0
              ? this.props.onCreatePalette
              : () => null
          }
        />
      </>
    )
  }
}
