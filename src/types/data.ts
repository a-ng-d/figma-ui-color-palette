import { HexModel } from '@a_ng_d/figmug-ui'

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
