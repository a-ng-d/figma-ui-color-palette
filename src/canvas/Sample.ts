import type { TextColorsThemeHexModel } from '../utils/types'
import Properties from './Properties'
import Property from './Property'
import Status from './Status'

export default class Sample {
  name: string
  source: { [key: string]: number } | null
  scale: string | null
  rgb: Array<number> | null
  colorSpace: string
  view: string
  textColorsTheme: TextColorsThemeHexModel
  status: {
    isClosestToRef: boolean
  }
  nodeColor: FrameNode
  node: FrameNode
  children: FrameNode

  constructor(
    name: string,
    source: { [key: string]: number } | null,
    scale: string | null,
    rgb: Array<number> | null,
    colorSpace: string,
    view: string,
    textColorsTheme: TextColorsThemeHexModel,
    status: { isClosestToRef: boolean } = { isClosestToRef: false }
  ) {
    this.name = name
    this.source = source
    this.scale = scale
    this.rgb = rgb
    this.colorSpace = colorSpace
    this.view = view
    this.textColorsTheme = textColorsTheme
    this.status = status
    this.children = null
  }

  makeNodeName(mode: string, width: number, height: number) {
    // base
    this.node = figma.createFrame()
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
    this.node.layoutSizingHorizontal = 'FIXED'
    this.node.paddingTop =
      this.node.paddingRight =
      this.node.paddingBottom =
      this.node.paddingLeft =
        8
    if (mode === 'RELATIVE') {
      this.node.counterAxisSizingMode = 'FIXED'
      this.node.layoutGrow = 1
      this.children = new Property('_title', this.name, 16).makeNode()
    } else if (mode === 'ABSOLUTE') {
      this.node.resize(width, height)
      this.node.layoutSizingHorizontal = 'FIXED'
      this.children = new Property('_label', this.name, 10).makeNode()
    }

    // insert
    this.node.appendChild(this.children)

    return this.node
  }

  makeNodeShade(
    width: number,
    height: number,
    name: string,
    isColorName = false
  ) {
    // base
    this.node = figma.createFrame()
    this.node.name = name
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
    this.node.layoutSizingHorizontal = 'FIXED'
    this.node.layoutSizingVertical = 'FIXED'
    this.node.primaryAxisAlignItems = 'MAX'
    this.node.paddingTop =
      this.node.paddingRight =
      this.node.paddingBottom =
      this.node.paddingLeft =
        8
    this.node.itemSpacing = 8

    // insert
    if (this.view.includes('PALETTE_WITH_PROPERTIES') && !isColorName) {
      this.node.appendChild(
        new Properties(
          this.scale,
          this.rgb,
          this.colorSpace,
          this.textColorsTheme
        ).makeNode()
      )
    } else if (isColorName)
      this.node.appendChild(new Property('_label', this.name, 10).makeNode())
    if (this.status.isClosestToRef)
      this.node.appendChild(new Status(this.status, this.source).makeNode())

    return this.node
  }

  makeNodeRichShade(
    width: number,
    height: number,
    name: string,
    isColorName = false
  ) {
    // base
    this.node = figma.createFrame()
    this.node.name = name
    this.node.resize(width, height)
    this.node.fills = []

    // layout
    this.node.layoutMode = 'VERTICAL'
    this.node.layoutSizingHorizontal = 'FIXED'
    this.node.layoutSizingVertical = 'FIXED'
    this.node.primaryAxisAlignItems = 'MIN'
    this.node.paddingTop =
      this.node.paddingRight =
      this.node.paddingBottom =
      this.node.paddingLeft =
        16
    this.node.itemSpacing = 8

    // color
    this.nodeColor = figma.createFrame()
    this.nodeColor.name = '_color'
    this.nodeColor.layoutMode = 'VERTICAL'
    this.nodeColor.layoutSizingHorizontal = 'FIXED'
    this.nodeColor.layoutSizingVertical = 'FIXED'
    this.nodeColor.layoutAlign = 'STRETCH'
    this.nodeColor.resize(96, 96)
    this.nodeColor.paddingTop =
      this.nodeColor.paddingRight =
      this.nodeColor.paddingBottom =
      this.nodeColor.paddingLeft =
        8
    this.nodeColor.itemSpacing = 8
    this.nodeColor.fills = [
      {
        type: 'SOLID',
        color: {
          r: this.rgb[0] / 255,
          g: this.rgb[1] / 255,
          b: this.rgb[2] / 255,
        },
      },
    ]
    this.nodeColor.cornerRadius = 16

    // insert
    this.nodeColor.appendChild(new Property('_label', name, 10).makeNode())
    if (this.status.isClosestToRef)
      this.nodeColor.appendChild(
        new Status(this.status, this.source).makeNode()
      )

    this.node.appendChild(this.nodeColor)
    if (!this.view.includes('SHEET_SAFE_MODE') && !isColorName)
      this.node.appendChild(
        new Properties(
          this.scale,
          this.rgb,
          this.colorSpace,
          this.textColorsTheme
        ).makeNodeDetailed()
      )

    return this.node
  }
}
