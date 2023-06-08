import * as React from 'react'
import type { TextColorsThemeHexModel } from '../../utils/types'
import FormItem from './../components/FormItem'
import Input from './../components/Input'
import Switch from '../components/Switch'
import Message from '../components/Message'
import Feature from '../components/Feature'
import { features } from '../../utils/features'

interface Props {
  paletteName: string
  textColorsTheme?: TextColorsThemeHexModel
  settings?: Array<string>
  isNewAlgorithm?: boolean
  planStatus: string
  onSettingsChange: React.ReactEventHandler
}

export default class Settings extends React.Component<Props> {
  isBlocked = (featureName: string) =>
    features.find((feature) => feature.name === featureName).isPro
      ? this.props.planStatus === 'PAID'
        ? false
        : true
      : false

  // Templates
  Base = () => {
    return (
      <div className="settings__group">
        <div className="section-controls">
          <div className="section-controls__left-part">
            <div className="section-title">Base information</div>
          </div>
        </div>
        <Feature
          isActive={
            features.find((feature) => feature.name === 'SETTINGS_PALETTE_NAME')
              .isActive
          }
        >
          <div className="settings__item">
            <FormItem
              label="Palette name"
              id="rename-palette"
              isBlocked={this.isBlocked('SETTINGS_PALETTE_NAME')}
            >
              <Input
                id="rename-palette"
                type="text"
                icon={{ type: 'none', value: null }}
                placeholder="UI Color Palette"
                value={
                  this.props.paletteName != '' ? this.props.paletteName : ''
                }
                charactersLimit={64}
                isBlocked={this.isBlocked('SETTINGS_PALETTE_NAME')}
                feature="RENAME_PALETTE"
                onChange={
                  this.isBlocked('SETTINGS_PALETTE_NAME')
                    ? () => null
                    : this.props.onSettingsChange
                }
                onFocus={
                  this.isBlocked('SETTINGS_PALETTE_NAME')
                    ? () => null
                    : this.props.onSettingsChange
                }
                onConfirm={
                  this.isBlocked('SETTINGS_PALETTE_NAME')
                    ? () => null
                    : this.props.onSettingsChange
                }
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
          <div className="section-controls__left-part">
            <div className="section-title">Contrast management</div>
          </div>
        </div>
        <Feature
          isActive={
            features.find(
              (feature) => feature.name === 'SETTINGS_TEXT_COLORS_THEME'
            ).isActive
          }
        >
          <div className="settings__item">
            <FormItem
              label="Text light color"
              id="change-text-light-color"
              isBlocked={this.isBlocked('SETTINGS_TEXT_COLORS_THEME')}
            >
              <Input
                id="change-text-light-color"
                type="color"
                icon={{ type: 'none', value: null }}
                value={this.props.textColorsTheme.lightColor}
                isBlocked={this.isBlocked('SETTINGS_TEXT_COLORS_THEME')}
                feature="CHANGE_TEXT_LIGHT_COLOR"
                onChange={
                  this.isBlocked('SETTINGS_TEXT_COLORS_THEME')
                    ? () => null
                    : this.props.onSettingsChange
                }
                onFocus={
                  this.isBlocked('SETTINGS_TEXT_COLORS_THEME')
                    ? () => null
                    : this.props.onSettingsChange
                }
              />
            </FormItem>
            <FormItem
              label="Text dark color"
              id="change-text-dark-color"
              isBlocked={this.isBlocked('SETTINGS_TEXT_COLORS_THEME')}
            >
              <Input
                id="change-text-dark-color"
                type="color"
                icon={{ type: 'none', value: null }}
                value={this.props.textColorsTheme.darkColor}
                isBlocked={this.isBlocked('SETTINGS_TEXT_COLORS_THEME')}
                feature="CHANGE_TEXT_DARK_COLOR"
                onChange={
                  this.isBlocked('SETTINGS_TEXT_COLORS_THEME')
                    ? () => null
                    : this.props.onSettingsChange
                }
                onFocus={
                  this.isBlocked('SETTINGS_TEXT_COLORS_THEME')
                    ? () => null
                    : this.props.onSettingsChange
                }
              />
            </FormItem>
            <Message
              icon="library"
              messages={[
                'The light and dark text colors serve as a reference to simulate contrast and obtain both WCAG and APCA scores',
              ]}
              isBlocked={this.isBlocked('SETTINGS_NEW_ALGORITHM')}
            />
          </div>
        </Feature>
      </div>
    )
  }

  ColorManagement = () => {
    return (
      <div className="settings__group">
        <div className="section-controls">
          <div className="section-controls__left-part">
            <div className="section-title">Color management</div>
          </div>
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
              isBlocked={this.isBlocked('SETTINGS_NEW_ALGORITHM')}
              feature="UPDATE_ALGORITHM_VERSION"
              onChange={
                this.isBlocked('SETTINGS_NEW_ALGORITHM')
                  ? () => null
                  : this.props.onSettingsChange
              }
            />
            <Message
              icon="library"
              messages={[
                'The Chroma values are harmonized to ensure consistent lightness across all shades, but this may make the colors look desaturated.',
              ]}
              isBlocked={this.isBlocked('SETTINGS_NEW_ALGORITHM')}
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
