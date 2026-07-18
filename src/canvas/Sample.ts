import {
  Channel,
  ColorSpaceConfiguration,
  RgbModel,
  TextColorsThemeConfiguration,
  ViewConfiguration,
  VisionSimulationModeConfiguration,
} from '@yelbolt/engine-ui-color-palette'
import Status from './Status'
import Property from './Property'
import Properties from './Properties'
import Paragraph from './Paragraph'

export default class Sample {
  private name: string
  private source?: RgbModel
  private scale?: string
  private rgb: Channel
  private alpha?: number
  private backgroundColor?: Channel
  private mixedColor?: Channel
  private colorSpace: ColorSpaceConfiguration
  private visionSimulationMode: VisionSimulationModeConfiguration
  private view: ViewConfiguration
  private textColorsTheme: TextColorsThemeConfiguration<'HEX'>
  private status: {
    isClosestToRef: boolean
    isLocked: boolean
    isTransparent: boolean
  }
  private nodeColor: FrameNode | null
  private node: FrameNode | null
  private children: FrameNode | null

  constructor({
    name,
    source,
    scale,
    rgb,
    alpha,
    backgroundColor,
    mixedColor,
    colorSpace,
    visionSimulationMode,
    view,
    textColorsTheme,
    status = {
      isClosestToRef: false,
      isLocked: false,
      isTransparent: false,
    },
  }: {
    id?: string
    name: string
    source?: RgbModel
    scale?: string
    rgb: Channel
    alpha?: number
    backgroundColor?: Channel
    mixedColor?: Channel
    colorSpace: ColorSpaceConfiguration
    visionSimulationMode: VisionSimulationModeConfiguration
    view: ViewConfiguration
    textColorsTheme: TextColorsThemeConfiguration<'HEX'>
    status?: {
      isClosestToRef: boolean
      isLocked: boolean
      isTransparent: boolean
    }
  }) {
    this.name = name
    this.source = source
    this.scale = scale
    this.rgb = rgb
    this.alpha = alpha
    this.backgroundColor = backgroundColor
    this.mixedColor = mixedColor
    this.colorSpace = colorSpace
    this.visionSimulationMode = visionSimulationMode
    this.view = view
    this.textColorsTheme = textColorsTheme
    this.status = status
    this.nodeColor = null
    this.node = null
    this.children = null
  }

  makeNodeName = ({
    mode,
    width,
    height,
  }: {
    mode: string
    width: number
    height: number
  }) => {
    // Base
    this.node = figma.createFrame()
    this.node.name = this.name
    this.node.fills = []

    // Layout
    this.node.layoutMode = 'HORIZONTAL'
    this.node.layoutSizingHorizontal = 'FIXED'
    this.node.paddingTop =
      this.node.paddingRight =
      this.node.paddingBottom =
      this.node.paddingLeft =
        8
    this.node.resize(width, height)

    if (mode === 'FILL') {
      this.node.counterAxisSizingMode = 'FIXED'
      this.node.layoutGrow = 1
      this.children = new Property({
        name: '_large-label',
        content: this.name,
        size: 16,
      }).makeNode()
    } else if (mode === 'FIXED')
      this.children = new Property({
        name: '_label',
        content: this.name,
        size: 10,
      }).makeNode()

    // Insert
    this.node.appendChild(this.children as FrameNode)

    return this.node
  }

