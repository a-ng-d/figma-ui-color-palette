interface Rgb {
  r: number
  g: number
  b: number
}

export default class Style {
  name: string
  rgb: Rgb
  node: PaintStyle

  constructor(name, rgb) {
    this.name = name
    this.rgb = rgb
    this.node = figma.createPaintStyle()
  }

  makeNode() {
    this.node.name = this.name
    this.node.paints = [
      {
        type: 'SOLID',
        color: this.rgb,
      },
    ]

    return this.node
  }
}
