export interface Feature {
  name: string
  description: string
  isActive: boolean
  isPro: boolean
  type: 'SERVICE' | 'DIVISION' | 'ACTION' | 'CONTEXT'
  service: Array<Service>
}

export type Service = 'ONBOARD' | 'CREATE' | 'EDIT'

export type Language = 'en-US'

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

// Palette
export interface PaletteNode {
  name: string
  preset: PresetConfiguration
  scale: ScaleConfiguration
  colors: Array<ColorConfiguration>
  colorSpace: ColorSpaceConfiguration
  themes: Array<ThemeConfiguration>
  view: ViewConfiguration
  textColorsTheme: TextColorsThemeHexModel
  algorithmVersion: AlgorithmVersionConfiguration
  service?: 'CREATE' | 'EDIT'
}

export interface PaletteData {
  name: string
  themes: Array<PaletteDataThemeItem>
  collectionId: string
  type: 'palette'
}

export interface PaletteDataThemeItem {
  name: string
  description: string
  colors: Array<PaletteDataColorItem>
  modeId: string
  id: string
  type: 'default theme' | 'custom theme'
}

export interface PaletteDataColorItem {
  name: string
  description: string
  shades: Array<PaletteDataShadeItem>
  id: string
  type: 'color'
}

export interface PaletteDataShadeItem {
  name: string
  description: string
  hex: HexModel
  rgb: Array<number>
  gl: Array<number>
  lch: Array<number>
  oklch: Array<number>
  lab: Array<number>
  oklab: Array<number>
  hsl: Array<number>
  variableId: string
  styleId: string
  type: 'source color' | 'color shade'
}

// Palette configurations
export interface PaletteConfiguration {
  name: string
  preset: PresetConfiguration | any
  scale: ScaleConfiguration
  min: number
  max: number
  colorSpace: ColorSpaceConfiguration
  view: ViewConfiguration
  textColorsTheme: TextColorsThemeHexModel
}

export interface PresetConfiguration {
  name: string
  scale: Array<number>
  min: number
  max: number
  id: string
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
  id: string
}

export interface ThemeConfiguration {
  name: string
  description: string
  scale: ScaleConfiguration
  paletteBackground: HexModel
  isEnabled: boolean
  id: string
  type: 'default theme' | 'custom theme'
}

export interface ExportConfiguration {
  format: 'JSON' | 'CSS' | 'SWIFT' | 'XML' | 'CSV'
  mimeType:
    | 'application/json'
    | 'text/css'
    | 'text/swift'
    | 'text/xml'
    | 'text/csv'
  data: any
}

export type ColorSpaceConfiguration = 'LCH' | 'OKLCH' | 'LAB' | 'OKLAB' | 'HSL'

export type ViewConfiguration =
  | 'PALETTE_WITH_PROPERTIES'
  | 'PALETTE'
  | 'SHEET'
  | 'SHEET_SAFE_MODE'

export type AlgorithmVersionConfiguration = 'v1' | 'v2'

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
export type HexModel = `#${string}`

export interface RgbModel {
  r: number
  g: number
  b: number
}

export interface TextColorsThemeHexModel {
  lightColor: HexModel
  darkColor: HexModel
}

export interface TextColorsThemeGLModel {
  lightColor: Array<number>
  darkColor: Array<number>
}

// Messages
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

export interface SettingsMessage {
  type: 'UPDATE_SETTINGS'
  data: {
    name: string
    colorSpace: ColorSpaceConfiguration
    textColorsTheme: TextColorsThemeHexModel
    algorithmVersion: AlgorithmVersionConfiguration
  }
  isEditedInRealTime: boolean
}
