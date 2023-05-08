import * as React from 'react'
import type { TextColorsThemeHex } from '../../utils/types'
import FormItem from './../components/FormItem'
import Input from './../components/Input'
import Switch from '../components/Switch'
import Message from '../components/Message'
import Feature from '../components/Feature'
import { features } from '../../utils/features'

interface Props {
  paletteName: string
  textColorsTheme?: TextColorsThemeHex
  settings?: Array<string>
  isNewAlgorithm?: boolean
  onSettingsChange: any
}

export default class Settings extends React.Component<Props> {
  // Templates
  Base = () => {
    return (
      <div className="settings__group">
        <div className="section-controls">
          <div className="section-title">Base information</div>
        </div>
        <Feature
          isActive={
            features.find((feature) => feature.name === 'SETTINGS_PALETTE_NAME')
              .isActive
          }
        >
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
        </Feature>
      </div>
    )
  }

  ContrastManagement = () => {
    return (
      <div className="settings__group">
        <div className="section-controls">
          <div className="section-title">Contrast management</div>
        </div>
        <Feature
          isActive={
            features.find(
              (feature) => feature.name === 'SETTINGS_TEXT_COLORS_THEME'
            ).isActive
          }
        >
          <div className="settings__item">
            <FormItem label="Text light color" id="change-text-light-color">
              <Input
                type="color"
                icon={{ type: 'none', value: null }}
                value={this.props.textColorsTheme.lightColor}
                feature="change-text-light-color"
                onChange={this.props.onSettingsChange}
                onFocus={this.props.onSettingsChange}
              />
            </FormItem>
            <FormItem label="Text dark color" id="change-text-dark-color">
              <Input
                type="color"
                icon={{ type: 'none', value: null }}
                value={this.props.textColorsTheme.darkColor}
                feature="change-text-dark-color"
                onChange={this.props.onSettingsChange}
                onFocus={this.props.onSettingsChange}
              />
            </FormItem>
          </div>
        </Feature>
      </div>
    )
  }

  ColorManagement = () => {
    return (
      <div className="settings__group">
        <div className="section-controls">
          <div className="section-title">Color management</div>
        </div>
        <Feature
          isActive={
            features.find(
              (feature) => feature.name === 'SETTINGS_NEW_ALGORITHM'
            ).isActive
          }
        >
          <div className="settings__item">
            <Switch
              id="update-algorithm"
              label="Enable the new algorithm for generating color shades"
              isChecked={this.props.isNewAlgorithm}
              isDisabled={false}
              feature="update-algorithm-version"
              onChange={this.props.onSettingsChange}
            />
            <Message
              icon="library"
              messages={[
                'The Chroma values are harmonized to ensure consistent lightness across all shades, but this may make the colors look desaturated.',
              ]}
            />
          </div>
        </Feature>
      </div>
    )
  }

  render() {
    return (
      <div className="settings controls__control">
        {this.props.settings.includes('base') ? <this.Base /> : null}
        {this.props.settings.includes('contrast-management') ? (
          <this.ContrastManagement />
        ) : null}
        {this.props.settings.includes('color-management') ? (
          <this.ColorManagement />
        ) : null}
      </div>
    )
  }
}
