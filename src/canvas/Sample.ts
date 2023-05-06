import Properties from './Properties'
import Property from './Property'
import Status from './Status'

export default class Sample {
  name: string
  source: { [key: string]: number } | null
  scale: string | null
  rgb: Array<number> | null
  properties: boolean
  textColorsTheme: string
  status: {
    isClosestToRef: boolean
  }
  node: FrameNode
  children: any

  constructor(name: string, source: { [key: string]: number } | null, scale: string | null, rgb: Array<number> | null, properties: boolean, textColorsTheme: string, status?: { isClosestToRef: boolean }) {
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

  makeName(mode, width, height) {
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
    if (mode === 'relative') {
      this.node.primaryAxisSizingMode = 'AUTO'
      this.node.layoutAlign = 'STRETCH'
      this.node.layoutGrow = 1
      this.children = new Property('_title', this.name, 16).makeNode()
    } else if (mode === 'absolute') {
      this.node.resize(width, height)
      this.node.primaryAxisSizingMode = 'FIXED'
      this.children = new Property('_label', this.name, 10).makeNode()
    }

    // insert
    this.node.appendChild(this.children)

    return this.node
  }

  makeScale(width, height) {
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
    this.node.itemSpacing = 16

    // insert
    if (this.properties) {
      this.children = new Properties(this.scale, this.rgb, this.textColorsTheme).makeNode()
      this.node.appendChild(this.children)
    }
    if (this.status.isClosestToRef)
      this.node.appendChild(new Status(this.status, this.source).makeNode())

    return this.node
  }
}
