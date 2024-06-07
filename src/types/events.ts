import { ColorSpaceConfiguration } from './configurations'

export interface TrialEnablementEvent {
  date: number
  trialTime: number
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
