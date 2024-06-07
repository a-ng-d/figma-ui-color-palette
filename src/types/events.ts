import { ColorSpaceConfiguration } from "./configurations"

export interface TrialEnablementEvent {
  date: number,
  trialTime: number
}

export interface SourceColorEvent {
  feature: 'RENAME_COLOR' | 'REMOVE_COLOR' | 'ADD_COLOR' | 'UPDATE_HEX' | 'UPDATE_LCH' | 'SHIFT_HUE' | 'DESCRIBE_COLOR'
}

export interface ColorThemeEvent {
  feature: 'RENAME_THEME' | 'REMOVE_THEME' | 'ADD_THEME' | 'UPDATE_BACKGROUND' | 'DESCRIBE_THEME'
}

export interface ExportEvent {
  context?: string,
  colorSpace?: ColorSpaceConfiguration
}
