import { ColorSpaceConfiguration, NamingConventionConfiguration } from './configurations'
import { Easing } from './management'

export interface TrialEvent {
  date: number
  trialTime: number
}

export interface PublicationEvent {
  feature:
    | 'PUBLISH_PALETTE'
    | 'UNPUBLISH_PALETTE'
    | 'PUSH_PALETTE'
    | 'PULL_PALETTE'
    | 'REUSE_PALETTE'
    | 'SYNC_PALETTE'
    | 'REVERT_PALETTE'
    | 'DETACH_PALETTE'
    | 'ADD_PALETTE'
}

export interface ImportEvent {
  feature:
    | 'IMPORT_COOLORS'
    | 'IMPORT_REALTIME_COLORS'
    | 'IMPORT_COLOUR_LOVERS'
}

export interface ScaleEvent {
  feature:
    | 'SWITCH_MATERIAL'
    | 'SWITCH_MATERIAL_3'
    | 'SWITCH_TAILWIND'
    | 'SWITCH_ANT'
    | 'SWITCH_ADS'
    | 'SWITCH_ADS_NEUTRAL'
    | 'SWITCH_CARBON'
    | 'SWITCH_BASE'
    | 'SWITCH_CUSTOM'
    | NamingConventionConfiguration
    | Easing
}

export interface SourceColorEvent {
  feature:
    | 'RENAME_COLOR'
    | 'REMOVE_COLOR'
    | 'ADD_COLOR'
    | 'UPDATE_HEX'
    | 'UPDATE_LCH'
    | 'SHIFT_HUE'
    | 'DESCRIBE_COLOR'
}

export interface ColorThemeEvent {
  feature:
    | 'RENAME_THEME'
    | 'REMOVE_THEME'
    | 'ADD_THEME'
    | 'UPDATE_BACKGROUND'
    | 'DESCRIBE_THEME'
}

export interface ExportEvent {
  context?: string
  colorSpace?: ColorSpaceConfiguration
}

export interface SettingEvent {
  feature:
    | 'RENAME_PALETTE'
    | 'DESCRIBE_PALETTE'
    | 'UPDATE_VIEW'
    | 'UPDATE_COLOR_SPACE'
    | 'UPDATE_VISION_SIMULATION_MODE'
    | 'UPDATE_ALGORITHM'
    | 'UPDATE_TEXT_COLORS_THEME'
}
