import type { RgbModel } from '../utils/types'

export default class LocalStyle {
  name: string
  description: string
  rgb: RgbModel
  paintStyle: PaintStyle

  constructor(name: string, description: string, rgb: RgbModel) {
    this.name = name
    this.description = description
    this.rgb = rgb
  }

  makePaintStyle = () => {
    this.paintStyle = figma.createPaintStyle()
    this.paintStyle.name = this.name
    this.paintStyle.description = this.description
    this.paintStyle.paints = [
      {
        type: 'SOLID',
        color: this.rgb,
      },
    ]

    return this.paintStyle
  }
}
