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

export interface ImageFormat {
  name: string
  mimeType: string
  data: string
}

export interface Shortcut {
  label: string
  isLink: boolean
  url: string
  action: any
}

export interface Presets {
  material: PresetConfiguration
  ant: PresetConfiguration
  atlassian: PresetConfiguration
  atlassianNeutral: PresetConfiguration
  carbon: PresetConfiguration
  base: PresetConfiguration
  custom: PresetConfiguration
}

// Palette
export interface PaletteNode {
  paletteName: string
  preset: PresetConfiguration
  scale: ScaleConfiguration
  colors: Array<ColorConfiguration>
  colorSpace: string
  view: string
  textColorsTheme: TextColorsThemeHexModel
  algorithmVersion: string
}

export interface PaletteDataItem {
  name: string
  shades: Array<{
    name: string
    hex: string
    rgb: Array<number>
    gl: Array<number>
    lch: Array<number>
  }>
}

// Palette configurations
export interface PaletteConfiguration {
  name: string
  preset: PresetConfiguration | any
  scale: ScaleConfiguration
  min: number
  max: number
  view: string
  textColorsTheme: TextColorsThemeHexModel
}

export interface PresetConfiguration {
  name: string
  scale: Array<number>
  min: number
  max: number
  id: string
}

export interface ScaleConfiguration {
  [key: string]: number
}

export interface ColorConfiguration {
  name: string
  id: string | undefined
  rgb: {
    r: number
    g: number
    b: number
  }
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

export interface ActionsList {
  [action: string]: () => void
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
    textColorsTheme: TextColorsThemeHexModel
    algorithmVersion: string
  }
  isEditedInRealTime: boolean
}
