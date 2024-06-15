import {
  Bar,
  Button,
  ConsentConfiguration,
  HexModel,
  Icon,
  Input,
  Message,
  Tabs,
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
import { ContextItem, FetchStatus } from '../../types/management'
import { ActionsList } from '../../types/models'
import { UserSession } from '../../types/user'
import features, { pageSize, palettesDbTableName } from '../../utils/config'
import { trackPublicationEvent } from '../../utils/eventsTracker'
import { setContexts } from '../../utils/setContexts'
import Feature from '../components/Feature'
import PaletteItem from '../components/PaletteItem'

interface PalettesProps {
  userSession: UserSession
  userConsent: Array<ConsentConfiguration>
  planStatus: PlanStatus
  lang: Language
  figmaUserId: string
  onConfigureExternalSourceColors: (
    name: string,
    colors: Array<HexModel>
  ) => void
}

interface PalettesStates {
  context: string | undefined
  selfPalettesListStatus: FetchStatus
  communityPalettesListStatus: FetchStatus
  isLoadMoreActionLoading: boolean
  isSignInLoading: boolean
  isAddToFileActionLoading: Array<boolean>
  selfCurrentPage: number
  communityCurrentPage: number
  selfPalettesList: Array<ExternalPalettes>
  communityPalettesList: Array<ExternalPalettes>
  seftPalettesSearchQuery: string
  communityPalettesSearchQuery: string
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
      selfPalettesListStatus: 'LOADING',
      communityPalettesListStatus: 'LOADING',
      isLoadMoreActionLoading: false,
      isSignInLoading: false,
      isAddToFileActionLoading: [],
      selfCurrentPage: 1,
      communityCurrentPage: 1,
      selfPalettesList: [],
      communityPalettesList: [],
      seftPalettesSearchQuery: '',
      communityPalettesSearchQuery: '',
    }
  }

  // Lifecycle
  componentDidMount = async () => {
    if (this.props.userSession.connectionStatus === 'CONNECTED') {
      this.callUICPAgent(this.state.context)
      this.setState({ selfPalettesListStatus: 'LOADING' })
    } else
      this.setState({
        selfPalettesListStatus: 'SIGN_IN_FIRST',
      })
  }

  componentDidUpdate = (
    prevProps: Readonly<PalettesProps>,
    prevState: Readonly<PalettesStates>
  ): void => {
    if (
      prevProps.userSession.connectionStatus !==
      this.props.userSession.connectionStatus
    ) {
      this.setState({ selfPalettesListStatus: 'LOADING' })
      this.callUICPAgent('PALETTES_SELF')
    }
    if (prevState.context === this.state.context) {
      if (prevState.selfCurrentPage !== this.state.selfCurrentPage)
        this.callUICPAgent('PALETTES_SELF')
      if (
        prevState.communityCurrentPage !== this.state.communityCurrentPage
      )
        this.callUICPAgent('PALETTES_COMMUNITY')
      if (
        prevState.seftPalettesSearchQuery !==
        this.state.seftPalettesSearchQuery
      ) {
        this.setState({
          selfPalettesList: [],
          selfCurrentPage: 1,
          selfPalettesListStatus: 'LOADING',
        })
        this.callUICPAgent('PALETTES_SELF')
      }
      if (
        prevState.communityPalettesSearchQuery !==
        this.state.communityPalettesSearchQuery
      ) {
        this.setState({
          communityPalettesList: [],
          communityCurrentPage: 1,
          communityPalettesListStatus: 'LOADING',
        })
        this.callUICPAgent('PALETTES_COMMUNITY')
      }
    } else {
      if (
        this.state.selfPalettesList.length === 0 &&
        this.state.selfPalettesListStatus !== 'EMPTY' &&
        this.state.selfPalettesListStatus !== 'SIGN_IN_FIRST'
      ) {
        this.setState({ selfPalettesListStatus: 'LOADING' })
        this.callUICPAgent(this.state.context)
      }
      if (
        this.state.communityPalettesList.length === 0 &&
        this.state.communityPalettesListStatus !== 'EMPTY'
      ) {
        this.setState({ communityPalettesListStatus: 'LOADING' })
        this.callUICPAgent(this.state.context)
      }
    }
  }

  // Direct actions
  callUICPAgent = async (context: string | undefined) => {
    const getSeftPalettes = async () => {
      let data, error

      if (this.state.seftPalettesSearchQuery === '') {
        // eslint-disable-next-line @typescript-eslint/no-extra-semi
        ;({ data, error } = await supabase
          .from(palettesDbTableName)
          .select(
            'palette_id, screenshot, name, preset, colors, themes, creator_avatar, creator_full_name, creator_id'
          )
          .eq('creator_id', this.props.userSession.userId)
          .range(
            pageSize * (this.state.selfCurrentPage - 1),
            pageSize * this.state.selfCurrentPage - 1
          ))
      } else {
        // eslint-disable-next-line @typescript-eslint/no-extra-semi
        ;({ data, error } = await supabase
          .from(palettesDbTableName)
          .select(
            'palette_id, screenshot, name, preset, colors, themes, creator_avatar, creator_full_name, creator_id'
          )
          .eq('creator_id', this.props.userSession.userId)
          .range(
            pageSize * (this.state.selfCurrentPage - 1),
            pageSize * this.state.selfCurrentPage - 1
          )
          .ilike('name', `%${this.state.seftPalettesSearchQuery}%`))
      }

      if (!error) {
        const batch = this.state.selfPalettesList.concat(
          data as Array<ExternalPalettes>
        )

        this.setState({
          isLoadMoreActionLoading: false,
          isAddToFileActionLoading: Array(batch.length).fill(false),
          selfPalettesListStatus: updateStatus(
            batch,
            this.state.selfCurrentPage
          ),
          selfPalettesList: batch,
        })
      } else
        this.setState({
          selfPalettesListStatus: 'ERROR',
        })
    }

    const getCommunityPalettes = async () => {
      let data, error

      if (this.state.communityPalettesSearchQuery === '') {
        // eslint-disable-next-line @typescript-eslint/no-extra-semi
        ;({ data, error } = await supabase
          .from(palettesDbTableName)
          .select(
            'palette_id, screenshot, name, preset, colors, themes, creator_avatar, creator_full_name'
          )
          .range(
            pageSize * (this.state.communityCurrentPage - 1),
            pageSize * this.state.communityCurrentPage - 1
          ))
      } else {
        // eslint-disable-next-line @typescript-eslint/no-extra-semi
        ;({ data, error } = await supabase
          .from(palettesDbTableName)
          .select(
            'palette_id, screenshot, name, preset, colors, themes, creator_avatar, creator_full_name'
          )
          .range(
            pageSize * (this.state.communityCurrentPage - 1),
            pageSize * this.state.communityCurrentPage - 1
          )
          .ilike('name', `%${this.state.communityPalettesSearchQuery}%`))
      }

      if (!error) {
        const batch = this.state.communityPalettesList.concat(
          data as Array<ExternalPalettes>
        )

        this.setState({
          isLoadMoreActionLoading: false,
          isAddToFileActionLoading: Array(batch.length).fill(false),
          communityPalettesListStatus: updateStatus(
            batch,
            this.state.communityCurrentPage
          ),
          communityPalettesList: batch,
        })
      } else
        this.setState({
          communityPalettesListStatus: 'ERROR',
        })
    }

    const updateStatus = (
      batch: Array<ExternalPalettes>,
      currentPage: number
    ) => {
      if (batch.length === 0 && currentPage === 1) {
        return 'EMPTY'
      } else if (batch.length === pageSize) {
        return 'LOADED'
      } else return 'COMPLETE'
    }

    const actions: ActionsList = {
      PALETTES_SELF: () => {
        if (this.props.userSession.connectionStatus === 'CONNECTED')
          getSeftPalettes()
        else
          this.setState({
            selfPalettesListStatus: 'SIGN_IN_FIRST',
          })
      },
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
        trackPublicationEvent(
          this.props.figmaUserId,
          this.props.userConsent.find((consent) => consent.id === 'mixpanel')
            ?.isConsented ?? false,
          {
            feature:
              this.props.userSession.userId === data[0].creator_id
                ? 'REUSE_PALETTE'
                : 'ADD_PALETTE',
          }
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
  ExternalPalettesList = (
    status: string,
    palettesList: Array<ExternalPalettes>,
    currentPage: { [key: string]: number }
  ) => {
    let fragment

    if (status === 'LOADED') {
      fragment = (
        <Button
          type="secondary"
          label={locals[this.props.lang].palettes.lazyLoad.loadMore}
          isLoading={this.state.isLoadMoreActionLoading}
          action={() =>
            this.setState({
              isLoadMoreActionLoading: true,
              ...currentPage,
            })
          }
        />
      )
    }
    else if (status === 'COMPLETE')
      fragment = (
        <Message
          icon="check"
          messages={[locals[this.props.lang].palettes.lazyLoad.completeList]}
        />
      )
      
    return (
      <ul
      className={[
        'rich-list',
        status === 'LOADING' ? 'rich-list--loading' : null,
        status === 'ERROR' || status === 'EMPTY' ? 'rich-list--message' : null
        
      ]
        .filter((n) => n)
        .join(' ')}
      >
        {status === 'LOADING' && (
          <Icon
            type="PICTO"
            iconName="spinner"
            customClassName="control__block__loader"
          />
        )}
        {status === 'ERROR' && (
          <div className="onboarding__callout--centered">
            <Message
              icon="warning"
              messages={[locals[this.props.lang].error.fetchPalette]}
            />
          </div>
        )}
        {status === 'EMPTY' && (
          <div className="onboarding__callout--centered">
            <Message
              icon="info"
              messages={[locals[this.props.lang].warning.noPaletteOnRemote]}
            />
          </div>
        )}
        {(status === 'LOADED' || status === 'COMPLETE') && 
          palettesList.map((palette, index: number) => (
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
                isLoading={this.state.isAddToFileActionLoading[index]}
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
          )
        )}
        <div className="list-control">{fragment}</div>
      </ul>
    )
  }

  // Render
  render() {
    let fragment

    if (this.state.context === 'PALETTES_SELF') {
      if (this.state.selfPalettesListStatus !== 'SIGN_IN_FIRST') {
        fragment = this.ExternalPalettesList(
          this.state.selfPalettesListStatus,
          this.state.selfPalettesList,
          { selfCurrentPage: this.state.selfCurrentPage + 1 }
        )
      } else {
        fragment = (
          <div className="onboarding__callout--centered">
            <Message
              icon="info"
              messages={[locals[this.props.lang].palettes.signInFirst.message]}
            />
            <div className="onboarding__actions">
              <Button
                type="primary"
                label={locals[this.props.lang].palettes.signInFirst.signIn}
                isLoading={this.state.isSignInLoading}
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
      }
    } else
      fragment = this.ExternalPalettesList(
        this.state.communityPalettesListStatus,
        this.state.communityPalettesList,
        { communityCurrentPage: this.state.communityCurrentPage + 1 }
      )

    return (
      <div className="controls__control">
        <Bar
          leftPart={
            <Tabs
              tabs={this.contexts}
              active={this.state.context ?? ''}
              action={this.navHandler}
            />
          }
          border={['BOTTOM']}
          isOnlyText={true}
        />
        <div className="control__block control__block--no-padding">
          <Bar
            soloPart={
              <Input
                type="TEXT"
                icon={{
                  type: 'PICTO',
                  value: 'search',
                }}
                placeholder={locals[this.props.lang].palettes.lazyLoad.search}
                value={
                  this.state.context === 'PALETTES_SELF'
                    ? this.state.seftPalettesSearchQuery
                    : this.state.communityPalettesSearchQuery
                }
                onConfirm={(e) => {
                  if (this.state.context === 'PALETTES_SELF')
                    this.setState({
                      seftPalettesSearchQuery: (e.target as HTMLInputElement)
                        .value,
                    })
                  else
                    this.setState({
                      communityPalettesSearchQuery: (
                        e.target as HTMLInputElement
                      ).value,
                    })
                }}
              />
            }
            border={['BOTTOM']}
          />
          {fragment}
        </div>
      </div>
    )
  }
}
