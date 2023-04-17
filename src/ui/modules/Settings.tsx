import * as React from 'react'
import FormItem from './../components/FormItem'
import Input from './../components/Input'

interface Props {
  paletteName: string
  settings?: Array<string>
  onSettingsChange: any
}

export default class Settings extends React.Component<Props> {
  render() {
    return (
      <div className="settings controls__control">
        <div className="settings__group">
          <div className="section-controls">
            <div className="section-title">Base information</div>
          </div>
          <div className="settings__item">
            <FormItem label="Palette name" id="rename-palette">
              <Input
                type="text"
                icon={{ type: 'none', value: null }}
                placeholder="UI Color Palette"
                value={
                  this.props.paletteName != '' ? this.props.paletteName : ''
                }
                charactersLimit={64}
                feature="rename-palette"
                onChange={this.props.onSettingsChange}
                onFocus={this.props.onSettingsChange}
                onConfirm={this.props.onSettingsChange}
              />
            </FormItem>
          </div>
        </div>
      </div>
    )
  }
}
