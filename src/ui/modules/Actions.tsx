import * as React from 'react'
import type { Language, SourceColorConfiguration } from '../../utils/types'
import Feature from '../components/Feature'
import { Button } from '@a-ng-d/figmug.actions.button'
import { Dropdown } from '@a-ng-d/figmug.inputs.dropdown'
import features from '../../utils/config'
import isBlocked from '../../utils/isBlocked'
import { locals } from '../../content/locals'

interface Props {
  context: string
  actions?: string
  sourceColors: Array<SourceColorConfiguration> | []
  exportType?: string | null
  planStatus?: 'UNPAID' | 'PAID'
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
  LocalStyles = () => {
    return (
      <Feature
        isActive={
          features.find((feature) => feature.name === 'SYNC_LOCAL_STYLES')
            ?.isActive
        }
      >
        <Button
          type="primary"
          label={locals[this.props.lang].actions.createLocalStyles}
          feature="SYNC_LOCAL_STYLES"
          action={this.props.onSyncLocalStyles}
        />
      </Feature>
    )
  }

  LocalVariables = () => {
    return (
      <Feature
        isActive={
          features.find((feature) => feature.name === 'SYNC_LOCAL_VARIABLES')
            ?.isActive
        }
      >
        <Button
          type="primary"
          label={locals[this.props.lang].actions.createLocalVariables}
          feature="SYNC_LOCAL_VARIABLES"
          isBlocked={isBlocked(
            'SYNC_VARIABLES',
            this.props.planStatus ?? 'UNPAID'
          )}
          isDisabled={isBlocked(
            'SYNC_VARIABLES',
            this.props.planStatus ?? 'UNPAID'
          )}
          action={this.props.onSyncLocalVariables}
        />
      </Feature>
    )
  }

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
              isDisabled={
                this.props.sourceColors.length > 0 ? false : true
              }
              action={this.props.onCreatePalette}
            />
          </Feature>
        </div>
        <div className="actions__left">
          <div className="type">{`${this.props.sourceColors.length} ${
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
          {this.props.actions === 'LOCAL_STYLES' ? (
            <this.LocalStyles />
          ) : (
            <this.LocalVariables />
          )}
        </div>
        <div className="actions__left">
          <Dropdown
            id="sync-mode"
            options={[
              {
                label:
                  locals[this.props.lang].actions.managePalette.localStyles,
                value: 'LOCAL_STYLES',
                position: 0,
                isActive: features.find(
                  (feature) => feature.name === 'LOCAL_STYLES'
                )?.isActive,
                isBlocked: isBlocked(
                  'LOCAL_STYLES',
                  this.props.planStatus ?? 'UNPAID'
                ),
                children: [],
              },
              {
                label:
                  locals[this.props.lang].actions.managePalette.localVariables,
                value: 'LOCAL_VARIABLES',
                position: 1,
                isActive: features.find(
                  (feature) => feature.name === 'LOCAL_VARIABLES'
                )?.isActive,
                isBlocked: isBlocked(
                  'LOCAL_VARIABLES',
                  this.props.planStatus ?? 'UNPAID'
                ),
                children: [],
              },
            ]}
            selected={this.props.actions ?? ''}
            feature="UPDATE_DEPLOYMENT_ACTION"
            parentClassName="controls"
            onChange={(e) =>
              this.props.onChangeActions?.(
                (e.target as HTMLElement).dataset.value ?? 'NULL'
              )
            }
          />
        </div>
      </div>
    )
  }

  Export = () => {
    return (
      <div className="actions">
        <div className="buttons">
          <Button
            type="primary"
            label={`${locals[this.props.lang].actions.export} ${
              this.props.exportType
            }`}
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
