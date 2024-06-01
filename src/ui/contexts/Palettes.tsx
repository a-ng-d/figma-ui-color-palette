import {
  Bar,
  Button,
  HexModel,
  Icon,
  Input,
  Message,
  Tabs,
  texts,
} from '@a_ng_d/figmug-ui'
import React from 'react'

import { signIn, supabase } from '../../bridges/publication/authentication'
import { locals } from '../../content/locals'
import { Language, PlanStatus } from '../../types/app'
import {
  ColorConfiguration,
  MetaConfiguration,
  PaletteConfiguration,
  SourceColorConfiguration,
  ThemeConfiguration,
} from '../../types/configurations'
import { ExternalPalettes } from '../../types/data'
import { ContextItem } from '../../types/management'
import { ActionsList } from '../../types/models'
import { UserSession } from '../../types/user'
import features, { pageSize, palettesDbTableName } from '../../utils/config'
import { setContexts } from '../../utils/setContexts'
import Feature from '../components/Feature'
import PaletteItem from '../components/PaletteItem'

interface PalettesProps {
  userSession: UserSession
  planStatus: PlanStatus
  lang: Language
  onConfigureExternalSourceColors: (
    name: string,
    colors: Array<HexModel>
  ) => void
}

interface PalettesStates {
  context: string | undefined
  palettesListStatus:
    | 'LOADING'
    | 'LOADED'
    | 'EMPTY'
    | 'ERROR'
    | 'FULL'
    | 'SIGN_IN_FIRST'
  isLoadMoreActionLoading: boolean
  isSignInLoading: boolean
  isAddToFileActionLoading: Array<boolean>
  selfCurrentPage: number
  communityCurrentPage: number
  selfPalettesList: Array<ExternalPalettes>
  communityPalettesList: Array<ExternalPalettes>
}

export default class Palettes extends React.Component<
  PalettesProps,
  PalettesStates
