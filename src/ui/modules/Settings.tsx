import * as React from 'react'
import type { TextColorsThemeHexModel } from '../../utils/types'
import Feature from '../components/Feature'
import FormItem from './../components/FormItem'
import Input from './../components/Input'
import Switch from '../components/Switch'
import Message from '../components/Message'
import Dropdown from '../components/Dropdown'
import Actions from './Actions'
import features from '../../utils/features'
import isBlocked from '../../utils/isBlocked'
import { locals } from '../../content/locals'

interface Props {
  context: string
  name: string
  textColorsTheme?: TextColorsThemeHexModel
  colorSpace: string
  view: string
  isNewAlgorithm?: boolean
  actions?: string
  planStatus: string
  editorType?: string
  lang: string
  onChangeSettings: React.ReactEventHandler
  onCreatePalette?: () => void
  onCreateLocalStyles?: () => void
  onUpdateLocalStyles?: () => void
  onCreateLocalVariables?: () => void
  onUpdateLocalVariables?: () => void
  onChangeActions?: (value: string) => void
}

export default class Settings extends React.Component<Props> {
  // Templates
  PaletteName = () => {
    return (
      <Feature
        isActive={
          features.find((feature) => feature.name === 'SETTINGS_PALETTE_NAME')
            .isActive
        }
      >
        <div className="settings__item">
          <FormItem
            label={locals[this.props.lang].settings.global.name.label}
            id="rename-palette"
            isBlocked={isBlocked(
              'SETTINGS_PALETTE_NAME',
              this.props.planStatus
            )}
          >
            <Input
              id="rename-palette"
              type="TEXT"
              placeholder={locals[this.props.lang].name}
              value={this.props.name != '' ? this.props.name : ''}
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
    )
  }

  view = () => {
    return (
      <Feature
        isActive={features.find((feature) => feature.name === 'VIEWS').isActive}
      >
        <div className="settings__item">
          <FormItem
            id="change-view"
            label={locals[this.props.lang].settings.global.views.label}
          >
            <Dropdown
              id="views"
              options={[
                {
                  label: locals[this.props.lang].settings.global.views.detailed,
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
                  label: locals[this.props.lang].settings.global.views.simple,
                  value: 'PALETTE',
                  position: 1,
                  isActive: features.find(
                    (feature) => feature.name === 'VIEWS_PALETTE'
                  ).isActive,
                  isBlocked: isBlocked('VIEWS_PALETTE', this.props.planStatus),
                },
                {
                  label: locals[this.props.lang].settings.global.views.sheet,
                  value: 'SHEET',
                  position: 2,
                  isActive: features.find(
                    (feature) => feature.name === 'VIEWS_SHEET'
                  ).isActive,
                  isBlocked: isBlocked('VIEWS_SHEET', this.props.planStatus),
                },
              ]}
              selected={this.props.view}
              feature="UPDATE_VIEW"
              onChange={this.props.onChangeSettings}
            />
          </FormItem>
        </div>
      </Feature>
    )
  }

  colorSpace = () => {
    return (
      <Feature
        isActive={
          features.find((feature) => feature.name === 'SETTINGS_COLOR_SPACE')
            .isActive
        }
      >
        <div className="settings__item">
          <FormItem
            id="change-color-space"
            label={locals[this.props.lang].settings.color.colorSpace.label}
          >
            <Dropdown
              id="color-spaces"
              options={[
                {
                  label: locals[this.props.lang].settings.color.colorSpace.lch,
                  value: 'LCH',
                  position: 0,
                  isActive: features.find(
                    (feature) => feature.name === 'SETTINGS_COLOR_SPACE_LCH'
                  ).isActive,
                  isBlocked: isBlocked(
                    'SETTINGS_COLOR_SPACE_LCH',
                    this.props.planStatus
                  ),
                },
                {
                  label:
                    locals[this.props.lang].settings.color.colorSpace.oklch,
                  value: 'OKLCH',
                  position: 1,
                  isActive: features.find(
                    (feature) => feature.name === 'SETTINGS_COLOR_SPACE_OKLCH'
                  ).isActive,
                  isBlocked: isBlocked(
                    'SETTINGS_COLOR_SPACE_OKLCH',
                    this.props.planStatus
                  ),
                },
                {
                  label: locals[this.props.lang].settings.color.colorSpace.lab,
                  value: 'LAB',
                  position: 2,
                  isActive: features.find(
                    (feature) => feature.name === 'SETTINGS_COLOR_SPACE_LAB'
                  ).isActive,
                  isBlocked: isBlocked(
                    'SETTINGS_COLOR_SPACE_LAB',
                    this.props.planStatus
                  ),
                },
                {
                  label:
                    locals[this.props.lang].settings.color.colorSpace.oklab,
                  value: 'OKLAB',
                  position: 3,
                  isActive: features.find(
                    (feature) => feature.name === 'SETTINGS_COLOR_SPACE_OKLAB'
                  ).isActive,
                  isBlocked: isBlocked(
                    'SETTINGS_COLOR_SPACE_OKLAB',
                    this.props.planStatus
                  ),
                },
                {
                  label: locals[this.props.lang].settings.color.colorSpace.hsl,
                  value: 'HSL',
                  position: 4,
                  isActive: features.find(
                    (feature) => feature.name === 'SETTINGS_COLOR_SPACE_HSL'
                  ).isActive,
                  isBlocked: isBlocked(
                    'SETTINGS_COLOR_SPACE_HSL',
                    this.props.planStatus
                  ),
                },
              ]}
              selected={this.props.colorSpace}
              feature="UPDATE_COLOR_SPACE"
              onChange={this.props.onChangeSettings}
            />
          </FormItem>
          {this.props.colorSpace === 'HSL' ? (
            <Message
              icon="warning"
              messages={[locals[this.props.lang].warning.hslColorSpace]}
              isBlocked={isBlocked(
                'SETTINGS_COLOR_SPACE',
                this.props.planStatus
              )}
            />
          ) : null}
        </div>
      </Feature>
    )
  }

