import * as React from 'react'
import type {
  Language,
  PlanStatus,
  SourceColorConfiguration,
} from '../../utils/types'
import Feature from '../components/Feature'
import { Button } from '@a-ng-d/figmug.actions.button'
import { Menu } from '@a-ng-d/figmug.navigation.menu'
import { texts } from '@a-ng-d/figmug.stylesheets.texts'
import features from '../../utils/config'
import isBlocked from '../../utils/isBlocked'
import { locals } from '../../content/locals'

interface Props {
  context: string
  sourceColors: Array<SourceColorConfiguration> | []
  exportType?: string
  planStatus?: PlanStatus
  lang: Language
  onCreatePalette?: React.MouseEventHandler & React.KeyboardEventHandler
  onSyncLocalStyles?: React.MouseEventHandler & React.KeyboardEventHandler
  onSyncLocalVariables?: React.MouseEventHandler & React.KeyboardEventHandler
  onExportPalette?: React.MouseEventHandler & React.KeyboardEventHandler
  onChangeActions?: (value: string) => void
}

export default class Actions extends React.Component<Props> {
  static defaultProps = {
    sourceColors: [],
  }

  // Templates
  Create = () => {
    return (
      <div className="actions">
        <div className="actions__right">
          <Feature
            isActive={
              features.find((feature) => feature.name === 'CREATE_PALETTE')
                ?.isActive
            }
          >
            <Button
              type="primary"
              label={locals[this.props.lang].actions.createPalette}
              feature="CREATE_PALETTE"
              isDisabled={this.props.sourceColors.length > 0 ? false : true}
              action={this.props.onCreatePalette}
            />
          </Feature>
        </div>
        <div className="actions__left">
          <div className={`type ${texts.type}`}>{`${
            this.props.sourceColors.length
          } ${
            this.props.sourceColors.length > 1
              ? locals[this.props.lang].actions.sourceColorsNumber.several
              : locals[this.props.lang].actions.sourceColorsNumber.single
          }`}</div>
        </div>
      </div>
    )
  }

  Deploy = () => {
    return (
      <div className="actions">
        <div className="actions__right">
          <Menu
            id="local-styles-variables"
            label={locals[this.props.lang].actions.sync}
            type="PRIMARY"
            options={[
              {
                label: locals[this.props.lang].actions.createLocalStyles,
                value: 'LOCAL_STYLES',
                feature: 'SYNC_LOCAL_STYLES',
                position: 0,
                type: 'OPTION',
                isActive: features.find(
                  (feature) => feature.name === 'SYNC_LOCAL_STYLES'
                )?.isActive,
                isBlocked: isBlocked(
                  'SYNC_LOCAL_STYLES',
                  this.props.planStatus ?? 'UNPAID'
                ),
                isNew: features.find(
                  (feature) => feature.name === 'SYNC_LOCAL_STYLES'
                )?.isNew,
                children: [],
                action: (e) => this.props.onSyncLocalStyles?.(e),
              },
              {
                label: locals[this.props.lang].actions.createLocalVariables,
                value: 'LOCAL_VARIABLES',
                feature: 'SYNC_LOCAL_VARIABLES',
                position: 0,
                type: 'OPTION',
                isActive: features.find(
                  (feature) => feature.name === 'SYNC_LOCAL_VARIABLES'
                )?.isActive,
                isBlocked: isBlocked(
                  'SYNC_LOCAL_VARIABLES',
                  this.props.planStatus ?? 'UNPAID'
                ),
                isNew: features.find(
                  (feature) => feature.name === 'SYNC_LOCAL_VARIABLES'
                )?.isNew,
                children: [],
                action: (e) => this.props.onSyncLocalVariables?.(e),
              },
            ]}
            alignment="TOP_RIGHT"
          />
        </div>
        <div className="actions__left"></div>
      </div>
    )
  }

  Export = () => {
    return (
      <div className="actions">
        <div className="buttons">
          <Button
            type="primary"
            label={this.props.exportType}
            feature="EXPORT_PALETTE"
            action={this.props.onExportPalette}
          >
            <a></a>
          </Button>
        </div>
      </div>
    )
  }

  // Render
  render() {
    return (
      <>
        {this.props.context === 'CREATE' ? <this.Create /> : null}
        {this.props.context === 'DEPLOY' ? <this.Deploy /> : null}
        {this.props.context === 'EXPORT' ? <this.Export /> : null}
      </>
    )
  }
}