> {
  contexts: Array<ContextItem>

  constructor(props: PalettesProps) {
    super(props)
    this.contexts = setContexts(['PALETTES_SELF', 'PALETTES_COMMUNITY'])
    this.state = {
      context: this.contexts[0] !== undefined ? this.contexts[0].id : '',
      palettesListStatus: 'EMPTY',
      isLoadMoreActionLoading: false,
      isSignInLoading: false,
      isAddToFileActionLoading: [],
      selfCurrentPage: 1,
      communityCurrentPage: 1,
      selfPalettesList: [],
      communityPalettesList: [],
    }
  }

  // Lifecycle
  componentDidMount = async () => {
    this.callUICPAgent(this.state['context'])
    this.setState({ palettesListStatus: 'LOADING' })
  }

  componentDidUpdate = (
    prevProps: Readonly<PalettesProps>,
    prevState: Readonly<PalettesStates>
  ): void => {
    if (prevState['context'] === this.state['context']) {
      if (prevState['selfCurrentPage'] !== this.state['selfCurrentPage'])
        this.callUICPAgent('PALETTES_SELF')
      if (prevState['communityCurrentPage'] !== this.state['communityCurrentPage'])
        this.callUICPAgent('PALETTES_COMMUNITY')
    } else {
      if (this.state['selfPalettesList'].length === 0) {
        this.setState({ palettesListStatus: 'LOADING' })
        this.callUICPAgent(this.state['context'])
      }
      if (this.state['communityPalettesList'].length === 0) {
        this.setState({ palettesListStatus: 'LOADING' })
        this.callUICPAgent(this.state['context'])
      }
    }
  }

  // Direct actions
  callUICPAgent = async (context: string | undefined) => {
    const getSeftPalettes = async () => {
      const { data, error } = await supabase
        .from(palettesDbTableName)
        .select(
          'palette_id, screenshot, name, preset, colors, themes, creator_avatar, creator_full_name, creator_id'
        )
        .eq('creator_id', this.props.userSession.userId)
        .range(
          pageSize * (this.state['selfCurrentPage'] - 1),
          pageSize * this.state['selfCurrentPage'] - 1
        )

      if (!error) {
        this.setState({
          isLoadMoreActionLoading: false,
          isAddToFileActionLoading: Array(
            this.state['selfPalettesList'].concat(data).length
          ).fill(false),
          palettesListStatus: data.length > 0 ? 'LOADED' : 'FULL',
          selfPalettesList: this.state['selfPalettesList'].concat(data),
        })
      } else if (this.props.userSession.connectionStatus === 'UNCONNECTED')
        this.setState({
          palettesListStatus: 'SIGN_IN_FIRST',
        })
      else
        this.setState({
          palettesListStatus: 'ERROR',
        })
    }

    const getCommunityPalettes = async () => {
      const { data, error } = await supabase
        .from(palettesDbTableName)
        .select(
          'palette_id, screenshot, name, preset, colors, themes, creator_avatar, creator_full_name'
        )
        .range(
          pageSize * (this.state['communityCurrentPage'] - 1),
          pageSize * this.state['communityCurrentPage'] - 1
        )

      if (!error) {
        this.setState({
          isLoadMoreActionLoading: false,
          isAddToFileActionLoading: Array(
            this.state['communityPalettesList'].concat(data).length
          ).fill(false),
          palettesListStatus: data.length > 0 ? 'LOADED' : 'FULL',
          communityPalettesList: this.state['communityPalettesList'].concat(data),
        })
      } else
        this.setState({
          palettesListStatus: 'ERROR',
        })
    }

    const actions: ActionsList = {
      PALETTES_SELF: () => getSeftPalettes(),
      PALETTES_COMMUNITY: () => getCommunityPalettes(),
      DEFAULT: () => null,
    }

    actions[context ?? 'DEFAULT']?.()
  }

  getPaletteMeta = (
    colors: Array<ColorConfiguration>,
    themes: Array<ThemeConfiguration>
  ) => {
    const colorsNumber = colors.length,
      themesNumber = themes.filter(
        (theme) => theme.type === 'custom theme'
      ).length

    let colorLabel: string, themeLabel: string

    if (colorsNumber > 1)
      colorLabel = locals[this.props.lang].actions.sourceColorsNumber.several
    else colorLabel = locals[this.props.lang].actions.sourceColorsNumber.single

    if (themesNumber > 1)
      themeLabel = locals[this.props.lang].actions.colorThemesNumber.several
    else themeLabel = locals[this.props.lang].actions.colorThemesNumber.single

    return `${colorsNumber} ${colorLabel}, ${themesNumber} ${themeLabel}`
  }

  onSelectPalette = async (id: string) => {
    const { data, error } = await supabase
      .from(palettesDbTableName)
      .select('*')
      .eq('palette_id', id)

    if (!error && data.length > 0) {
      try {
        parent.postMessage(
          {
            pluginMessage: {
              type: 'CREATE_PALETTE',
              data: {
                sourceColors: data[0].colors.map(
                  (color: ColorConfiguration) => {
                    return {
                      name: color.name,
                      rgb: color.rgb,
                      source: 'REMOTE',
                      id: color.id,
                    }
                  }
                ) as Array<SourceColorConfiguration>,
                palette: {
                  name: data[0].name,
                  description: data[0].description,
                  preset: data[0].preset,
                  scale: data[0].scale,
                  colorSpace: data[0].color_space,
                  visionSimulationMode: data[0].vision_simulation_mode,
                  view: data[0].view,
                  textColorsTheme: data[0].text_colors_theme,
                  algorithmVersion: data[0].algorithm_version,
                } as Partial<PaletteConfiguration>,
                themes: data[0].themes,
                isRemote: true,
                paletteMeta: {
                  id: data[0].palette_id,
                  dates: {
                    createdAt: data[0].created_at,
                    updatedAt: data[0].updated_at,
                    publishedAt: data[0].published_at,
                  },
                  publicationStatus: {
                    isPublished: true,
                    isShared: data[0].is_shared,
                  },
                  creatorIdentity: {
                    creatorFullName: data[0].creator_full_name,
                    creatorAvatar: data[0].creator_avatar,
                    creatorId: data[0].creator_id,
                  },
                } as MetaConfiguration,
              },
            },
          },
          '*'
        )

        return
      } catch {
        throw error
      }
    } else throw error
  }

  // Handlers
  navHandler = (e: React.SyntheticEvent) =>
    this.setState({
      context: (e.target as HTMLElement).dataset.feature,
    })

  // Templates
  ExternalPalettesList = (palettesList: Array<ExternalPalettes>, currentPage: { [key: string]: number}) => {
    return (
      <ul className="rich-list">
        {palettesList.map((palette, index: number) => (
          <PaletteItem
            id={palette.palette_id}
            key={`palette-${index}`}
            src={palette.screenshot}
            title={palette.name}
            subtitle={palette.preset?.name}
            info={this.getPaletteMeta(
              palette.colors ?? [],
              palette.themes ?? []
            )}
            user={{
              avatar: palette.creator_avatar ?? '',
              name: palette.creator_full_name ?? '',
            }}
            action={() => null}
          >
            <Button
              type="secondary"
              label={locals[this.props.lang].actions.addToFile}
              isLoading={this.state['isAddToFileActionLoading'][index]}
              action={() => {
                this.setState({
                  isAddToFileActionLoading: this.state[
                    'isAddToFileActionLoading'
                  ].map((loading, i) => (i === index ? true : loading)),
                })
                this.onSelectPalette(palette.palette_id ?? '')
                  .finally(() => {
                    this.setState({
                      isAddToFileActionLoading:
                        this.state.isAddToFileActionLoading.map((loading, i) =>
                          i === index ? false : loading
                        ),
                    })
                  })
                  .catch(() => {
                    parent.postMessage(
                      {
                        pluginMessage: {
                          type: 'SEND_MESSAGE',
                          message: locals[this.props.lang].error.addToFile,
                        },
                      },
                      '*'
                    )
                  })
              }}
            />
          </PaletteItem>
        ))}
        <div className="list-control">
          {this.state['palettesListStatus'] === 'LOADED' ? (
            <Button
              type="secondary"
              label={locals[this.props.lang].palettes.lazyLoad.loadMore}
              isLoading={this.state['isLoadMoreActionLoading']}
              action={() =>
                this.setState({
                  isLoadMoreActionLoading: true,
                  ...currentPage
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

    if (
      this.state['palettesListStatus'] === 'LOADED' ||
      this.state['palettesListStatus'] === 'FULL'
    ) {
      controls = this.state['context'] === 'PALETTES_SELF' ? (
        this.ExternalPalettesList(
          this.state['selfPalettesList'],
          { selfCurrentPage: this.state['selfCurrentPage'] + 1 }
        )
      ) : (
        this.ExternalPalettesList(
          this.state['communityPalettesList'],
          { communityCurrentPage: this.state['selfCurrentPage'] + 1 }
        )
      )
    } else if (this.state['palettesListStatus'] === 'ERROR') {
      controls = (
        <div className="onboarding__callout--centered">
          <Message
            icon="warning"
            messages={[locals[this.props.lang].error.fetchPalette]}
          />
        </div>
      )
    } else if (this.state['palettesListStatus'] === 'SIGN_IN_FIRST') {
      controls = (
        <div className="onboarding__callout--centered">
          <Message
            icon="info"
            messages={[locals[this.props.lang].palettes.signInFirst.message]}
          />
          <div className="onboarding__actions">
            <Button
              type="primary"
              label={locals[this.props.lang].palettes.signInFirst.signIn}
              isLoading={this.state['isSignInLoading']}
              action={async () => {
                this.setState({ isSignInLoading: true })
                signIn()
                  .finally(() => {
                    this.setState({ isSignInLoading: false })
                  })
                  .catch((error) => {
                    parent.postMessage(
                      {
                        pluginMessage: {
                          type: 'SEND_MESSAGE',
                          message:
                            error.message === 'Authentication timeout'
                              ? locals[this.props.lang].error.timeout
                              : locals[this.props.lang].error.authentication,
                        },
                      },
                      '*'
                    )
                  })
              }}
            />
          </div>
        </div>
      )
    } else
      controls = (
        <Icon
          type="PICTO"
          iconName="spinner"
          customClassName="control__block__loader"
        />
      )

    return (
      <div className="controls__control">
        <Bar
          leftPart={
            <Tabs
              tabs={this.contexts}
              active={this.state['context'] ?? ''}
              action={this.navHandler}
            />
          }
          rightPart={
            <Feature
              isActive={
                features.find((feature) => feature.name === 'PALETTES_SEARCH')
                  ?.isActive
              }
            >
              <Input
                type="TEXT"
                icon={{
                  type: 'PICTO',
                  value: 'search',
                }}
                placeholder={locals[this.props.lang].palettes.lazyLoad.search}
              />
            </Feature>
          }
          border={['BOTTOM']}
          isOnlyText={true}
        />
        <div className="control__block control__block--no-padding">
          {controls}
        </div>
      </div>
    )
  }
}
