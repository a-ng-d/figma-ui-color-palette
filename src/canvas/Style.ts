import type { RgbModel } from '../utils/types'

export default class Style {
  name: string
  description: string
  rgb: RgbModel
  node: PaintStyle

  constructor(name: string, description: string, rgb: RgbModel) {
    this.name = name
    this.description = description
    this.rgb = rgb
  }

  makeNode = () => {
    this.node = figma.createPaintStyle()
    this.node.name = this.name
    this.node.description = this.description
    this.node.paints = [
      {
        type: 'SOLID',
        color: this.rgb,
      },
    ]

    return this.node
  }
}
