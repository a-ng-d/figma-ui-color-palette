import * as React from 'react'
import Feature from '../components/Feature'
import Button from '../components/Button'
import features from '../../utils/features'
import Dropdown from '../components/Dropdown'
import FormItem from '../components/FormItem'
import isBlocked from '../../utils/isBlocked'
import { locals } from '../../content/locals'

interface Props {
  context: string
  view?: string
  exportType?: string | null
  editorType?: string
  planStatus?: string
  onCreatePalette?: React.MouseEventHandler
  ononCreateLocalStyles?: React.MouseEventHandler
  ononUpdateLocalStyles?: React.MouseEventHandler
  onChangeView?: React.ChangeEventHandler
  onExportPalette?: React.MouseEventHandler
}

export default class Actions extends React.Component<Props> {
  static defaultProps = {
    editorType: 'figma',
  }

  // Templates
  Create = () => {
    return (
      <div className="actions">
        <div className="actions__buttons">
          <Feature
            isActive={
              features.find((feature) => feature.name === 'CREATE_PALETTE')
                .isActive
            }
          >
            <Button
              type="primary"
              label={locals.en.actions.createPalette}
              feature="CREATE"
              action={this.props.onCreatePalette}
            />
          </Feature>
        </div>
        <div className="actions__view">
          <Feature
            isActive={
              features.find((feature) => feature.name === 'VIEWS').isActive
            }
          >
            <FormItem
              id="change-view"
              label={locals.en.views.title}
            >
              <Dropdown
                id="views"
                options={[
                  {
                    label: locals.en.views.detailed,
                    value: 'PALETTE_WITH_PROPERTIES',
                    position: 0,
                    isActive: features.find(
                      (feature) =>
                        feature.name === 'VIEWS_PALETTE_WITH_PROPERTIES'
                    ).isActive,
                    isBlocked: isBlocked(
                      'VIEWS_PALETTE_WITH_PROPERTIES',
                      this.props.planStatus
                    ),
                  },
                  {
                    label: locals.en.views.simple,
                    value: 'PALETTE',
                    position: 1,
                    isActive: features.find(
                      (feature) => feature.name === 'VIEWS_PALETTE'
                    ).isActive,
                    isBlocked: isBlocked(
                      'VIEWS_PALETTE',
                      this.props.planStatus
                    ),
                  },
                  {
                    label: locals.en.views.sheet,
                    value: 'SHEET',
                    position: 2,
                    isActive: features.find(
                      (feature) => feature.name === 'VIEWS_SHEET'
                    ).isActive,
                    isBlocked: isBlocked('VIEWS_SHEET', this.props.planStatus),
                  },
                ]}
                selected={this.props.view}
                onChange={this.props.onChangeView}
              />
            </FormItem>
          </Feature>
        </div>
      </div>
    )
  }

  Edit = () => {
    return (
      <div className="actions">
        <div className="actions__buttons">
          <Feature
            isActive={
              features.find((feature) => feature.name === 'UPDATE_LOCAL_STYLES')
                .isActive && this.props.editorType === 'figma'
            }
          >
            <Button
              type="secondary"
              label={locals.en.actions.updateLocalStyles}
              feature="update"
              action={this.props.ononUpdateLocalStyles}
            />
          </Feature>
          <Feature
            isActive={
              features.find((feature) => feature.name === 'CREATE_LOCAL_STYLES')
                .isActive && this.props.editorType === 'figma'
            }
          >
            <Button
              type="primary"
              label={locals.en.actions.createLocalStyles}
              feature="CREATE"
              action={this.props.ononCreateLocalStyles}
            />
          </Feature>
        </div>
        <div className="actions__view">
          <Feature
            isActive={
              features.find((feature) => feature.name === 'VIEWS').isActive
            }
          >
            <FormItem
              id="change-view"
              label={locals.en.views.title}
            >
              <Dropdown
                id="views"
                options={[
                  {
                    label: locals.en.views.detailed,
                    value: 'PALETTE_WITH_PROPERTIES',
                    position: 0,
                    isActive: features.find(
                      (feature) =>
                        feature.name === 'VIEWS_PALETTE_WITH_PROPERTIES'
                    ).isActive,
                    isBlocked: isBlocked(
                      'VIEWS_PALETTE_WITH_PROPERTIES',
                      this.props.planStatus
                    ),
                  },
                  {
                    label: locals.en.views.simple,
                    value: 'PALETTE',
                    position: 1,
                    isActive: features.find(
                      (feature) => feature.name === 'VIEWS_PALETTE'
                    ).isActive,
                    isBlocked: isBlocked(
                      'VIEWS_PALETTE',
                      this.props.planStatus
                    ),
                  },
                  {
                    label: locals.en.views.sheet,
                    value: 'SHEET',
                    position: 2,
                    isActive: features.find(
                      (feature) => feature.name === 'VIEWS_SHEET'
                    ).isActive,
                    isBlocked: isBlocked('VIEWS_SHEET', this.props.planStatus),
                  },
                ]}
                selected={this.props.view}
                onChange={this.props.onChangeView}
              />
            </FormItem>
          </Feature>
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
            label={`${locals.en.actions.export} ${this.props.exportType}`}
            feature="export"
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
        {this.props.context === 'EDIT' ? <this.Edit /> : null}
        {this.props.context === 'EXPORT' ? <this.Export /> : null}
      </>
    )
  }
}
