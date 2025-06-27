import {
  AlgorithmVersionConfiguration,
  ColorConfiguration,
  ColorSpaceConfiguration,
  ThemeConfiguration,
  VisionSimulationModeConfiguration,
  ExchangeConfiguration,
  TextColorsThemeConfiguration,
} from '@a_ng_d/utils-ui-color-palette'

export interface ScaleMessage {
  type: 'UPDATE_SCALE'
  id: string
  data: ExchangeConfiguration
  feature?: string
}

export interface ColorsMessage {
  type: 'UPDATE_COLORS'
  id: string
  data: Array<ColorConfiguration>
}

export interface ThemesMessage {
  type: 'UPDATE_THEMES'
  id: string
  data: Array<ThemeConfiguration>
}

export interface SettingsMessage {
  type: 'UPDATE_SETTINGS'
  id: string
  data: {
    name: string
    description: string
    colorSpace: ColorSpaceConfiguration
    visionSimulationMode: VisionSimulationModeConfiguration
    algorithmVersion: AlgorithmVersionConfiguration
    textColorsTheme: TextColorsThemeConfiguration<'HEX'>
  }
}

export interface PaletteMessage {
  type: 'UPDATE_PALETTE'
  id: string
  items: Array<{
    key: string
    value: boolean | object | string
  }>
}
