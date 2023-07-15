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
  name: string
  preset: PresetConfiguration
  scale: ScaleConfiguration
  colors: Array<ColorConfiguration>
  colorSpace: string
  themes: Array<ThemeConfiguration>
  view: string
  textColorsTheme: TextColorsThemeHexModel
  algorithmVersion: string
}

export interface PaletteData {
  name: string
  themes: Array<PaletteDataThemeItem>
  type: string
}

export interface PaletteDataThemeItem {
  name: string
  description: string
  colors: Array<PaletteDataColorItem>
  type: string
}

export interface PaletteDataColorItem {
  name: string
  description: string
  shades: Array<PaletteDataShadeItem>
  type: string
}

export interface PaletteDataShadeItem {
  name: string
  description: string
  hex: string
  rgb: Array<number>
  gl: Array<number>
  lch: Array<number>
  oklch: Array<number>
  lab: Array<number>
  oklab: Array<number>
  hsl: Array<number>
  type: string
}

// Palette configurations
export interface PaletteConfiguration {
  name: string
  preset: PresetConfiguration | any
  scale: ScaleConfiguration
  min: number
  max: number
  colorSpace: string
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
  description: string
  rgb: {
    r: number
    g: number
    b: number
  }
  oklch: boolean
  hueShifting: number
  id: string | undefined
}

export interface ThemeConfiguration {
  name: string
  description: string
  scale: ScaleConfiguration
  paletteBackground: string
  isEnabled: boolean
  id: string
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

export interface ThemesMessage {
  type: string
  data: Array<ThemeConfiguration>
  isEditedInRealTime: boolean
}

export interface SettingsMessage {
  type: string
  data: {
    name: string
    colorSpace: string
    textColorsTheme: TextColorsThemeHexModel
    algorithmVersion: string
  }
  isEditedInRealTime: boolean
}
