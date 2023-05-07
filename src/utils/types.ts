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

export interface textColorThemeHex {
  lightColor: string
  darkColor: string
}

export interface textColorThemeGL {
  lightColor: Array<number>
  darkColor: Array<number>
}