export default class Tag {
  name: string
  content: string
  fontSize: number
  nodeTag: FrameNode
  nodeText: TextNode
  nodeIndicator: EllipseNode

  constructor(name: string, content: string, fontSize: number) {
    this.name = name
    this.content = content
    this.fontSize = fontSize
    this.nodeTag = figma.createFrame()
    this.nodeText = figma.createText()
  }

  makeNodeTag(
    color: string | null = null,
    rgb: { [key: string]: number } = null
  ) {
    // base
    this.nodeTag.name = this.name
    this.nodeTag.fills = [
      {
        type: 'SOLID',
        opacity: 0.4,
        color: {
          r: 1,
          g: 1,
          b: 1,
        },
      },
    ]
    this.nodeTag.cornerRadius = 16

    // layout
    this.nodeTag.layoutMode = 'HORIZONTAL'
    this.nodeTag.primaryAxisSizingMode = 'AUTO'
    this.nodeTag.counterAxisSizingMode = 'AUTO'
    this.nodeTag.counterAxisAlignItems = 'CENTER'
    this.nodeTag.horizontalPadding = 4
    this.nodeTag.verticalPadding = 2
    this.nodeTag.itemSpacing = 4

    // insert
    switch (color) {
      case 'BLACK': {
        this.nodeTag.appendChild(this.makeNodeIndicator([0, 0, 0]))
        break
      }
      case 'WHITE': {
        this.nodeTag.appendChild(this.makeNodeIndicator([1, 1, 1]))
        break
      }
      case 'CUSTOM': {
        this.nodeTag.appendChild(this.makeNodeIndicator([rgb.r, rgb.g, rgb.b]))
        break
      }
    }
    this.nodeTag.appendChild(this.makeNodeText())

    return this.nodeTag
  }

  makeNodeText() {
    // base
    this.nodeText.name = '_text'
    this.nodeText.characters = this.content
    this.nodeText.fontName = {
      family: 'Roboto Mono',
      style: 'Medium',
    }
    this.nodeText.fontSize = this.fontSize
    this.nodeText.textAlignHorizontal = 'CENTER'
    this.nodeText.fills = [
      {
        type: 'SOLID',
        color: {
          r: 0,
          g: 0,
          b: 0,
        },
      },
    ]

    return this.nodeText
  }

  makeNodeIndicator(rgb: Array<number>) {
    // base
    this.nodeIndicator = figma.createEllipse()
    this.nodeIndicator.name = '_indicator'
    this.nodeIndicator.resize(8, 8)
    this.nodeIndicator.fills = [
      {
        type: 'SOLID',
        color: {
          r: rgb[0],
          g: rgb[1],
          b: rgb[2],
        },
      },
    ]

    return this.nodeIndicator
  }
}
