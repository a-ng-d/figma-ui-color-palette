import * as React from 'react'
import Button from '../components/Button'
import Checkbox from '../components/Checkbox'
import Switch from '../components/Switch'
import Feature from '../components/Feature'
import { features } from '../../utils/features'

interface Props {
  context: string
  hasProperties?: boolean
  exportType?: string | null
  onCreatePalette?: any
  onCreateLocalColors?: any
  onUpdateLocalColors?: any
  onChangeProperties?: any
  onExportPalette?: any
}

export default class Actions extends React.Component<Props> {
  // Templates
  Create = () => {
    return (
      <div className="actions">
        <div className="buttons">
          <Feature
            name='go create palette'
            isActive={features.find(feature => feature.name === 'go create palette').isActive}
            isPro={features.find(feature => feature.name === 'go create palette').isPro}
          >
            <Button
              type="primary"
              label="Create a color palette"
              feature="create"
              action={this.props.onCreatePalette}
            />
          </Feature>
        </div>
        <Feature
          name='properties'
          isActive={features.find(feature => feature.name === 'properties').isActive}
          isPro={features.find(feature => feature.name === 'properties').isPro}
        >
          <Checkbox
            id="show-properties"
            label="Show properties"
            isChecked={this.props.hasProperties}
            isDisabled={false}
            feature="show-properties"
            onChange={this.props.onChangeProperties}
          />
        </Feature>
      </div>
    )
  }

  Edit = () => {
    return (
      <div className="actions">
        <div className="buttons">
          <Button
            type="secondary"
            label="Update the local styles"
            feature="update"
            action={this.props.onUpdateLocalColors}
          />
          <Feature
            name='create local styles'
            isActive={features.find(feature => feature.name === 'create local styles').isActive}
            isPro={features.find(feature => feature.name === 'create local styles').isPro}
          >
            <Button
              type="primary"
              label="Create local styles"
              feature="create"
              action={this.props.onCreateLocalColors}
            />
          </Feature>
        </div>
        <Feature
          name='properties'
          isActive={features.find(feature => feature.name === 'properties').isActive}
          isPro={features.find(feature => feature.name === 'properties').isPro}
        >
          <Switch
            id="show-properties"
            label="Show properties"
            isChecked={this.props.hasProperties}
            isDisabled={false}
            feature="show-properties"
            onChange={this.props.onChangeProperties}
          />
        </Feature>
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