  makeNodeShade = ({
    width,
    height,
    name,
    isColorName = false,
  }: {
    width: number
    height: number
    name: string
    isColorName?: boolean
  }) => {
    const newFills: Paint[] = [
      {
        type: 'SOLID' as const,
        color: {
          r: this.rgb[0] / 255,
          g: this.rgb[1] / 255,
          b: this.rgb[2] / 255,
        },
        opacity: this.alpha ?? 1,
      },
    ]

    if (this.backgroundColor !== undefined)
      newFills.unshift({
        type: 'SOLID',
        color: {
          r: this.backgroundColor[0] / 255,
          g: this.backgroundColor[1] / 255,
          b: this.backgroundColor[2] / 255,
        },
        opacity: 1,
      })

    // Base
    this.node = figma.createFrame()
    this.node.name = name
    this.node.resize(width, height)
    this.node.fills = newFills

    // Layout
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

    // Insert
    if (this.view.includes('PALETTE_WITH_PROPERTIES') && !isColorName) {
      const nodeProperties = new Properties({
        name: this.scale ?? '0',
        rgb: this.rgb,
        alpha: this.alpha,
        mixedColor: this.mixedColor,
        colorSpace: this.colorSpace,
        visionSimulationMode: this.visionSimulationMode,
        textColorsTheme: this.textColorsTheme,
      }).makeNode()

      this.node.appendChild(nodeProperties)
    } else if (isColorName) {
      const nodeProperty = new Property({
        name: '_label',
        content: this.name,
        size: 10,
      }).makeNode()

      this.node.appendChild(nodeProperty)
    }

    if (
      this.status.isClosestToRef ||
      this.status.isLocked ||
      this.status.isTransparent
    ) {
      const nodeStatus = new Status({
        status: this.status,
        source: this.source
          ? { r: this.source.r, g: this.source.g, b: this.source.b }
          : {},
      }).node

      this.node.appendChild(nodeStatus)
    }

    return this.node
  }

  makeNodeRichShade = ({
    width,
    height,
    name,
    description = '',
    isColorName = false,
  }: {
    width: number
    height: number
    name: string
    description?: string
    isColorName?: boolean
  }) => {
    const newFills: Paint[] = [
      {
        type: 'SOLID' as const,
        color: {
          r: this.rgb[0] / 255,
          g: this.rgb[1] / 255,
          b: this.rgb[2] / 255,
        },
        opacity: this.alpha ?? 1,
      },
    ]

    if (this.backgroundColor !== undefined)
      newFills.unshift({
        type: 'SOLID',
        color: {
          r: this.backgroundColor[0] / 255,
          g: this.backgroundColor[1] / 255,
          b: this.backgroundColor[2] / 255,
        },
        opacity: 1,
      })

    // Base
    this.node = figma.createFrame()
    this.node.name = name
    this.node.resize(width, height)
    this.node.fills = []

    // Layout
    this.node.layoutMode = 'VERTICAL'
    this.node.layoutSizingHorizontal = 'FIXED'
    this.node.layoutSizingVertical = 'FIXED'
    this.node.primaryAxisAlignItems = 'MIN'
    this.node.itemSpacing = 8

    // Color
    this.nodeColor = figma.createFrame()
    this.nodeColor.name = '_color'
    this.nodeColor.layoutMode = 'VERTICAL'
    this.nodeColor.layoutSizingHorizontal = 'FIXED'
    this.nodeColor.layoutSizingVertical = 'FIXED'
    this.nodeColor.layoutAlign = 'STRETCH'
    this.nodeColor.resize(96, 96)
    this.nodeColor.paddingLeft = 8
    this.nodeColor.paddingRight = 8
    this.nodeColor.paddingTop = 8
    this.nodeColor.paddingBottom = 8
    this.nodeColor.itemSpacing = 8
    this.nodeColor.fills = newFills
    this.nodeColor.cornerRadius = 16

    // Insert
    const nodeProperty = new Property({
      name: '_label',
      content: name,
      size: 10,
    }).makeNode()

    this.nodeColor.appendChild(nodeProperty)

    if (
      this.status.isClosestToRef ||
      this.status.isLocked ||
      this.status.isTransparent
    ) {
      const nodeStatus = new Status({
        status: this.status,
        source: this.source
          ? { r: this.source.r, g: this.source.g, b: this.source.b }
          : {},
      }).node

      this.nodeColor.appendChild(nodeStatus)
    }

    this.node.appendChild(this.nodeColor)

    if (isColorName && description !== '') {
      const nodeParagraph = new Paragraph({
        name: '_description',
        content: description,
        type: 'FILL',
        fontSize: 8,
        fontFamily: 'Lexend',
      }).node

      this.node.appendChild(nodeParagraph)
    } else if (!isColorName) {
      const nodeProperties = new Properties({
        name: this.scale ?? '0',
        rgb: this.rgb,
        alpha: this.alpha,
        mixedColor: this.mixedColor,
        colorSpace: this.colorSpace,
        visionSimulationMode: this.visionSimulationMode,
        textColorsTheme: this.textColorsTheme,
      }).makeNodeDetailed()

      this.node.appendChild(nodeProperties)
    }

    return this.node
  }
}
