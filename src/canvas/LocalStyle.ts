import { RgbModel } from '@a_ng_d/utils-ui-color-palette'

export default class LocalStyle {
  private name: string
  private description: string
  private rgb: RgbModel
  private alpha: number
  paintStyle: PaintStyle

  constructor({
    name,
    description = '',
    rgb,
    alpha = 1,
  }: {
    name: string
    description: string
    rgb: RgbModel
    alpha?: number
  }) {
    this.name = name
    this.description = description
    this.rgb = rgb
    this.alpha = alpha
    this.paintStyle = this.makePaintStyle()
  }

  makePaintStyle = (): PaintStyle => {
    this.paintStyle = figma.createPaintStyle()
    this.paintStyle.name = this.name
    this.paintStyle.description = this.description
    this.paintStyle.paints = [
      {
        type: 'SOLID',
        color: this.rgb,
        opacity: this.alpha,
      },
    ]

    return this.paintStyle
  }
}
