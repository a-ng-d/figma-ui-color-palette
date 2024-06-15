import {
  Bar,
  Button,
  ConsentConfiguration,
  Dropdown,
  DropdownOption,
  FormItem,
  Icon,
  Message,
  layouts,
  texts,
} from '@a_ng_d/figmug-ui'
import chroma from 'chroma-js'
import React from 'react'
import { uid } from 'uid'

import { locals } from '../../content/locals'
import { Language } from '../../types/app'
import { SourceColorConfiguration } from '../../types/configurations'
import { ColourLovers } from '../../types/data'
import { FetchStatus, ThirdParty } from '../../types/management'
import { pageSize } from '../../utils/config'
import { trackImportEvent } from '../../utils/eventsTracker'
import PaletteItem from '../components/PaletteItem'

interface ExploreProps {
  colourLoversPaletteList: Array<ColourLovers>
  userConsent: Array<ConsentConfiguration>
  lang: Language
  figmaUserId: string
  onChangeColorsFromImport: (
    onChangeColorsFromImport: Array<SourceColorConfiguration>,
    source: ThirdParty
  ) => void
  onChangeContexts: () => void
  onLoadColourLoversPaletteList: (palettes: Array<ColourLovers>, shouldBeEmpty: boolean) => void
}

type FilterOptions = 'ANY' | 'YELLOW' | 'ORANGE' | 'RED' | 'GREEN' | 'VIOLET' | 'BLUE'

interface ExploreStates {
  colourLoversPalettesListStatus: FetchStatus
  currentPage: number
  isLoadMoreActionLoading: boolean
  activeFilters: Array<FilterOptions>
}

export default class Explore extends React.Component<
  ExploreProps,
  ExploreStates
