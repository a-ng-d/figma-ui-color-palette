import * as React from 'react'
import Button from '../components/Button'
import Feature from '../components/Feature'
import { features } from '../../utils/features'
import Dropdown from '../components/Dropdown'
import FormItem from '../components/FormItem'

interface Props {
  context: string
  hasProperties?: boolean
  view?: string
  exportType?: string | null
  onCreatePalette?: React.MouseEventHandler
  onCreateLocalColors?: React.MouseEventHandler
  onUpdateLocalColors?: React.MouseEventHandler
  onChangeView?: React.ChangeEventHandler
  onExportPalette?: React.MouseEventHandler
}

export default class Actions extends React.Component<Props> {
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
              label="Create a color palette"
              feature="create"
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
              label="View"
            >
              <Dropdown
                id="views"
                options={[
                  {
                    label: 'Palette with properties',
                    value: 'PALETTE_WITH_PROPERTIES'
                 },
                 {
                  label: 'Palette',
                  value: 'PALETTE',
                 },
                 {
                  label: 'Color sheet',
                  value: 'SHEET'
                 }
                ]}
                selected={'Palette with properties'}
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
                .isActive
            }
          >
            <Button
              type="secondary"
              label="Update the local styles"
              feature="update"
              action={this.props.onUpdateLocalColors}
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
              label="Create local styles"
              feature="create"
              action={this.props.onCreateLocalColors}
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
              label="View"
            >
              <Dropdown
                id="views"
                options={[
                  {
                    label: 'Palette with properties',
                    value: 'PALETTE_WITH_PROPERTIES'
                 },
                 {
                  label: 'Palette',
                  value: 'PALETTE',
                 },
                 {
                  label: 'Color sheet',
                  value: 'SHEET'
                 }
                ]}
                selected={
                  this.props.view === 'PALETTE_WITH_PROPERTIES' ? 'Palette with properties' :
                  this.props.view === 'PALETTE' ? 'Palette' : 'Color sheet'
                }
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
            label={`Export the palette to ${this.props.exportType}`}
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
        {this.props.context === 'create' ? <this.Create /> : null}
        {this.props.context === 'edit' ? <this.Edit /> : null}
        {this.props.context === 'export' ? <this.Export /> : null}
      </>
    )
  }
}
