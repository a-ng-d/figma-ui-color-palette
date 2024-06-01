import {
  Accordion,
  Bar,
  Button,
  ColorItem,
  FormItem,
  Icon,
  Input,
  Message,
  SectionTitle,
  Tabs,
  texts,
} from '@a_ng_d/figmug-ui'
import chroma from 'chroma-js'
import React from 'react'
import { uid } from 'uid'

import { locals } from '../../content/locals'
import { EditorType, Language, PlanStatus } from '../../types/app'
import { SourceColorConfiguration } from '../../types/configurations'
import { ColourLovers } from '../../types/data'
import { ContextItem, ImportUrl, ThirdParty } from '../../types/management'
import features, { pageSize } from '../../utils/config'
import isBlocked from '../../utils/isBlocked'
import { setContexts } from '../../utils/setContexts'
import Feature from '../components/Feature'
import PaletteItem from '../components/PaletteItem'
import Actions from '../modules/Actions'

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
  context: string | undefined
  coolorsUrl: ImportUrl
  realtimeColorsUrl: ImportUrl
  isCoolorsImportOpen: boolean
  isRealtimeColorsImportOpen: boolean
  isColourLoversImportOpen: boolean
  colourLoversPaletteListStatus:
    | 'LOADING'
    | 'LOADED'
    | 'EMPTY'
    | 'ERROR'
    | 'FULL'
    | 'SIGN_IN_FIRST'
  currentPage: number
  isLoadMoreActionLoading: boolean
  colourLoversPaletteList: Array<ColourLovers>
}

export default class Source extends React.Component<SourceProps, SourceStates> {
  contexts: Array<ContextItem>

  constructor(props: SourceProps) {
    super(props)
    this.contexts = setContexts(['SOURCE_OVERVIEW', 'SOURCE_EXPLORE'])
    this.state = {
      context: this.contexts[0] !== undefined ? this.contexts[0].id : '',
      coolorsUrl: {
        value: '' as string,
        state: 'DEFAULT' as 'DEFAULT' | 'ERROR',
        canBeSubmitted: false,
        helper: undefined,
      },
      isCoolorsImportOpen:
        this.props.sourceColors.filter((color) => color.source === 'COOLORS')
          .length > 0,
      realtimeColorsUrl: {
        value: '' as string,
        state: 'DEFAULT' as 'DEFAULT' | 'ERROR',
        canBeSubmitted: false,
        helper: undefined,
      },
      isRealtimeColorsImportOpen:
        this.props.sourceColors.filter(
          (color) => color.source === 'REALTIME_COLORS'
        ).length > 0,
      isColourLoversImportOpen:
        this.props.sourceColors.filter(
          (color) => color.source === 'COLOUR_LOVERS'
        ).length > 0,
      colourLoversPaletteListStatus: 'LOADING',
      currentPage: 1,
      isLoadMoreActionLoading: false,
      colourLoversPaletteList: [],
    }
  }

