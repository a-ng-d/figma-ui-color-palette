import { Button, Icon, Message, texts } from '@a_ng_d/figmug-ui'
import React from 'react'

import { supabase } from '../../bridges/publication/authentication'
import { locals } from '../../content/locals'
import { palettesDbTableName } from '../../utils/config'
import type {
  ColorConfiguration,
  Language,
  PlanStatus,
  PresetConfiguration,
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
  isSecondaryActionLoading: boolean
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
      isSecondaryActionLoading: false,
      paletteList: [],
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
        isSecondaryActionLoading: false,
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

  onSelectPalette = (
    e: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement>
  ) => {
    e.preventDefault()
  }

  // Templates
  PalettesList = () => {
    return (
      <ul className="rich-list">
        {this.state['paletteList'].map((palette: any, index: any) => (
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
            action={this.onSelectPalette}
          />
        ))}
        <div className="list-control">
          {this.state['paletteListStatus'] === 'LOADED' ? (
            <Button
              type="secondary"
              label={locals[this.props.lang].explore.loadMore}
              isLoading={this.state['isSecondaryActionLoading']}
              action={() =>
                this.setState({
                  isSecondaryActionLoading: true,
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
            messages={[locals[this.props.lang].error.noPaletteLoaded]}
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
