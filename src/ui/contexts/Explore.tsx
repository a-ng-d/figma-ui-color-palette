import { Button, Icon, Message, texts } from '@a_ng_d/figmug-ui'
import React from 'react'

import { supabase } from '../../bridges/publication/authentication'
import { locals } from '../../content/locals'
import { palettesDbTableName } from '../../utils/config'
import type {
  ColorConfiguration,
  Language,
  MetaConfiguration,
  PaletteConfiguration,
  PlanStatus,
  PresetConfiguration,
  SourceColorConfiguration,
  ThemeConfiguration,
} from '../../utils/types'
import PaletteItem from '../components/PaletteItem'

interface ExploreProps {
  planStatus: PlanStatus
  lang: Language
}

interface ExploreStates {
  paletteListStatus: 'LOADING' | 'LOADED' | 'EMPTY' | 'ERROR' | 'FULL'
  pageSize: number
  currentPage: number
  isLoadMoreActionLoading: boolean
  isAddToFileActionLoading: Array<boolean>
  paletteList: Array<{
    palette_id: string
    screenshot: string
    name: string
    preset: PresetConfiguration
    colors: ColorConfiguration
    themes: ThemeConfiguration
    creator_avatar: string
    creator_full_name: string
  }>
}

export default class Explore extends React.Component<
  ExploreProps,
  ExploreStates
> {
  constructor(props: ExploreProps) {
    super(props)
    this.state = {
      paletteListStatus: 'LOADING',
      pageSize: 2,
      currentPage: 1,
      isLoadMoreActionLoading: false,
      paletteList: [],
      isAddToFileActionLoading: [],
    }
  }

  // Lifecycle
  componentDidMount = async () => this.callUICPAgent()

  componentDidUpdate = (
    prevProps: Readonly<ExploreProps>,
    prevState: Readonly<ExploreStates>
  ): void => {
    if (prevState.currentPage !== this.state['currentPage'])
      this.callUICPAgent()
  }

  // Direct actions
  callUICPAgent = async () => {
    const { data, error } = await supabase
      .from(palettesDbTableName)
      .select(
        'palette_id, screenshot, name, preset, colors, themes, creator_avatar, creator_full_name'
      )
      .range(
        this.state['pageSize'] * (this.state['currentPage'] - 1),
        this.state['pageSize'] * this.state['currentPage'] - 1
      )

    console.log(data)

    if (!error) {
      this.setState({
        isLoadMoreActionLoading: false,
        isAddToFileActionLoading: Array(
          this.state['paletteList'].concat(data).length
        ).fill(false),
        paletteListStatus: data.length > 0 ? 'LOADED' : 'FULL',
        paletteList: this.state['paletteList'].concat(data),
      })
    } else
      this.setState({
        paletteListStatus: 'ERROR',
      })
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

    console.log(data)

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

  // Templates
  PalettesList = () => {
    return (
      <ul className="rich-list">
        {this.state['paletteList'].map((palette: any, index: number) => (
          <PaletteItem
            id={palette.palette_id}
            key={`palette-${index}`}
            src={palette.screenshot}
            title={palette.name}
            subtitle={palette.preset.name}
            info={this.getPaletteMeta(palette.colors, palette.themes)}
            user={{
              avatar: palette.creator_avatar,
              name: palette.creator_full_name,
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
                this.onSelectPalette(palette.palette_id)
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
          {this.state['paletteListStatus'] === 'LOADED' ? (
            <Button
              type="secondary"
              label={locals[this.props.lang].explore.loadMore}
              isLoading={this.state['isLoadMoreActionLoading']}
              action={() =>
                this.setState({
                  isLoadMoreActionLoading: true,
                  currentPage: this.state['currentPage'] + 1,
                })
              }
            />
          ) : (
            <div className={`${texts['type--secondary']} type`}>
              {locals[this.props.lang].explore.completeList}
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
      this.state['paletteListStatus'] === 'LOADED' ||
      this.state['paletteListStatus'] === 'FULL'
    ) {
      controls = <this.PalettesList />
    } else if (this.state['paletteListStatus'] === 'ERROR') {
      controls = (
        <div className="onboarding__callout--centered">
          <Message
            icon="warning"
            messages={[locals[this.props.lang].error.fetchPalette]}
          />
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
        <div className="control__block control__block--no-padding">
          {controls}
        </div>
      </div>
    )
  }
}
