export interface Feature {
  name: string
  description: string
  isActive: boolean
  isPro: boolean
  type: 'SERVICE' | 'DIVISION' | 'ACTION' | 'CONTEXT'
  service: Array<Service>
}

export type Service = 'CREATE' | 'EDIT'

export type EditorType = 'figma' | 'figjam'

export type PlanStatus = 'UNPAID' | 'PAID' | 'NOT_SUPPORTED' | undefined

export type TrialStatus = 'UNUSED' | 'PENDING' | 'EXPIRED'

export type Language = 'en-US'

export type PriorityContext =
  | 'EMPTY'
  | 'FEEDBACK'
  | 'TRIAL_FEEDBACK'
  | 'HIGHLIGHT'
  | 'WELCOME_TO_PRO'
  | 'WELCOME_TO_TRIAL'
  | 'TRY'
  | 'ABOUT'

export interface windowSize {
  w: number
  h: number
}

export interface ReleaseNote {
  version: string
  isMostRecent: boolean
  title: Array<string>
  image: Array<string>
  content: Array<string>
  numberOfNotes: number
  learnMore: Array<`https://${string}`>
}

export interface Shortcut {
  label: string
  isLink: boolean
  url: `https://${string}`
  action: any
}

// Palette
export interface PaletteNode {
  name: string
  description: string
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
  description: string
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
  rgb: [number, number, number]
  gl: [number, number, number, number]
  lch: [number, number, number]
  oklch: [number, number, number]
  lab: [number, number, number]
  oklab: [number, number, number]
  hsl: [number, number, number]
  hsluv: [number, number, number]
  variableId: string
  styleId: string
  type: 'source color' | 'color shade'
}

// Palette configurations
export interface SourceColorConfiguration {
  name: string
  rgb: RgbModel
  source: 'CANVAS' | 'COOLORS'
  id: string
}

export interface PaletteConfiguration {
  name: string
  description: string
  preset: PresetConfiguration | any
  scale: ScaleConfiguration
  min: number | undefined
  max: number | undefined
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

export type ColorSpaceConfiguration =
  | 'LCH'
  | 'OKLCH'
  | 'LAB'
  | 'OKLAB'
  | 'HSL'
  | 'HSLUV'

export type ViewConfiguration =
  | 'PALETTE_WITH_PROPERTIES'
  | 'PALETTE'
  | 'SHEET'
  | 'SHEET_SAFE_MODE'

export type AlgorithmVersionConfiguration = 'v1' | 'v2'

// Processes
export interface DispatchProcess {
  time: number
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
export type HexModel = `#${string}` | string

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
    textColorsTheme: TextColorsThemeHexModel
    algorithmVersion: AlgorithmVersionConfiguration
  }
  isEditedInRealTime: boolean
}
