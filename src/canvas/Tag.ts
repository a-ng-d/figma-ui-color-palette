export default class Tag {
  name: string
  content: string
  fontSize: number
  url: string | null
  nodeTag: FrameNode | null
  nodeText: TextNode | null
  nodeIndicator: EllipseNode | null

  constructor(
    name: string,
    content: string,
    fontSize = 8,
    url: string | null = null
  ) {
    this.name = name
    this.content = content
    this.fontSize = fontSize
    this.url = url
    this.nodeTag = null
    this.nodeText = null
    this.nodeIndicator = null
  }

  makeNodeTag = (gl: Array<number> = [0, 0, 0, 1], hasIndicator = false) => {
    // base
    this.nodeTag = figma.createFrame()
    this.nodeTag.name = this.name
    this.nodeTag.fills = [
      {
        type: 'SOLID',
        opacity: 0.5,
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
    this.nodeTag.layoutSizingHorizontal = 'HUG'
    this.nodeTag.layoutSizingVertical = 'HUG'
    this.nodeTag.horizontalPadding = 8
    this.nodeTag.verticalPadding = 4
    this.nodeTag.itemSpacing = 4

    // insert
    if (hasIndicator)
      this.nodeTag.appendChild(this.makeNodeIndicator([gl[0], gl[1], gl[2]]))
    this.nodeTag.appendChild(this.makeNodeText())

    return this.nodeTag
  }

  makeNodeText = () => {
    // base
    this.nodeText = figma.createText()
    this.nodeText.name = '_text'
    this.nodeText.characters = this.content
    this.nodeText.fontName = {
      family: 'Red Hat Mono',
      style: 'Medium',
    }
    this.nodeText.fontSize = this.fontSize
    this.nodeText.setRangeLineHeight(0, this.content.length, {
      value: 100,
      unit: 'PERCENT',
    })
    this.nodeText.textAlignHorizontal = 'CENTER'
    if (this.url != null) {
      this.nodeText.setRangeHyperlink(0, this.content.length, {
        type: 'URL',
        value: this.url,
      })
      this.nodeText.setRangeTextDecoration(0, this.content.length, 'UNDERLINE')
    }
    this.nodeText.fills = [
      {
        type: 'SOLID',
        color: {
          r: 16 / 255,
          g: 35 / 255,
          b: 37 / 255,
        },
      },
    ]

    return this.nodeText
  }

  makeNodeIndicator = (rgb: Array<number>) => {
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
