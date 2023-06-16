import * as React from 'react'
import type { TextColorsThemeHexModel } from '../../utils/types'
import FormItem from './../components/FormItem'
import Input from './../components/Input'
import Switch from '../components/Switch'
import Message from '../components/Message'
import Feature from '../components/Feature'
import features from '../../utils/features'
import isBlocked from '../../utils/isBlocked'

interface Props {
  paletteName: string
  textColorsTheme?: TextColorsThemeHexModel
  settings?: Array<string>
  isNewAlgorithm?: boolean
  planStatus: string
  onChangeSettings: React.ReactEventHandler
}

export default class Settings extends React.Component<Props> {
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
              isBlocked={isBlocked(
                'SETTINGS_PALETTE_NAME',
                this.props.planStatus
              )}
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
                isBlocked={isBlocked(
                  'SETTINGS_PALETTE_NAME',
                  this.props.planStatus
                )}
                feature="RENAME_PALETTE"
                onChange={
                  isBlocked('SETTINGS_PALETTE_NAME', this.props.planStatus)
                    ? () => null
                    : this.props.onChangeSettings
                }
                onFocus={
                  isBlocked('SETTINGS_PALETTE_NAME', this.props.planStatus)
                    ? () => null
                    : this.props.onChangeSettings
                }
                onBlur={
                  isBlocked('SETTINGS_PALETTE_NAME', this.props.planStatus)
                    ? () => null
                    : this.props.onChangeSettings
                }
                onConfirm={
                  isBlocked('SETTINGS_PALETTE_NAME', this.props.planStatus)
                    ? () => null
                    : this.props.onChangeSettings
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
              isBlocked={isBlocked(
                'SETTINGS_TEXT_COLORS_THEME',
                this.props.planStatus
              )}
            >
              <Input
                id="change-text-light-color"
                type="color"
                icon={{ type: 'none', value: null }}
                value={this.props.textColorsTheme.lightColor}
                isBlocked={isBlocked(
                  'SETTINGS_TEXT_COLORS_THEME',
                  this.props.planStatus
                )}
                feature="CHANGE_TEXT_LIGHT_COLOR"
                onChange={
                  isBlocked('SETTINGS_TEXT_COLORS_THEME', this.props.planStatus)
                    ? () => null
                    : this.props.onChangeSettings
                }
                onFocus={
                  isBlocked('SETTINGS_TEXT_COLORS_THEME', this.props.planStatus)
                    ? () => null
                    : this.props.onChangeSettings
                }
                onBlur={
                  isBlocked('SETTINGS_TEXT_COLORS_THEME', this.props.planStatus)
                    ? () => null
                    : this.props.onChangeSettings
                }
              />
            </FormItem>
            <FormItem
              label="Text dark color"
              id="change-text-dark-color"
              isBlocked={isBlocked(
                'SETTINGS_TEXT_COLORS_THEME',
                this.props.planStatus
              )}
            >
              <Input
                id="change-text-dark-color"
                type="color"
                icon={{ type: 'none', value: null }}
                value={this.props.textColorsTheme.darkColor}
                isBlocked={isBlocked(
                  'SETTINGS_TEXT_COLORS_THEME',
                  this.props.planStatus
                )}
                feature="CHANGE_TEXT_DARK_COLOR"
                onChange={
                  isBlocked('SETTINGS_TEXT_COLORS_THEME', this.props.planStatus)
                    ? () => null
                    : this.props.onChangeSettings
                }
                onFocus={
                  isBlocked('SETTINGS_TEXT_COLORS_THEME', this.props.planStatus)
                    ? () => null
                    : this.props.onChangeSettings
                }
                onBlur={
                  isBlocked('SETTINGS_TEXT_COLORS_THEME', this.props.planStatus)
                    ? () => null
                    : this.props.onChangeSettings
                }
              />
            </FormItem>
            <Message
              icon="library"
              messages={[
                'The light and dark text colors serve as a reference to simulate contrast and obtain both WCAG and APCA scores',
              ]}
              isBlocked={isBlocked(
                'SETTINGS_NEW_ALGORITHM',
                this.props.planStatus
              )}
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
              label="Enable the new algorithm for creating color shades"
              isChecked={this.props.isNewAlgorithm}
              isBlocked={isBlocked(
                'SETTINGS_NEW_ALGORITHM',
                this.props.planStatus
              )}
              feature="UPDATE_ALGORITHM_VERSION"
              onChange={
                isBlocked('SETTINGS_NEW_ALGORITHM', this.props.planStatus)
                  ? () => null
                  : this.props.onChangeSettings
              }
            />
            <Message
              icon="library"
              messages={[
                'The Chroma values are harmonized to ensure consistent lightness across all shades, but this may make the colors look desaturated.',
              ]}
              isBlocked={isBlocked(
                'SETTINGS_NEW_ALGORITHM',
                this.props.planStatus
              )}
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
