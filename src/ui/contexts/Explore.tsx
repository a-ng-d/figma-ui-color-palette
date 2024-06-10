import {
  Button,
  ConsentConfiguration,
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
import { ThirdParty } from '../../types/management'
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
  onChangeContexts: React.MouseEventHandler<Element> &
    React.KeyboardEventHandler<Element>
  onLoadColourLoversPaletteList: (palettes: Array<ColourLovers>) => void
}

interface ExploreStates {
  colourLoversPalettesListStatus:
    | 'LOADING'
    | 'LOADED'
    | 'EMPTY'
    | 'ERROR'
    | 'COMPLETE'
    | 'SIGN_IN_FIRST'
  currentPage: number
  isLoadMoreActionLoading: boolean
}

export default class Explore extends React.Component<
  ExploreProps,
  ExploreStates
> {
  constructor(props: ExploreProps) {
    super(props)
    this.state = {
      colourLoversPalettesListStatus: 'LOADING',
      currentPage: 1,
      isLoadMoreActionLoading: false,
    }
  }

  // Lifecycle
  componentDidMount = () => this.callUICPAgent()

  componentDidUpdate = (
    prevProps: Readonly<ExploreProps>,
    prevState: Readonly<ExploreStates>
  ): void => {
    console.log()
    if (
      prevState.currentPage !== this.state['currentPage'] ||
      (this.state['colourLoversPalettesListStatus'] !== 'LOADED' &&
        this.state['colourLoversPalettesListStatus'] !== 'ERROR')
    ) {
      this.callUICPAgent()
    }
  }

  // Direct actions
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
      .then((response) => {
        if (response.ok) return response.json()
        else throw new Error(locals[this.props.lang].error.badResponse)
      })
      .then((data) => {
        this.setState({
          colourLoversPalettesListStatus:
            data.length === pageSize ? 'LOADED' : 'COMPLETE',
        })
        this.props.onLoadColourLoversPaletteList(data)
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

  // Templates
  ExternalSourceColorsList = () => {
    return (
      <ul className="rich-list">
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
                  this.props.onChangeContexts
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
          {this.state['colourLoversPalettesListStatus'] === 'LOADED' ? (
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

    if (this.state['colourLoversPalettesListStatus'] !== 'LOADING')
      controls = (
        <div className="controls__control controls__control--horizontal">
          {this.state['colourLoversPalettesListStatus'] === 'LOADED' ||
          this.state['colourLoversPalettesListStatus'] === 'COMPLETE' ? (
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
      )
    else
      controls = (
        <div className="controls__control controls__control--horizontal">
          <Icon
            type="PICTO"
            iconName="spinner"
            customClassName="control__block__loader"
          />
        </div>
      )

    return controls
  }
}