> {
  filters: Array<FilterOptions>

  constructor(props: ExploreProps) {
    super(props)
    this.filters = ['ANY', 'YELLOW', 'ORANGE', 'RED', 'GREEN', 'VIOLET', 'BLUE'],
    this.state = {
      colourLoversPalettesListStatus: 'LOADING',
      currentPage: 1,
      isLoadMoreActionLoading: false,
      activeFilters: ['ANY'],
    }
  }

  // Lifecycle
  componentDidMount = () => {
    if (this.props.colourLoversPaletteList.length === 0)
      this.callUICPAgent()
    else {
      this.setState({
        colourLoversPalettesListStatus: 'LOADED',
      })
    }
  }

  componentDidUpdate = (
    prevProps: Readonly<ExploreProps>,
    prevState: Readonly<ExploreStates>
  ): void => {
    if (prevState.currentPage !== this.state.currentPage){
      this.callUICPAgent()
    }

    if (this.state.colourLoversPalettesListStatus === 'ERROR'
    ) {
      return
    }

    if (this.state.activeFilters !== prevState.activeFilters) {
      this.setState({
        currentPage: 1,
        colourLoversPalettesListStatus: 'LOADING',
      })
      this.props.onLoadColourLoversPaletteList([], true)
      this.callUICPAgent()
    }
      
  }

  // Direct actions
  callUICPAgent = async () => {
    return fetch(
      'https://corsproxy.io/?' +
        encodeURIComponent(
          `https://www.colourlovers.com/api/palettes?format=json&numResults=${pageSize}&resultOffset=${
            this.state.currentPage - 1
          }&hueOption=${
            this.state.activeFilters
              .filter((filter) => filter !== 'ANY')
              .map((filter) => filter.toLowerCase())
              .join(',')
          }`
        ),
      {
        cache: 'no-cache',
        credentials: 'omit',
      }
    )
      .then((response) => {
        if (response.ok) return response.json()
        else throw new Error(locals[this.props.lang].error.badResponse)
      })
      .then((data) => {
        this.setState({
          colourLoversPalettesListStatus:
            data.length === pageSize ? 'LOADED' : 'COMPLETE',
        })
        this.props.onLoadColourLoversPaletteList(data, false)
      })
      .finally(() =>
        this.setState({
          isLoadMoreActionLoading: false,
        })
      )
      .catch(() =>
        this.setState({
          colourLoversPalettesListStatus: 'ERROR',
        })
      )
  }

  setFilters = () => {
    return this.filters.map((filter) => {
      return {
        label: locals[this.props.lang].source.colourLovers.filters[filter.toLowerCase()],
        value: filter,
        feature: 'EDIT_FILTER',
        position: 0,
        type: 'OPTION',
        isActive: true,
        isBlocked: false,
        children: [],
        action: () => this.onAddFilter(filter),
      }
    }) as Array<DropdownOption>
  }

  onAddFilter = (value: FilterOptions) => {  
    if (value === 'ANY' || this.state.activeFilters.length === 0)
      this.setState({
        activeFilters: this.state.activeFilters.filter(filter => filter === 'ANY')
      })
    else if (this.state.activeFilters.includes(value))
      this.setState({
        activeFilters: this.state.activeFilters.filter(filter => filter !== value)
      })
    else
      this.setState({
        activeFilters: this.state.activeFilters.concat(value)
      })
  }

  // Templates
  ExternalSourceColorsList = () => {
    let fragment

    if (this.state.colourLoversPalettesListStatus === 'LOADED'
      || this.state.colourLoversPalettesListStatus === 'COMPLETE') {
      fragment = (
        <>
          {this.props.colourLoversPaletteList.map((palette, index: number) => (
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
              <div className={layouts['snackbar--tight']}>
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
                    this.props.onChangeContexts()
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
                    trackImportEvent(
                      this.props.figmaUserId,
                      this.props.userConsent.find(
                        (consent) => consent.id === 'mixpanel'
                      )?.isConsented ?? false,
                      {
                        feature: 'IMPORT_COLOUR_LOVERS',
                      }
                    )
                  }}
                />
              </div>
            </PaletteItem>
          ))}
          <div className="list-control">
            {this.state.colourLoversPalettesListStatus === 'LOADED' ? (
              <Button
                type="secondary"
                label={locals[this.props.lang].palettes.lazyLoad.loadMore}
                isLoading={this.state.isLoadMoreActionLoading}
                action={() =>
                  this.setState({
                    isLoadMoreActionLoading: true,
                    currentPage: this.state.currentPage + pageSize,
                  })
                }
              />
            ) : (
              <div className={`${texts['type--secondary']} type`}>
                {locals[this.props.lang].palettes.lazyLoad.completeList}
              </div>
            )}
          </div>
        </>
      )
    }
    else if (this.state.colourLoversPalettesListStatus === 'ERROR')
      fragment = (
        <div className="onboarding__callout--centered">
          <Message
            icon="warning"
            messages={[locals[this.props.lang].error.fetchPalette]}
          />
        </div>
      )
    else if (this.state.colourLoversPalettesListStatus === 'LOADING')
      fragment = (
        <Icon
          type="PICTO"
          iconName="spinner"
          customClassName="control__block__loader"
        />
      )
    return (
      <ul
        className={[
          'rich-list',
          this.state.colourLoversPalettesListStatus === 'LOADING' ? 'rich-list--loading' : null,
          this.state.colourLoversPalettesListStatus === 'ERROR' ? 'rich-list--message' : null
        ]
          .filter((n) => n)
          .join(' ')}
      >
        {fragment}
      </ul>
    )
  }

  // Render
  render() {
    console.log(this.state.activeFilters, this.state.activeFilters.join(', '))
    return (
      <div className="controls__control controls__control--horizontal">
        <div className="controls__control">
          <div className="control__block control__block--no-padding">
            <Bar
              leftPart={
                <FormItem
                  id="explore__filters"
                  label={locals[this.props.lang].source.colourLovers.filters.label}
                >
                  <Dropdown
                    id="explore__filters"
                    options={this.setFilters()}
                    selected={this.state.activeFilters.includes('ANY') && this.state.activeFilters.length > 1
                      ? this.state.activeFilters.filter(((filter) => filter !== 'ANY')).join(', ')
                      : this.state.activeFilters.join(', ')}
                    isDisabled={this.state.colourLoversPalettesListStatus === 'LOADING'}
                    parentClassName="ui"
                  />
                </FormItem>
              }
              border={['BOTTOM']}
            />
            <this.ExternalSourceColorsList />
          </div>
        </div>
      </div>
    )
  }
}
