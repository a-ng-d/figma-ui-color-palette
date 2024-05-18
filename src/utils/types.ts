export interface Feature {
  name: string
  description: string
  isActive: boolean
  isPro: boolean
  isNew: boolean
  type: 'SERVICE' | 'DIVISION' | 'ACTION' | 'CONTEXT'
  service: Array<Service>
}

export type Service = 'CREATE' | 'EDIT' | 'TRANSFER'

export type EditorType = 'figma' | 'figjam' | 'dev'

export type PlanStatus = 'UNPAID' | 'PAID' | 'NOT_SUPPORTED'

export type TrialStatus = 'UNUSED' | 'PENDING' | 'EXPIRED'

export type ConnectionStatus = 'CONNECTED' | 'UNCONNECTED'

export interface PublicationStatus {
  isPublished: boolean
  isShared: boolean
}

export interface CreatorIdentity {
  creatorFullName: string
  creatorAvatar: string
  creatorId: string
}

export interface UserSession {
  connectionStatus: ConnectionStatus
  userFullName: string
  userAvatar: string
  userId: string | undefined
  accessToken: string | undefined
  refreshToken: string | undefined
}

export type PriorityContext =
  | 'EMPTY'
  | 'FEEDBACK'
  | 'TRIAL_FEEDBACK'
  | 'HIGHLIGHT'
  | 'WELCOME_TO_PRO'
  | 'WELCOME_TO_TRIAL'
  | 'TRY'
  | 'ABOUT'
  | 'PUBLICATION'

export type Language = 'en-US'

export type ThirdParty = 'COOLORS' | 'REALTIME_COLORS'

export type Easing = 'LINEAR' | 'EASE_IN' | 'EASE_OUT' | 'EASE_IN_OUT'

export type NamingConvention = 'ONES' | 'TENS' | 'HUNDREDS'

export interface windowSize {
  w: number
  h: number
}

export interface ImportUrl {
  value: string
  state: 'DEFAULT' | 'ERROR' | undefined
  canBeSubmitted: boolean
  helper:
    | {
        type: 'INFO' | 'ERROR'
        message: string
      }
    | undefined
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

// Palette
export interface PaletteNode {
  name: string
  description: string
  preset: PresetConfiguration
  scale: ScaleConfiguration
  colors: Array<ColorConfiguration>
  colorSpace: ColorSpaceConfiguration
  visionSimulationMode: VisionSimulationModeConfiguration
  themes: Array<ThemeConfiguration>
  view: ViewConfiguration
  textColorsTheme: TextColorsThemeHexModel
  algorithmVersion: AlgorithmVersionConfiguration
  service?: Service
  isSynchronized?: boolean
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
  source: 'CANVAS' | ThirdParty
  id: string
}

export interface PaletteConfiguration {
  name: string
  description: string
  preset: PresetConfiguration
  scale: ScaleConfiguration
  min: number | undefined
  max: number | undefined
  colorSpace: ColorSpaceConfiguration
  visionSimulationMode: VisionSimulationModeConfiguration
  view: ViewConfiguration
  textColorsTheme: TextColorsThemeHexModel
}

export interface ExtractOfPaletteConfiguration {
  id: string
  name: string
  preset: PresetConfiguration | Record<string, never>
  colors: Array<ColorConfiguration>
  themes: Array<ThemeConfiguration>
}

export interface PresetConfiguration {
  name: string
  scale: Array<number>
  min: number
  max: number
  isDistributed: boolean
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
  format: 'JSON' | 'CSS' | 'TAILWIND' | 'SWIFT' | 'KT' | 'XML' | 'CSV'
  context:
    | 'TOKENS_GLOBAL'
    | 'TOKENS_AMZN_STYLE_DICTIONARY'
    | 'TOKENS_TOKENS_STUDIO'
    | 'CSS'
    | 'TAILWIND'
    | 'APPLE_SWIFTUI'
    | 'APPLE_UIKIT'
    | 'ANDROID_COMPOSE'
    | 'ANDROID_XML'
    | 'CSV'
  label: string
  colorSpace: ColorSpaceConfiguration
  mimeType:
    | 'application/json'
    | 'text/css'
    | 'text/javascript'
    | 'text/swift'
    | 'text/x-kotlin'
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
  | 'RGB'
  | 'HEX'
  | 'P3'

export type VisionSimulationModeConfiguration =
  | 'NONE'
  | 'PROTANOMALY'
  | 'PROTANOPIA'
  | 'DEUTERANOMALY'
  | 'DEUTERANOPIA'
  | 'TRITANOMALY'
  | 'TRITANOPIA'
  | 'ACHROMATOMALY'
  | 'ACHROMATOPSIA'

export type ViewConfiguration =
  | 'PALETTE_WITH_PROPERTIES'
  | 'PALETTE'
  | 'SHEET'
  | 'SHEET_SAFE_MODE'

export type AlgorithmVersionConfiguration = 'v1' | 'v2'

export interface DatesConfiguration {
  createdAt: Date | string
  updatedAt: Date | string
  publishedAt: Date | string
}

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
  id: string | undefined
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
    visionSimulationMode: VisionSimulationModeConfiguration
    textColorsTheme: TextColorsThemeHexModel
    algorithmVersion: AlgorithmVersionConfiguration
  }
  isEditedInRealTime: boolean
}
