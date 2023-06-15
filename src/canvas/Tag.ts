export default class Tag {
  name: string
  content: string
  fontSize: number
  nodeTag: FrameNode
  nodeText: TextNode
  nodeIndicator: EllipseNode

  constructor(name: string, content: string, fontSize = 8) {
    this.name = name
    this.content = content
    this.fontSize = fontSize
  }

  makeNodeTag(gl: Array<number> = [0, 0, 0, 1], hasIndicator = false) {
    // base
    this.nodeTag = figma.createFrame()
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
    if (hasIndicator)
      this.nodeTag.appendChild(this.makeNodeIndicator([gl[0], gl[1], gl[2]]))
    this.nodeTag.appendChild(this.makeNodeText())

    return this.nodeTag
  }

  makeNodeText() {
    // base
    this.nodeText = figma.createText()
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
    this.nodeIndicator.strokes = [
      {
        type: 'SOLID',
        color: {
          r: 0,
          g: 0,
          b: 0,
        },
        opacity: 0.1,
      },
    ]

    return this.nodeIndicator
  }
}
