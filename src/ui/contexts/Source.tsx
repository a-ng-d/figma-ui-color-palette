import { Bar, ConsentConfiguration, Tabs } from '@a_ng_d/figmug-ui'
import React from 'react'

import { EditorType, Language, PlanStatus } from '../../types/app'
import { SourceColorConfiguration } from '../../types/configurations'
import { ColourLovers } from '../../types/data'
import { ContextItem, ThirdParty } from '../../types/management'
import { setContexts } from '../../utils/setContexts'
import Actions from '../modules/Actions'
import Explore from './Explore'
import Overview from './Overview'

interface SourceProps {
  sourceColors: Array<SourceColorConfiguration>
  userConsent: Array<ConsentConfiguration>
  planStatus: PlanStatus
  editorType?: EditorType
  lang: Language
  figmaUserId: string
  onChangeColorsFromImport: (
    onChangeColorsFromImport: Array<SourceColorConfiguration>,
    source: ThirdParty
  ) => void
  onCreatePalette: () => void
}

interface SourceStates {
  context: string | undefined
  colourLoversPaletteList: Array<ColourLovers>
}

export default class Source extends React.Component<SourceProps, SourceStates> {
  contexts: Array<ContextItem>

  constructor(props: SourceProps) {
    super(props)
    this.contexts = setContexts(['SOURCE_OVERVIEW', 'SOURCE_EXPLORE'])
    this.state = {
      context: this.contexts[0] !== undefined ? this.contexts[0].id : '',
      colourLoversPaletteList: [],
    }
  }

  // Handlers
  navHandler = (e: React.SyntheticEvent) =>
    this.setState({
      context: (e.target as HTMLElement).dataset.feature,
    })

  // Render
  render() {
    let fragment

    switch (this.state.context) {
      case 'SOURCE_OVERVIEW': {
        fragment = (
          <Overview
            {...this.props}
            onChangeContexts={() =>
              this.setState({ context: 'SOURCE_EXPLORE' })
            }
          />
        )
        break
      }
      case 'SOURCE_EXPLORE': {
        fragment = (
          <Explore
            {...this.props}
            colourLoversPaletteList={this.state.colourLoversPaletteList}
            onChangeContexts={() =>
              this.setState({ context: 'SOURCE_OVERVIEW' })
            }
            onLoadColourLoversPalettesList={(e, shouldBeEmpty) =>
              this.setState({
                colourLoversPaletteList:
                  !shouldBeEmpty
                    ? this.state.colourLoversPaletteList.concat(e)
                    : [],
              })
            }
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
              tabs={this.contexts}
              active={this.state.context ?? ''}
              action={this.navHandler}
            />
          }
          border={['BOTTOM']}
          isOnlyText={true}
        />
        {fragment}
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