  newAlgorithm = () => {
    return (
      <Feature
        isActive={
          features.find((feature) => feature.name === 'SETTINGS_NEW_ALGORITHM')
            .isActive
        }
      >
        <div className="settings__item">
          <Switch
            id="update-algorithm"
            label={locals[this.props.lang].settings.color.newAlgorithm.label}
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
              locals[this.props.lang].settings.color.newAlgorithm.description,
            ]}
            isBlocked={isBlocked(
              'SETTINGS_NEW_ALGORITHM',
              this.props.planStatus
            )}
          />
        </div>
      </Feature>
    )
  }

  textColorsTheme = () => {
    return (
      <Feature
        isActive={
          features.find(
            (feature) => feature.name === 'SETTINGS_TEXT_COLORS_THEME'
          ).isActive
        }
      >
        <div className="settings__item">
          <FormItem
            label={
              locals[this.props.lang].settings.contrast.textColors
                .textLightColor
            }
            id="change-text-light-color"
            isBlocked={isBlocked(
              'SETTINGS_TEXT_COLORS_THEME',
              this.props.planStatus
            )}
          >
            <Input
              id="change-text-light-color"
              type="COLOR"
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
            label={
              locals[this.props.lang].settings.contrast.textColors.textDarkColor
            }
            id="change-text-dark-color"
            isBlocked={isBlocked(
              'SETTINGS_TEXT_COLORS_THEME',
              this.props.planStatus
            )}
          >
            <Input
              id="change-text-dark-color"
              type="COLOR"
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
              locals[this.props.lang].settings.contrast.textColors
                .textThemeColorsDescription,
            ]}
            isBlocked={isBlocked(
              'SETTINGS_NEW_ALGORITHM',
              this.props.planStatus
            )}
          />
        </div>
      </Feature>
    )
  }

  Global = () => {
    return (
      <div className="settings__group">
        <div className="section-controls">
          <div className="section-controls__left-part">
            <div className="section-title">
              {locals[this.props.lang].settings.global.title}
            </div>
          </div>
        </div>
        <this.PaletteName />
        <this.view />
      </div>
    )
  }

  ColorManagement = () => {
    return (
      <div className="settings__group">
        <div className="section-controls">
          <div className="section-controls__left-part">
            <div className="section-title">
              {locals[this.props.lang].settings.color.title}
            </div>
          </div>
        </div>
        <this.colorSpace />
        {this.props.context === 'LOCAL_STYLES' ? <this.newAlgorithm /> : null}
      </div>
    )
  }

  ContrastManagement = () => {
    return (
      <div className="settings__group">
        <div className="section-controls">
          <div className="section-controls__left-part">
            <div className="section-title">
              {locals[this.props.lang].settings.contrast.title}
            </div>
          </div>
        </div>
        <this.textColorsTheme />
      </div>
    )
  }

  render() {
    return (
      <>
        <div className="settings controls__control">
          <this.Global />
          <this.ColorManagement />
          <this.ContrastManagement />
        </div>
        {this.props.context === 'CREATE' ? (
          <Actions
            context="CREATE"
            planStatus={this.props.planStatus}
            lang={this.props.lang}
            onCreatePalette={this.props.onCreatePalette}
          />
        ) : this.props.editorType === 'figma' ? (
          <Actions
            context="DEPLOY"
            actions={this.props.actions}
            planStatus={this.props.planStatus}
            lang={this.props.lang}
            onCreateLocalStyles={this.props.onCreateLocalStyles}
            onUpdateLocalStyles={this.props.onUpdateLocalStyles}
            onCreateLocalVariables={this.props.onCreateLocalVariables}
            onUpdateLocalVariables={this.props.onUpdateLocalVariables}
            onChangeActions={this.props.onChangeActions}
          />
        ) : null}
      </>
    )
  }
}
