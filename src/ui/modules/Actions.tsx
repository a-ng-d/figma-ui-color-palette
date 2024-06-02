import { Button, DropdownOption, Menu, texts } from '@a_ng_d/figmug-ui'
import React from 'react'

import { locals } from '../../content/locals'
import { Language, PlanStatus } from '../../types/app'
import { SourceColorConfiguration } from '../../types/configurations'
import { Identity } from '../../types/user'
import features from '../../utils/config'
import isBlocked from '../../utils/isBlocked'
import Feature from '../components/Feature'

interface ActionsProps {
  context: string
  sourceColors: Array<SourceColorConfiguration> | []
  identity?: Identity
  exportType?: string
  planStatus?: PlanStatus
  lang: Language
  onCreatePalette?: React.MouseEventHandler & React.KeyboardEventHandler
  onSyncLocalStyles?: (
    e:
      | React.MouseEvent<HTMLLIElement, MouseEvent>
      | React.KeyboardEvent<HTMLLIElement>
  ) => void
  onSyncLocalVariables?: (
    e:
      | React.MouseEvent<HTMLLIElement, MouseEvent>
      | React.KeyboardEvent<HTMLLIElement>
  ) => void
  onPublishPalette?: (
    e:
      | React.MouseEvent<HTMLLIElement, MouseEvent>
      | React.KeyboardEvent<HTMLLIElement>
  ) => void
  onExportPalette?: React.MouseEventHandler & React.KeyboardEventHandler
}

export default class Actions extends React.Component<ActionsProps> {
  static defaultProps = {
    sourceColors: [],
  }

  // Direct actions
  publicationAction = (): Partial<DropdownOption> => {
    if (this.props.identity?.connectionStatus === 'UNCONNECTED')
      return {
        label: locals[this.props.lang].actions.publishOrSyncPalette,
        value: 'PALETTE_PUBLICATION',
        feature: 'PUBLISH_SYNC_PALETTE',
      }
    else if (this.props.identity?.userId === this.props.identity?.creatorId)
      return {
        label: locals[this.props.lang].actions.publishPalette,
        value: 'PALETTE_PUBLICATION',
        feature: 'PUBLISH_PALETTE',
      }
    else if (
      this.props.identity?.userId !== this.props.identity?.creatorId &&
      this.props.identity?.creatorId !== ''
    )
      return {
        label: locals[this.props.lang].actions.syncPalette,
        value: 'PALETTE_PUBLICATION',
        feature: 'SYNC_PALETTE',
      }
    else
      return {
        label: locals[this.props.lang].actions.publishPalette,
        value: 'PALETTE_PUBLICATION',
        feature: 'PUBLISH_PALETTE',
      }
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
            label={locals[this.props.lang].actions.run}
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
              {
                ...this.publicationAction(),
                position: 0,
                type: 'OPTION',
                isActive: features.find(
                  (feature) => feature.name === 'PUBLISH_PALETTE'
                )?.isActive,
                isBlocked: isBlocked(
                  'PUBLISH_PALETTE',
                  this.props.planStatus ?? 'UNPAID'
                ),
                isNew: features.find(
                  (feature) => feature.name === 'PUBLISH_PALETTE'
                )?.isNew,
                children: [],
                action: (e) => this.props.onPublishPalette?.(e),
              } as DropdownOption,
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
