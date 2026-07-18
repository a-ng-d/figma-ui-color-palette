import { RgbModel } from '@yelbolt/engine-ui-color-palette'
import { darkColor, FontFamily, propertyFontFamily } from './styles'

export default class Tag {
  private name: string
  private content: string
  private fontSize: number
  private fontFamily: FontFamily
  private url: string | null
  private backgroundColor: {
    rgb: RgbModel
    alpha: number
  }
  private nodeTag: FrameNode | null
  private nodeTagWithAvatar: FrameNode | null
  private nodeTagwithIndicator: FrameNode | null
  private nodeText: TextNode | null
  private nodeIndicator: EllipseNode | null
  private nodeAvatar: EllipseNode | null

  constructor({
    name,
    content,
    fontSize = 8,
    fontFamily = propertyFontFamily,
    backgroundColor = {
      rgb: {
        r: 1,
        g: 1,
        b: 1,
      },
      alpha: 0.5,
    },
    url = null,
  }: {
    name: string
    content: string
    fontSize?: number
    fontFamily?: FontFamily
    backgroundColor?: {
      rgb: RgbModel
      alpha: number
    }
    url?: string | null
  }) {
    this.name = name
    this.content = content
    this.fontSize = fontSize
    this.fontFamily = fontFamily
    this.url = url
    this.backgroundColor = backgroundColor
    this.nodeTag = null
    this.nodeTagwithIndicator = null
    this.nodeTagWithAvatar = null
    this.nodeText = null
    this.nodeIndicator = null
    this.nodeAvatar = null
  }

  makeNodeTag = () => {
    // Base
    this.nodeTag = figma.createFrame()
    this.nodeTag.name = this.name
    this.nodeTag.fills = [
      {
        type: 'SOLID',
        opacity: this.backgroundColor.alpha,
        color: {
          r: this.backgroundColor.rgb.r,
          g: this.backgroundColor.rgb.g,
          b: this.backgroundColor.rgb.b,
        },
      },
    ]
    this.nodeTag.strokes = [
      {
        type: 'SOLID',
        color: darkColor,
        opacity: 0.05,
      },
    ]
    this.nodeTag.cornerRadius = 16

    // Layout
    this.nodeTag.layoutMode = 'HORIZONTAL'
    this.nodeTag.layoutSizingHorizontal = 'HUG'
    this.nodeTag.layoutSizingVertical = 'HUG'
    this.nodeTag.counterAxisAlignItems = 'CENTER'
    this.nodeTag.paddingTop = 4
    this.nodeTag.paddingLeft = 8
    this.nodeTag.paddingBottom = 4
    this.nodeTag.paddingRight = 8
    this.nodeTag.itemSpacing = 4

    // Insert
    this.nodeTag.appendChild(this.makeNodeText())

    return this.nodeTag
  }

  makeNodeTagwithIndicator = (
    gl: Array<number> = [0, 0, 0, 1],
    isCompact = true
  ) => {
    // Base
    this.nodeTagwithIndicator = figma.createFrame()
    this.nodeTagwithIndicator.name = this.name
    this.nodeTagwithIndicator.fills = [
      {
        type: 'SOLID',
        opacity: this.backgroundColor.alpha,
        color: {
          r: this.backgroundColor.rgb.r,
          g: this.backgroundColor.rgb.g,
          b: this.backgroundColor.rgb.b,
        },
      },
    ]
    this.nodeTagwithIndicator.strokes = [
      {
        type: 'SOLID',
        color: darkColor,
        opacity: 0.05,
      },
    ]
    this.nodeTagwithIndicator.cornerRadius = 16

    // Layout
    this.nodeTagwithIndicator.layoutMode = 'HORIZONTAL'
    this.nodeTagwithIndicator.layoutSizingHorizontal = 'HUG'
    this.nodeTagwithIndicator.layoutSizingVertical = 'HUG'
    this.nodeTagwithIndicator.counterAxisAlignItems = 'CENTER'
    this.nodeTagwithIndicator.paddingLeft = 8
    this.nodeTagwithIndicator.paddingRight = isCompact ? 2 : 8
    this.nodeTagwithIndicator.paddingTop = isCompact ? 2 : 4
    this.nodeTagwithIndicator.paddingBottom = isCompact ? 2 : 4
    this.nodeTagwithIndicator.itemSpacing = 4

    // Insert
    this.nodeTagwithIndicator.appendChild(
      this.makeNodeIndicator([gl[0], gl[1], gl[2]])
    )
    this.nodeTagwithIndicator.appendChild(this.makeNodeText())

    return this.nodeTagwithIndicator
  }

  makeNodeTagWithAvatar = (image?: Image | null): FrameNode => {
    // Base
    this.nodeTagWithAvatar = figma.createFrame()
    this.nodeTagWithAvatar.name = this.name
    this.nodeTagWithAvatar.fills = [
      {
        type: 'SOLID',
        opacity: this.backgroundColor.alpha,
        color: {
          r: this.backgroundColor.rgb.r,
          g: this.backgroundColor.rgb.g,
          b: this.backgroundColor.rgb.b,
        },
      },
    ]
    this.nodeTagWithAvatar.strokes = [
      {
        type: 'SOLID',
        color: darkColor,
        opacity: 0.05,
      },
    ]
    this.nodeTagWithAvatar.cornerRadius = 16

    // Layout
    this.nodeTagWithAvatar.layoutMode = 'HORIZONTAL'
    this.nodeTagWithAvatar.layoutSizingHorizontal = 'HUG'
    this.nodeTagWithAvatar.layoutSizingVertical = 'HUG'
    this.nodeTagWithAvatar.counterAxisAlignItems = 'CENTER'
    this.nodeTagWithAvatar.paddingTop = 4
    this.nodeTagWithAvatar.paddingLeft = 8
    this.nodeTagWithAvatar.paddingBottom = 4
    this.nodeTagWithAvatar.paddingRight = 4
    this.nodeTagWithAvatar.itemSpacing = 8

    // Insert
    this.nodeTagWithAvatar.appendChild(this.makeNodeText())
    this.nodeTagWithAvatar.appendChild(this.makeNodeAvatar(image))

    return this.nodeTagWithAvatar
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
      value: 100,
      unit: 'PERCENT',
    })
    this.nodeText.textAlignHorizontal = 'CENTER'
    if (this.url !== null) {
      this.nodeText.setRangeHyperlink(0, this.content.length, {
        type: 'URL',
        value: this.url,
      })
      this.nodeText.setRangeTextDecoration(0, this.content.length, 'UNDERLINE')
    }
    this.nodeText.fills = [
      {
        type: 'SOLID',
        color: darkColor,
      },
    ]

    return this.nodeText
  }

  makeNodeIndicator = (rgb: Array<number>) => {
    // Base
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
        color: darkColor,
        opacity: 0.1,
      },
    ]

    return this.nodeIndicator
  }

  makeNodeAvatar = (image?: Image | null) => {
    // Base
    this.nodeAvatar = figma.createEllipse()
    this.nodeAvatar.resize(24, 24)
    this.nodeAvatar.name = '_avatar'

    if (image !== null && image !== undefined) {
      this.nodeAvatar.fills = [
        {
          type: 'IMAGE',
          scaleMode: 'FILL',
          imageHash: image.hash,
        },
      ]
      this.nodeAvatar.strokes = [
        {
          type: 'SOLID',
          color: darkColor,
          opacity: 0.1,
        },
      ]
    }

    return this.nodeAvatar
  }
}
