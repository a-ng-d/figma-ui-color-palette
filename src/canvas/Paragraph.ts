import { bodyFontFamily, darkColor, FontFamily } from './styles'

export default class Paragraph {
  private name: string
  private content: string
  private fontSize: number
  private fontFamily: FontFamily
  private type: 'FILL' | 'FIXED'
  private width?: number
  private nodeText: TextNode | null
  node: FrameNode

  constructor({
    name,
    content,
    type,
    width,
    fontSize = 12,
    fontFamily = bodyFontFamily,
  }: {
    name: string
    content: string
    type: 'FILL' | 'FIXED'
    width?: number
    fontSize?: number
    fontFamily?: FontFamily
  }) {
    this.name = name
    this.content = content
    this.fontSize = fontSize
    this.fontFamily = fontFamily
    this.type = type
    this.width = width
    this.nodeText = null
    this.node = this.makeNode()
  }

  makeNodeText = () => {
    // Base
    this.nodeText = figma.createText()
    this.nodeText.name = '_text'
    this.nodeText.characters = this.content
    this.nodeText.fontName = {
      family: this.fontFamily,
      style: 'Medium',
    }
    this.nodeText.fontSize = this.fontSize
    this.nodeText.setRangeLineHeight(0, this.content.length, {
      value: 130,
      unit: 'PERCENT',
    })
    this.nodeText.fills = [
      {
        type: 'SOLID',
        color: darkColor,
      },
    ]

    this.applyHyperlinks()

    // Layout
    this.nodeText.layoutGrow = 1

    return this.nodeText
  }

  applyHyperlinks = () => {
    if (!this.nodeText) return

    const urlPattern = /https?:\/\/[^\s]+/g
    let match: RegExpExecArray | null

    while ((match = urlPattern.exec(this.content)) !== null) {
      const url = match[0]
      const start = match.index
      const end = start + url.length

      this.nodeText.setRangeHyperlink(start, end, {
        type: 'URL',
        value: url,
      })

      this.nodeText.setRangeTextDecoration(start, end, 'UNDERLINE')
    }
  }

  makeNode() {
    // Base
    this.node = figma.createFrame()
    this.node.name = this.name
    this.node.fills = [
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
    this.node.strokes = [
      {
        type: 'SOLID',
        opacity: 0.05,
        color: darkColor,
      },
    ]
    this.node.cornerRadius = 16
    if (this.type === 'FIXED') this.node.resize(this.width ?? 100, 100)

    // Layout
    this.node.layoutMode = 'HORIZONTAL'
    if (this.type === 'FIXED') this.node.layoutSizingHorizontal = 'FIXED'
    else {
      this.node.primaryAxisSizingMode = 'FIXED'
      this.node.layoutAlign = 'STRETCH'
    }
    this.node.layoutSizingVertical = 'HUG'
    this.node.paddingTop = 8
    this.node.paddingLeft = 8
    this.node.paddingBottom = 8
    this.node.paddingRight = 8

    // Insert
    this.node.appendChild(this.makeNodeText())

    return this.node
  }
}
