import React from 'react'
import type {
  VisionSimulationModeConfiguration,
  EditorType,
  Language,
  SourceColorConfiguration,
  TextColorsThemeHexModel,
  PlanStatus,
} from '../../utils/types'
import Feature from '../components/Feature'
import { FormItem } from '@a-ng-d/figmug.layouts.form-item'
import { Input } from '@a-ng-d/figmug.inputs.input'
import { Select } from '@a-ng-d/figmug.inputs.select'
import { Message } from '@a-ng-d/figmug.dialogs.message'
import { Dropdown } from '@a-ng-d/figmug.inputs.dropdown'
import { SectionTitle } from '@a-ng-d/figmug.layouts.section-title'
import Actions from './Actions'
import features from '../../utils/config'
import isBlocked from '../../utils/isBlocked'
import { locals } from '../../content/locals'

interface SettingsProps {
  context: string
  sourceColors?: Array<SourceColorConfiguration>
  name: string
  description: string
  textColorsTheme?: TextColorsThemeHexModel
  colorSpace: string
  visionSimulationMode: VisionSimulationModeConfiguration
  view: string
  isNewAlgorithm?: boolean
  planStatus: PlanStatus
  editorType?: EditorType
  lang: Language
  onChangeSettings: React.ReactEventHandler
  onCreatePalette?: () => void
  onSyncLocalStyles?: () => void
  onSyncLocalVariables?: () => void
  onPublishPalette?: () => void
}

