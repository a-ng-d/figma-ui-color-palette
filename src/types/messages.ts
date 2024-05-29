import {
  AlgorithmVersionConfiguration,
  ColorConfiguration,
  ColorSpaceConfiguration,
  PaletteConfiguration,
  ThemeConfiguration,
  VisionSimulationModeConfiguration,
} from './configurations'
import { TextColorsThemeHexModel } from './models'

export interface ScaleMessage {
  type: 'UPDATE_SCALE'
  data: PaletteConfiguration
  isEditedInRealTime: boolean
  feature: 'ADD_STOP' | 'DELETE_STOP'
}

export interface ColorsMessage {
  type: 'UPDATE_COLORS'
  data: Array<ColorConfiguration>
  isEditedInRealTime: boolean
}

export interface ThemesMessage {
  type: 'UPDATE_THEMES'
  data: Array<ThemeConfiguration>
  isEditedInRealTime: boolean
}

export interface ViewMessage {
  type: 'UPDATE_VIEW'
  data: PaletteConfiguration
  isEditedInRealTime: boolean
}

export interface SettingsMessage {
  type: 'UPDATE_SETTINGS'
  data: {
    name: string
    description: string
    colorSpace: ColorSpaceConfiguration
    visionSimulationMode: VisionSimulationModeConfiguration
    textColorsTheme: TextColorsThemeHexModel
    algorithmVersion: AlgorithmVersionConfiguration
  }
  isEditedInRealTime: boolean
  isSynchronized: boolean
}