  // Lifecycle
  componentDidUpdate = (
    prevProps: Readonly<SourceProps>,
    prevState: Readonly<SourceStates>
  ): void => {
    if (
      prevState.currentPage !== this.state['currentPage'] ||
      this.state['colourLoversPaletteListStatus'] !== 'LOADED'
    ) {
      this.callUICPAgent()
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
      realtimeColorsUrl: {
        value: '',
        state: 'DEFAULT',
        canBeSubmitted: false,
        helper: undefined,
      },
    })
  }

  //Direct actions
  callUICPAgent = async () => {
    return fetch(
      'https://corsproxy.io/?' +
        encodeURIComponent(
          `https://www.colourlovers.com/api/palettes?format=json&numResults=${pageSize}&resultOffset=${
            this.state['currentPage'] - 1
          }`
        ),
      {
        cache: 'no-cache',
        credentials: 'omit',
      }
    )
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          colourLoversPaletteListStatus: data.length > 0 ? 'LOADED' : 'FULL',
          colourLoversPaletteList:
            this.state['colourLoversPaletteList'].concat(data),
        })
      )
      .finally(() =>
        this.setState({
          isLoadMoreActionLoading: false,
        })
      )
      .catch(() =>
        this.setState({
          colourLoversPaletteListStatus: 'ERROR',
        })
      )
  }

  // Handlers
  navHandler = (e: React.SyntheticEvent) =>
    this.setState({
      context: (e.target as HTMLElement).dataset.feature,
    })

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

    if (hexs !== null) {
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
            isRemovable: false,
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

    if (hexs !== null) {
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
            isRemovable: false,
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
            <SectionTitle
              label={locals[this.props.lang].source.canvas.title}
              indicator={
                this.props.sourceColors.filter(
                  (sourceColor) => sourceColor.source === 'CANVAS'
                ).length
              }
            />
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
                    canBeRemoved={sourceColor.isRemovable}
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
                isAutoFocus={true}
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
                isAutoFocus={true}
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

  ColourLoversColors = () => {
    return (
      <>
        <Accordion
          label={locals[this.props.lang].source.colourLovers.title}
          indicator={this.props.sourceColors
            .filter((sourceColor) => sourceColor.source === 'COLOUR_LOVERS')
            .length.toString()}
          icon="adjust"
          helper={locals[this.props.lang].source.colourLovers.helper}
          isExpanded={this.state['isColourLoversImportOpen']}
          isBlocked={isBlocked('SOURCE_EXPLORE', this.props.planStatus)}
          isNew={
            features.find((feature) => feature.name === 'SOURCE_EXPLORE')?.isNew
          }
          onAdd={() => {
            this.setState({
              context: 'SOURCE_EXPLORE',
            })
          }}
          onEmpty={() => {
            this.props.onChangeColorsFromImport([], 'COLOUR_LOVERS')
            this.setState({
              isColourLoversImportOpen: false,
            })
          }}
        >
          <ul className="list">
            {this.props.sourceColors
              .filter((sourceColor) => sourceColor.source === 'COLOUR_LOVERS')
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

  ExternalSourceColorsList = () => {
    return (
      <ul className="rich-list">
        {this.state['colourLoversPaletteList'].map((palette, index: number) => (
          <PaletteItem
            id={palette.id?.toString() ?? ''}
            key={`source-colors-${index}`}
            src={palette.imageUrl?.replace('http', 'https')}
            title={palette.title}
            subtitle={`#${palette.rank}`}
            info={`${palette.numVotes} votes, ${palette.numViews} views, ${palette.numComments} comments`}
            user={{
              avatar: undefined,
              name: palette.userName ?? '',
            }}
            action={() => null}
          >
            <div className="snackbar">
              <Button
                type="icon"
                icon="link-connected"
                action={() =>
                  parent.postMessage(
                    {
                      pluginMessage: {
                        type: 'OPEN_IN_BROWSER',
                        url: palette.url?.replace('http', 'https'),
                      },
                    },
                    '*'
                  )
                }
              />
              <Button
                type="secondary"
                label={locals[this.props.lang].actions.addToSource}
                action={() => {
                  this.setState({
                    context: 'SOURCE_OVERVIEW',
                    isColourLoversImportOpen: true,
                  })
                  this.props.onChangeColorsFromImport(
                    palette.colors.map((color) => {
                      const gl = chroma(color).gl()
                      return {
                        name: color,
                        rgb: {
                          r: gl[0],
                          g: gl[1],
                          b: gl[2],
                        },
                        id: uid(),
                        source: 'COLOUR_LOVERS',
                        isRemovable: true,
                      }
                    }),
                    'COLOUR_LOVERS'
                  )
                }}
              />
            </div>
          </PaletteItem>
        ))}
        <div className="list-control">
          {this.state['colourLoversPaletteListStatus'] === 'LOADED' ? (
            <Button
              type="secondary"
              label={locals[this.props.lang].palettes.lazyLoad.loadMore}
              isLoading={this.state['isLoadMoreActionLoading']}
              action={() =>
                this.setState({
                  isLoadMoreActionLoading: true,
                  currentPage: this.state['currentPage'] + pageSize,
                })
              }
            />
          ) : (
            <div className={`${texts['type--secondary']} type`}>
              {locals[this.props.lang].palettes.lazyLoad.completeList}
            </div>
          )}
        </div>
      </ul>
    )
  }

  // Render
  render() {
    let controls

    switch (this.state['context']) {
      case 'SOURCE_OVERVIEW': {
        controls = (
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
              <Feature
                isActive={
                  features.find((feature) => feature.name === 'SOURCE_EXPLORE')
                    ?.isActive
                }
              >
                <this.ColourLoversColors />
              </Feature>
            </div>
          </div>
        )
        break
      }
      case 'SOURCE_EXPLORE': {
        controls =
          this.state['colourLoversPaletteListStatus'] !== 'LOADING' ? (
            <div className="controls__control controls__control--horizontal">
              {this.state['colourLoversPaletteListStatus'] === 'LOADED' ||
              this.state['colourLoversPaletteListStatus'] === 'FULL' ? (
                <div className="controls__control">
                  <div className="control__block control__block--no-padding">
                    <this.ExternalSourceColorsList />
                  </div>
                </div>
              ) : (
                <div className="onboarding__callout--centered">
                  <Message
                    icon="warning"
                    messages={[locals[this.props.lang].error.fetchPalette]}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="controls__control controls__control--horizontal">
              <Icon
                type="PICTO"
                iconName="spinner"
                customClassName="control__block__loader"
              />
            </div>
          )
        break
      }
    }

    return (
      <>
        <Bar
          leftPart={
            <Tabs
              tabs={this.contexts}
              active={this.state['context'] ?? ''}
              action={this.navHandler}
            />
          }
          border={['BOTTOM']}
          isOnlyText={true}
        />
        {controls}
        <Actions
          context="CREATE"
          {...this.props}
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
