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

// Palette
export interface PaletteNode {
  paletteName: string
  scale: Scale
  colors: Array<UIColors>
  properties: boolean
  preset: Preset
  textColorsTheme: TextColorsThemeHex
  algorithmVersion: string
}

export interface Palette {
  name: string
  scale: Scale
  min: number
  max: number
  properties: boolean
  preset: Preset | {}
  textColorsTheme: TextColorsThemeHex
}

export interface Preset {
  name: string
  scale: Array<number>
  min: number
  max: number
}

export interface Scale {
  [key: string]: string
}

export interface UIColors {
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

// Utils
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

export interface Rgb {
  r: number
  g: number
  b: number
}

export interface TextColorsThemeHex {
  lightColor: string
  darkColor: string
}

export interface TextColorsThemeGL {
  lightColor: Array<number>
  darkColor: Array<number>
}

export interface Shortcut {
  label: string
  isLink: boolean
  url: string
  action: any
}

export interface ExportPalette {
  format: string
  mimeType: string
  data: any
}

export interface SelectedColor {
  id: string
  position: number
}

export interface HoveredColor extends SelectedColor {
  hasGuideAbove: boolean
  hasGuideBelow: boolean
}

// Messages
export interface ColorsMessage {
  type: string
  data: Array<UIColors>
  isEditedInRealTime: boolean
}

export interface SettingsMessage {
  type: string
  data: {
    name: string
    algorithmVersion: string
    textColorsTheme: TextColorsThemeHex
  }
  isEditedInRealTime: boolean
}
