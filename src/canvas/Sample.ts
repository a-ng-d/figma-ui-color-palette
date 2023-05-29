import type { TextColorsThemeHexModel } from '../utils/types'
import Properties from './Properties'
import Property from './Property'
import Status from './Status'

export default class Sample {
  name: string
  source: { [key: string]: number } | null
  scale: string | null
  rgb: Array<number> | null
  properties: boolean
  textColorsTheme: TextColorsThemeHexModel
  status: {
    isClosestToRef: boolean
  }
  node: FrameNode
  children: FrameNode

  constructor(
    name: string,
    source: { [key: string]: number } | null,
    scale: string | null,
    rgb: Array<number> | null,
    properties: boolean,
    textColorsTheme: TextColorsThemeHexModel,
    status: { isClosestToRef: boolean } = { isClosestToRef: false }
  ) {
    this.name = name
    this.source = source
    this.scale = scale
    this.rgb = rgb
    this.properties = properties
    this.textColorsTheme = textColorsTheme
    this.status = status
    this.node = figma.createFrame()
    this.children = null
  }

  makeName(mode: string, width: number, height: number) {
    // base
    this.node.name = this.name
    this.node.fills = [
      {
        type: 'SOLID',
        color: {
          r: this.rgb[0] / 255,
          g: this.rgb[1] / 255,
          b: this.rgb[2] / 255,
        },
      },
    ]

    // layout
    this.node.layoutMode = 'HORIZONTAL'
    this.node.paddingTop =
      this.node.paddingRight =
      this.node.paddingBottom =
      this.node.paddingLeft =
        8
    this.node.counterAxisSizingMode = 'FIXED'
    if (mode === 'RELATIVE') {
      this.node.primaryAxisSizingMode = 'AUTO'
      this.node.layoutAlign = 'STRETCH'
      this.node.layoutGrow = 1
      this.children = new Property('_title', this.name, 16).makeNode()
    } else if (mode === 'ABSOLUTE') {
      this.node.resize(width, height)
      this.node.primaryAxisSizingMode = 'FIXED'
      this.children = new Property('_label', this.name, 10).makeNode()
    }

    // insert
    this.node.appendChild(this.children)

    return this.node
  }

  makeScale(width: number, height: number) {
    // base
    this.node.name = this.scale
    this.node.resize(width, height)
    this.node.fills = [
      {
        type: 'SOLID',
        color: {
          r: this.rgb[0] / 255,
          g: this.rgb[1] / 255,
          b: this.rgb[2] / 255,
        },
      },
    ]

    // layout
    this.node.layoutMode = 'VERTICAL'
    this.node.paddingTop =
      this.node.paddingRight =
      this.node.paddingBottom =
      this.node.paddingLeft =
        8
    this.node.primaryAxisSizingMode = 'FIXED'
    this.node.counterAxisSizingMode = 'FIXED'
    this.node.primaryAxisAlignItems = 'MAX'

    // insert
    if (this.properties) {
      this.children = new Properties(
        this.scale,
        this.rgb,
        this.textColorsTheme
      ).makeNode()
      this.node.appendChild(this.children)
    }
    if (this.status.isClosestToRef)
      this.node.appendChild(new Status(this.status, this.source).makeNode())

    return this.node
  }

  makeRichScale(width: number, height: number) {
    // base
    this.node.name = this.name
    this.node.resize(width, height)

    // layout
    this.node.layoutMode = 'VERTICAL'
    this.node.paddingTop =
      this.node.paddingRight =
      this.node.paddingBottom =
      this.node.paddingLeft =
        16
    this.node.primaryAxisSizingMode = 'FIXED'
    this.node.counterAxisSizingMode = 'FIXED'
    this.node.primaryAxisAlignItems = 'MIN'

    // color
    this.children = figma.createFrame()
    this.children.name = '_color'
    this.children.layoutMode = 'VERTICAL'
    this.children.primaryAxisSizingMode = 'FIXED'
    this.children.counterAxisSizingMode = 'FIXED'
    this.children.layoutAlign = 'STRETCH'
    this.children.resize(96, 96)
    this.children.paddingTop =
      this.children.paddingRight =
      this.children.paddingBottom =
      this.children.paddingLeft =
        8
    this.children.itemSpacing = 8
    this.children.fills = [
      {
        type: 'SOLID',
        color: {
          r: this.rgb[0] / 255,
          g: this.rgb[1] / 255,
          b: this.rgb[2] / 255,
        },
      },
    ]
    this.children.cornerRadius = 16

    // insert
    this.children.appendChild(new Property('_label', this.name, 10).makeNode())
    if (this.status.isClosestToRef)
      this.node.appendChild(new Status(this.status, this.source).makeNode())
    
    this.node.appendChild(this.children)


    return this.node
  }
}
