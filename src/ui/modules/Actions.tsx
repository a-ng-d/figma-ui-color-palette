import * as React from 'react'
import type { Language } from '../../utils/types'
import Feature from '../components/Feature'
import Button from '../components/Button'
import Dropdown from '../components/Dropdown'
import features from '../../utils/features'
import isBlocked from '../../utils/isBlocked'
import { locals } from '../../content/locals'

interface Props {
  context: string
  actions?: string
  exportType?: string | null
  planStatus?: 'UNPAID' | 'PAID'
  lang: Language
  onCreatePalette?: React.MouseEventHandler
  onCreateLocalStyles?: React.MouseEventHandler
  onUpdateLocalStyles?: React.MouseEventHandler
  onCreateLocalVariables?: React.MouseEventHandler
  onUpdateLocalVariables?: React.MouseEventHandler
  onExportPalette?: React.MouseEventHandler
  onChangeActions?: (value: string) => void
}

export default class Actions extends React.Component<Props> {
  // Templates
  LocalStyles = () => {
    return (
      <>
        <Feature
          isActive={
            features.find((feature) => feature.name === 'UPDATE_LOCAL_STYLES')
              .isActive
          }
        >
          <Button
            type="secondary"
            label={locals[this.props.lang].actions.updateLocalStyles}
            feature="UPDATE_LOCAL_STYLES"
            action={this.props.onUpdateLocalStyles}
          />
        </Feature>
        <Feature
          isActive={
            features.find((feature) => feature.name === 'CREATE_LOCAL_STYLES')
              .isActive
          }
        >
          <Button
            type="primary"
            label={locals[this.props.lang].actions.createLocalStyles}
            feature="CREATE_LOCAL_STYLES"
            action={this.props.onCreateLocalStyles}
          />
        </Feature>
      </>
    )
  }

  LocalVariables = () => {
    return (
      <>
        <Feature
          isActive={
            features.find(
              (feature) => feature.name === 'UPDATE_LOCAL_VARIABLES'
            ).isActive
          }
        >
          <Button
            type="secondary"
            label={locals[this.props.lang].actions.updateLocalVariables}
            feature="UPDATE_LOCAL_VARIABLES"
            action={this.props.onUpdateLocalVariables}
          />
        </Feature>
        <Feature
          isActive={
            features.find(
              (feature) => feature.name === 'CREATE_LOCAL_VARIABLES'
            ).isActive
          }
        >
          <Button
            type="primary"
            label={locals[this.props.lang].actions.createLocalVariables}
            feature="CREATE_LOCAL_VARIABLES"
            action={this.props.onCreateLocalVariables}
          />
        </Feature>
      </>
    )
  }

  Create = () => {
    return (
      <div className="actions">
        <div className="actions__right">
          <Feature
            isActive={
              features.find((feature) => feature.name === 'CREATE_PALETTE')
                .isActive
            }
          >
            <Button
              type="primary"
              label={locals[this.props.lang].actions.createPalette}
              feature="CREATE_PALETTE"
              action={this.props.onCreatePalette}
            />
          </Feature>
        </div>
        <div className="actions__left"></div>
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
            id="types"
            options={[
              {
                label:
                  locals[this.props.lang].actions.managePalette.localStyles,
                value: 'LOCAL_STYLES',
                position: 0,
                isActive: features.find(
                  (feature) => feature.name === 'LOCAL_STYLES'
                ).isActive,
                isBlocked: isBlocked('LOCAL_STYLES', this.props.planStatus),
              },
              {
                label:
                  locals[this.props.lang].actions.managePalette.localVariables,
                value: 'LOCAL_VARIABLES',
                position: 1,
                isActive: features.find(
                  (feature) => feature.name === 'LOCAL_VARIABLES'
                ).isActive,
                isBlocked: isBlocked('LOCAL_VARIABLES', this.props.planStatus),
              },
            ]}
            selected={this.props.actions}
            feature="UPDATE_DEPLOYMENT_ACTION"
            onChange={(e) =>
              this.props.onChangeActions(
                (e.target as HTMLElement).dataset.value
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