export default class Settings extends React.Component<SettingsProps> {
  // Templates
  Name = () => {
    return (
      <Feature
        isActive={
          features.find((feature) => feature.name === 'SETTINGS_PALETTE_NAME')
            ?.isActive
        }
      >
        <div className="settings__item">
          <FormItem
            label={locals[this.props.lang].settings.global.name.label}
            id="update-palette-name"
            isBlocked={isBlocked(
              'SETTINGS_PALETTE_NAME',
              this.props.planStatus
            )}
          >
            <Input
              id="update-palette-name"
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

  Description = () => {
    return (
      <Feature
        isActive={
          features.find(
            (feature) => feature.name === 'SETTINGS_PALETTE_DESCRIPTION'
          )?.isActive
        }
      >
        <div className="settings__item">
          <FormItem
            label={locals[this.props.lang].settings.global.description.label}
            id="update-palette-description"
            isBlocked={isBlocked(
              'SETTINGS_PALETTE_DESCRIPTION',
              this.props.planStatus
            )}
          >
            <Input
              id="update-palette-description"
              type="LONG_TEXT"
              placeholder={
                locals[this.props.lang].global.description.placeholder
              }
              value={this.props.description}
              isBlocked={isBlocked(
                'SETTINGS_PALETTE_DESCRIPTION',
                this.props.planStatus
              )}
              feature="UPDATE_DESCRIPTION"
              onFocus={
                isBlocked('SETTINGS_PALETTE_DESCRIPTION', this.props.planStatus)
                  ? () => null
                  : this.props.onChangeSettings
              }
              onBlur={
                isBlocked('SETTINGS_PALETTE_DESCRIPTION', this.props.planStatus)
                  ? () => null
                  : this.props.onChangeSettings
              }
              onConfirm={
                isBlocked('SETTINGS_PALETTE_DESCRIPTION', this.props.planStatus)
                  ? () => null
                  : this.props.onChangeSettings
              }
            />
          </FormItem>
        </div>
      </Feature>
    )
  }

  View = () => {
    return (
      <Feature
        isActive={
          features.find((feature) => feature.name === 'VIEWS')?.isActive
        }
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
                  feature: 'UPDATE_VIEW',
                  position: 0,
                  type: 'OPTION',
                  isActive: features.find(
                    (feature) =>
                      feature.name === 'VIEWS_PALETTE_WITH_PROPERTIES'
                  )?.isActive,
                  isBlocked: isBlocked(
                    'VIEWS_PALETTE_WITH_PROPERTIES',
                    this.props.planStatus
                  ),
                  isNew: features.find(
                    (feature) =>
                      feature.name === 'VIEWS_PALETTE_WITH_PROPERTIES'
                  )?.isNew,
                  children: [],
                  action: this.props.onChangeSettings,
                },
                {
                  label: locals[this.props.lang].settings.global.views.simple,
                  value: 'PALETTE',
                  feature: 'UPDATE_VIEW',
                  position: 1,
                  type: 'OPTION',
                  isActive: features.find(
                    (feature) => feature.name === 'VIEWS_PALETTE'
                  )?.isActive,
                  isBlocked: isBlocked('VIEWS_PALETTE', this.props.planStatus),
                  isNew: features.find(
                    (feature) => feature.name === 'VIEWS_PALETTE'
                  )?.isNew,
                  children: [],
                  action: this.props.onChangeSettings,
                },
                {
                  label: locals[this.props.lang].settings.global.views.sheet,
                  value: 'SHEET',
                  feature: 'UPDATE_VIEW',
                  position: 2,
                  type: 'OPTION',
                  isActive: features.find(
                    (feature) => feature.name === 'VIEWS_SHEET'
                  )?.isActive,
                  isBlocked: isBlocked('VIEWS_SHEET', this.props.planStatus),
                  isNew: features.find(
                    (feature) => feature.name === 'VIEWS_SHEET'
                  )?.isNew,
                  children: [],
                  action: this.props.onChangeSettings,
                },
              ]}
              selected={this.props.view}
              isNew={
                features.find((feature) => feature.name === 'VIEWS')?.isNew
              }
            />
          </FormItem>
        </div>
      </Feature>
    )
  }

  ColorSpace = () => {
    return (
      <Feature
        isActive={
          features.find((feature) => feature.name === 'SETTINGS_COLOR_SPACE')
            ?.isActive
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
                  feature: 'UPDATE_COLOR_SPACE',
                  position: 0,
                  type: 'OPTION',
                  isActive: features.find(
                    (feature) => feature.name === 'SETTINGS_COLOR_SPACE_LCH'
                  )?.isActive,
                  isBlocked: isBlocked(
                    'SETTINGS_COLOR_SPACE_LCH',
                    this.props.planStatus
                  ),
                  isNew: features.find(
                    (feature) => feature.name === 'SETTINGS_COLOR_SPACE_LCH'
                  )?.isNew,
                  children: [],
                  action: this.props.onChangeSettings,
                },
                {
                  label:
                    locals[this.props.lang].settings.color.colorSpace.oklch,
                  value: 'OKLCH',
                  feature: 'UPDATE_COLOR_SPACE',
                  position: 1,
                  type: 'OPTION',
                  isActive: features.find(
                    (feature) => feature.name === 'SETTINGS_COLOR_SPACE_OKLCH'
                  )?.isActive,
                  isBlocked: isBlocked(
                    'SETTINGS_COLOR_SPACE_OKLCH',
                    this.props.planStatus
                  ),
                  isNew: features.find(
                    (feature) => feature.name === 'SETTINGS_COLOR_SPACE_OKLCH'
                  )?.isNew,
                  children: [],
                  action: this.props.onChangeSettings,
                },
                {
                  label: locals[this.props.lang].settings.color.colorSpace.lab,
                  value: 'LAB',
                  feature: 'UPDATE_COLOR_SPACE',
                  position: 2,
                  type: 'OPTION',
                  isActive: features.find(
                    (feature) => feature.name === 'SETTINGS_COLOR_SPACE_LAB'
                  )?.isActive,
                  isBlocked: isBlocked(
                    'SETTINGS_COLOR_SPACE_LAB',
                    this.props.planStatus
                  ),
                  isNew: features.find(
                    (feature) => feature.name === 'SETTINGS_COLOR_SPACE_LAB'
                  )?.isNew,
                  children: [],
                  action: this.props.onChangeSettings,
                },
                {
                  label:
                    locals[this.props.lang].settings.color.colorSpace.oklab,
                  value: 'OKLAB',
                  feature: 'UPDATE_COLOR_SPACE',
                  position: 3,
                  type: 'OPTION',
                  isActive: features.find(
                    (feature) => feature.name === 'SETTINGS_COLOR_SPACE_OKLAB'
                  )?.isActive,
                  isBlocked: isBlocked(
                    'SETTINGS_COLOR_SPACE_OKLAB',
                    this.props.planStatus
                  ),
                  isNew: features.find(
                    (feature) => feature.name === 'SETTINGS_COLOR_SPACE_OKLAB'
                  )?.isNew,
                  children: [],
                  action: this.props.onChangeSettings,
                },
                {
                  label: locals[this.props.lang].settings.color.colorSpace.hsl,
                  value: 'HSL',
                  feature: 'UPDATE_COLOR_SPACE',
                  position: 4,
                  type: 'OPTION',
                  isActive: features.find(
                    (feature) => feature.name === 'SETTINGS_COLOR_SPACE_HSL'
                  )?.isActive,
                  isBlocked: isBlocked(
                    'SETTINGS_COLOR_SPACE_HSL',
                    this.props.planStatus
                  ),
                  isNew: features.find(
                    (feature) => feature.name === 'SETTINGS_COLOR_SPACE_HSL'
                  )?.isNew,
                  children: [],
                  action: this.props.onChangeSettings,
                },
                {
                  label:
                    locals[this.props.lang].settings.color.colorSpace.hsluv,
                  value: 'HSLUV',
                  feature: 'UPDATE_COLOR_SPACE',
                  position: 5,
                  type: 'OPTION',
                  isActive: features.find(
                    (feature) => feature.name === 'SETTINGS_COLOR_SPACE_HSLUV'
                  )?.isActive,
                  isBlocked: isBlocked(
                    'SETTINGS_COLOR_SPACE_HSLUV',
                    this.props.planStatus
                  ),
                  isNew: features.find(
                    (feature) => feature.name === 'SETTINGS_COLOR_SPACE_HSLUV'
                  )?.isNew,
                  children: [],
                  action: this.props.onChangeSettings,
                },
              ]}
              selected={this.props.colorSpace}
              isNew={
                features.find(
                  (feature) => feature.name === 'SETTINGS_COLOR_SPACE'
                )?.isNew
              }
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

  VisionSimulationMode = () => {
    return (
      <Feature
        isActive={
          features.find(
            (feature) => feature.name === 'SETTINGS_VISION_SIMULATION_MODE'
          )?.isActive
        }
      >
        <div className="settings__item">
          <FormItem
            id="change-color-blind-mode"
            label={
              locals[this.props.lang].settings.color.visionSimulationMode.label
            }
          >
            <Dropdown
              id="color-blind-modes"
              options={[
                {
                  label:
                    locals[this.props.lang].settings.color.visionSimulationMode
                      .none,
                  value: 'NONE',
                  feature: 'UPDATE_COLOR_BLIND_MODE',
                  position: 0,
                  type: 'OPTION',
                  isActive: features.find(
                    (feature) =>
                      feature.name === 'SETTINGS_VISION_SIMULATION_MODE_NONE'
                  )?.isActive,
                  isBlocked: isBlocked(
                    'SETTINGS_VISION_SIMULATION_MODE_NONE',
                    this.props.planStatus
                  ),
                  children: [],
                  action: this.props.onChangeSettings,
                },
                {
                  label: null,
                  value: null,
                  feature: null,
                  position: 1,
                  type: 'SEPARATOR',
                  isActive: true,
                  isBlocked: false,
                  children: [],
                  action: () => null,
                },
                {
                  label:
                    locals[this.props.lang].settings.color.visionSimulationMode
                      .colorBlind,
                  value: null,
                  feature: null,
                  position: 2,
                  type: 'TITLE',
                  isActive: true,
                  isBlocked: false,
                  children: [],
                  action: () => null,
                },
                {
                  label:
                    locals[this.props.lang].settings.color.visionSimulationMode
                      .protanomaly,
                  value: 'PROTANOMALY',
                  feature: 'UPDATE_COLOR_BLIND_MODE',
                  position: 3,
                  type: 'OPTION',
                  isActive: features.find(
                    (feature) =>
                      feature.name ===
                      'SETTINGS_VISION_SIMULATION_MODE_PROTANOMALY'
                  )?.isActive,
                  isBlocked: isBlocked(
                    'SETTINGS_VISION_SIMULATION_MODE_PROTANOMALY',
                    this.props.planStatus
                  ),
                  isNew: features.find(
                    (feature) =>
                      feature.name ===
                      'SETTINGS_VISION_SIMULATION_MODE_PROTANOMALY'
                  )?.isNew,
                  children: [],
                  action: this.props.onChangeSettings,
                },
                {
                  label:
                    locals[this.props.lang].settings.color.visionSimulationMode
                      .protanopia,
                  value: 'PROTANOPIA',
                  feature: 'UPDATE_COLOR_BLIND_MODE',
                  position: 4,
                  type: 'OPTION',
                  isActive: features.find(
                    (feature) =>
                      feature.name ===
                      'SETTINGS_VISION_SIMULATION_MODE_PROTANOPIA'
                  )?.isActive,
                  isBlocked: isBlocked(
                    'SETTINGS_VISION_SIMULATION_MODE_PROTANOPIA',
                    this.props.planStatus
                  ),
                  isNew: features.find(
                    (feature) =>
                      feature.name ===
                      'SETTINGS_VISION_SIMULATION_MODE_PROTANOPIA'
                  )?.isNew,
                  children: [],
                  action: this.props.onChangeSettings,
                },
                {
                  label:
                    locals[this.props.lang].settings.color.visionSimulationMode
                      .deuteranomaly,
                  value: 'DEUTERANOMALY',
                  feature: 'UPDATE_COLOR_BLIND_MODE',
                  position: 5,
                  type: 'OPTION',
                  isActive: features.find(
                    (feature) =>
                      feature.name ===
                      'SETTINGS_VISION_SIMULATION_MODE_DEUTERANOMALY'
                  )?.isActive,
                  isBlocked: isBlocked(
                    'SETTINGS_VISION_SIMULATION_MODE_DEUTERANOMALY',
                    this.props.planStatus
                  ),
                  isNew: features.find(
                    (feature) =>
                      feature.name ===
                      'SETTINGS_VISION_SIMULATION_MODE_DEUTERANOMALY'
                  )?.isNew,
                  children: [],
                  action: this.props.onChangeSettings,
                },
                {
                  label:
                    locals[this.props.lang].settings.color.visionSimulationMode
                      .deuteranopia,
                  value: 'DEUTERANOPIA',
                  feature: 'UPDATE_COLOR_BLIND_MODE',
                  position: 6,
                  type: 'OPTION',
                  isActive: features.find(
                    (feature) =>
                      feature.name ===
                      'SETTINGS_VISION_SIMULATION_MODE_DEUTERANOPIA'
                  )?.isActive,
                  isBlocked: isBlocked(
                    'SETTINGS_VISION_SIMULATION_MODE_DEUTERANOPIA',
                    this.props.planStatus
                  ),
                  isNew: features.find(
                    (feature) =>
                      feature.name ===
                      'SETTINGS_VISION_SIMULATION_MODE_DEUTERANOPIA'
                  )?.isNew,
                  children: [],
                  action: this.props.onChangeSettings,
                },
                {
                  label:
                    locals[this.props.lang].settings.color.visionSimulationMode
                      .tritanomaly,
                  value: 'TRITANOMALY',
                  feature: 'UPDATE_COLOR_BLIND_MODE',
                  position: 7,
                  type: 'OPTION',
                  isActive: features.find(
                    (feature) =>
                      feature.name ===
                      'SETTINGS_VISION_SIMULATION_MODE_TRITANOMALY'
                  )?.isActive,
                  isBlocked: isBlocked(
                    'SETTINGS_VISION_SIMULATION_MODE_TRITANOMALY',
                    this.props.planStatus
                  ),
                  isNew: features.find(
                    (feature) =>
                      feature.name ===
                      'SETTINGS_VISION_SIMULATION_MODE_TRITANOMALY'
                  )?.isNew,
                  children: [],
                  action: this.props.onChangeSettings,
                },
                {
                  label:
                    locals[this.props.lang].settings.color.visionSimulationMode
                      .tritanopia,
                  value: 'TRITANOPIA',
                  feature: 'UPDATE_COLOR_BLIND_MODE',
                  position: 8,
                  type: 'OPTION',
                  isActive: features.find(
                    (feature) =>
                      feature.name ===
                      'SETTINGS_VISION_SIMULATION_MODE_TRITANOPIA'
                  )?.isActive,
                  isBlocked: isBlocked(
                    'SETTINGS_VISION_SIMULATION_MODE_TRITANOPIA',
                    this.props.planStatus
                  ),
                  isNew: features.find(
                    (feature) =>
                      feature.name ===
                      'SETTINGS_VISION_SIMULATION_MODE_TRITANOPIA'
                  )?.isNew,
                  children: [],
                  action: this.props.onChangeSettings,
                },
                {
                  label:
                    locals[this.props.lang].settings.color.visionSimulationMode
                      .achromatomaly,
                  value: 'ACHROMATOMALY',
                  feature: 'UPDATE_COLOR_BLIND_MODE',
                  position: 9,
                  type: 'OPTION',
                  isActive: features.find(
                    (feature) =>
                      feature.name ===
                      'SETTINGS_VISION_SIMULATION_MODE_ACHROMATOMALY'
                  )?.isActive,
                  isBlocked: isBlocked(
                    'SETTINGS_VISION_SIMULATION_MODE_ACHROMATOMALY',
                    this.props.planStatus
                  ),
                  isNew: features.find(
                    (feature) =>
                      feature.name ===
                      'SETTINGS_VISION_SIMULATION_MODE_ACHROMATOMALY'
                  )?.isNew,
                  children: [],
                  action: this.props.onChangeSettings,
                },
                {
                  label:
                    locals[this.props.lang].settings.color.visionSimulationMode
                      .achromatopsia,
                  value: 'ACHROMATOPSIA',
                  feature: 'UPDATE_COLOR_BLIND_MODE',
                  position: 10,
                  type: 'OPTION',
                  isActive: features.find(
                    (feature) =>
                      feature.name ===
                      'SETTINGS_VISION_SIMULATION_MODE_ACHROMATOPSIA'
                  )?.isActive,
                  isBlocked: isBlocked(
                    'SETTINGS_VISION_SIMULATION_MODE_ACHROMATOPSIA',
                    this.props.planStatus
                  ),
                  isNew: features.find(
                    (feature) =>
                      feature.name ===
                      'SETTINGS_VISION_SIMULATION_MODE_ACHROMATOPSIA'
                  )?.isNew,
                  children: [],
                  action: this.props.onChangeSettings,
                },
              ]}
              selected={this.props.visionSimulationMode}
              isNew={
                features.find(
                  (feature) =>
                    feature.name === 'SETTINGS_VISION_SIMULATION_MODE'
                )?.isNew
              }
            />
          </FormItem>
        </div>
      </Feature>
    )
  }

  NewAlgorithm = () => {
    return (
      <Feature
        isActive={
          features.find((feature) => feature.name === 'SETTINGS_NEW_ALGORITHM')
            ?.isActive
        }
      >
        <div className="settings__item">
          <Select
            id="update-algorithm"
            type="SWITCH_BUTTON"
            name="algorythm"
            label={locals[this.props.lang].settings.color.newAlgorithm.label}
            isChecked={this.props.isNewAlgorithm ?? true}
            isBlocked={isBlocked(
              'SETTINGS_NEW_ALGORITHM',
              this.props.planStatus
            )}
            isNew={
              features.find(
                (feature) => feature.name === 'SETTINGS_NEW_ALGORITHM'
              )?.isNew
            }
            feature="UPDATE_ALGORITHM_VERSION"
            onChange={
              isBlocked('SETTINGS_NEW_ALGORITHM', this.props.planStatus)
                ? () => null
                : this.props.onChangeSettings
            }
          />
          <Message
            icon="key"
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

  TextColorsTheme = () => {
    return (
      <Feature
        isActive={
          features.find(
            (feature) => feature.name === 'SETTINGS_TEXT_COLORS_THEME'
          )?.isActive
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
              value={this.props.textColorsTheme?.lightColor ?? '#FFFFFF'}
              isBlocked={isBlocked(
                'SETTINGS_TEXT_COLORS_THEME',
                this.props.planStatus
              )}
              isDisabled={isBlocked(
                'SETTINGS_TEXT_COLORS_THEME',
                this.props.planStatus
              )}
              isNew={
                features.find(
                  (feature) => feature.name === 'SETTINGS_TEXT_COLORS_THEME'
                )?.isNew
              }
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
              value={this.props.textColorsTheme?.darkColor ?? '#OOOOOO'}
              isBlocked={isBlocked(
                'SETTINGS_TEXT_COLORS_THEME',
                this.props.planStatus
              )}
              isDisabled={isBlocked(
                'SETTINGS_TEXT_COLORS_THEME',
                this.props.planStatus
              )}
              isNew={
                features.find(
                  (feature) => feature.name === 'SETTINGS_TEXT_COLORS_THEME'
                )?.isNew
              }
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
            icon="key"
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
            <SectionTitle
              label={locals[this.props.lang].settings.global.title}
            />
          </div>
        </div>
        <this.Name />
        <this.Description />
        <this.View />
      </div>
    )
  }

  ColorManagement = () => {
    return (
      <div className="settings__group">
        <div className="section-controls">
          <div className="section-controls__left-part">
            <SectionTitle
              label={locals[this.props.lang].settings.color.title}
            />
          </div>
        </div>
        <this.ColorSpace />
        <this.VisionSimulationMode />
        {this.props.context === 'LOCAL_STYLES' ? <this.NewAlgorithm /> : null}
      </div>
    )
  }

  ContrastManagement = () => {
    return (
      <div className="settings__group">
        <div className="section-controls">
          <div className="section-controls__left-part">
            <SectionTitle
              label={locals[this.props.lang].settings.contrast.title}
            />
          </div>
        </div>
        <this.TextColorsTheme />
      </div>
    )
  }

  render() {
    return (
      <div className="controls__control">
        <div className="control__block control__block--no-padding">
          <this.Global />
          <this.ColorManagement />
          <this.ContrastManagement />
        </div>
        {this.props.context === 'CREATE' ? (
          <Actions
            context="CREATE"
            sourceColors={this.props.sourceColors}
            planStatus={this.props.planStatus}
            lang={this.props.lang}
            onCreatePalette={this.props.onCreatePalette}
          />
        ) : this.props.editorType === 'figma' ? (
          <Actions
            context="DEPLOY"
            planStatus={this.props.planStatus}
            lang={this.props.lang}
            onSyncLocalStyles={this.props.onSyncLocalStyles}
            onSyncLocalVariables={this.props.onSyncLocalVariables}
            onPublishPalette={this.props.onPublishPalette}
          />
        ) : null}
      </div>
    )
  }
}
