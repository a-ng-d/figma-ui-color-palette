export interface Features {
  name: string
  description: string
  isActive: boolean
  isPro: boolean
  type: string
  service: Array<string>
}

export interface ReleaseNote {
  version: string
  isMostRecent: boolean
  title: string
  image: string
  content: string
  learnMore: string
}

export interface Shortcut {
  label: string
  isLink: boolean
  url: string
  action: any
}

// Palette nodes
export interface PaletteNode {
  paletteName: string
  scale: ScaleConfiguration
  colors: Array<ColorConfiguration>
  properties: boolean
  preset: PresetConfiguration
  textColorsTheme: TextColorsThemeHexModel
  algorithmVersion: string
}

// Palette configurations
export interface PaletteConfiguration {
  name: string
  scale: ScaleConfiguration
  min: number
  max: number
  properties: boolean
  preset: PresetConfiguration | any
  textColorsTheme: TextColorsThemeHexModel
}

export interface PresetConfiguration {
  name: string
  scale: Array<number>
  min: number
  max: number
}

export interface ScaleConfiguration {
  [key: string]: string
}

export interface ColorConfiguration {
  name: string
  rgb: {
    r: number
    g: number
    b: number
  }
  id: string | undefined
  oklch: boolean
  hueShifting: number
}

export interface ExportConfiguration {
  format: string
  mimeType: string
  data: any
}

// Processes
export interface DispatchProcess {
  time: number
  callback: () => void
  on: {
    active: boolean
    blocked: boolean
    interval: string
    send: () => void
    stop: () => void
    status: boolean
  }
}

export interface SelectedColor {
  id: string
  position: number
}

export interface HoveredColor extends SelectedColor {
  hasGuideAbove: boolean
  hasGuideBelow: boolean
}

// Models
export interface RgbModel {
  r: number
  g: number
  b: number
}

export interface TextColorsThemeHexModel {
  lightColor: string
  darkColor: string
}

export interface TextColorsThemeGLModel {
  lightColor: Array<number>
  darkColor: Array<number>
}

// Messages
export interface ColorsMessage {
  type: string
  data: Array<ColorConfiguration>
  isEditedInRealTime: boolean
}

export interface SettingsMessage {
  type: string
  data: {
    name: string
    algorithmVersion: string
    textColorsTheme: TextColorsThemeHexModel
  }
  isEditedInRealTime: boolean
}
