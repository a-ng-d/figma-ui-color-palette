export interface Preset {
  name: string
  scale: Array<number>
  min: number
  max: number
}

export interface Scale {
  [key: string]: string
}

export interface Palette {
  name: string
  scale: Scale
  min: number
  max: number
  properties: boolean
  preset: any
  textColorsTheme: { [key: string]: string }
}

export interface Color {
  name: string
  rgb: {
    r: number
    g: number
    b: number
  },
  id: string
  oklch: boolean
  hueShifting: number
}

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

export interface colorsMessage {
  type: string,
  data: Array<Color>,
  isEditedInRealTime: boolean
}

export interface settingsMessage {
  type: string,
  data: {
    name: string,
    algorithmVersion: string,
    textColorsTheme: textColorThemeHex,
  },
  isEditedInRealTime: boolean
}