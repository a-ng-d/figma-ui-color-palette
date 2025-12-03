import {
  BaseConfiguration,
  MetaConfiguration,
  PaletteDataThemeItem,
  ThemeConfiguration,
  ViewConfiguration,
} from '@a_ng_d/utils-ui-color-palette'
import { tolgee } from '..'
import Title from './Title'
import Signature from './Signature'
import Sample from './Sample'
import Header from './Header'

export default class Sheet {
  private base: BaseConfiguration
  private theme: ThemeConfiguration
  private data: PaletteDataThemeItem
  private meta: MetaConfiguration
  private view: ViewConfiguration
  private sampleScale: number
  private sampleRatio: number
  private sampleSize: number
  private gap: number
  private nodeRow: FrameNode | null
  private nodeRowSource: FrameNode | null
  private nodeRowShades: FrameNode | null
  private nodeEmpty: FrameNode | null
  private nodeShades: FrameNode | null
  node: FrameNode

  constructor({
    base,
    theme,
    data,
    meta,
    view,
  }: {
    base: BaseConfiguration
    theme: ThemeConfiguration
    data: PaletteDataThemeItem
    meta: MetaConfiguration
    view: ViewConfiguration
  }) {
    this.base = base
    this.theme = theme
    this.data = data
    this.meta = meta
    this.view = view
    this.sampleScale = 1.25
    this.sampleRatio = 2
    this.sampleSize = 184
    this.gap = 32
    this.nodeRow = null
    this.nodeRowSource = null
    this.nodeRowShades = null
    this.nodeEmpty = null
    this.nodeShades = null
    this.node = this.makeNode()
  }

  makeEmptyCase = () => {
    // Base
    this.nodeEmpty = figma.createFrame()
    this.nodeEmpty.name = '_message'
    this.nodeEmpty.resize(100, 48)
    this.nodeEmpty.fills = []

    // Layout
    this.nodeEmpty.layoutMode = 'HORIZONTAL'
    this.nodeEmpty.primaryAxisSizingMode = 'FIXED'
    this.nodeEmpty.layoutSizingVertical = 'FIXED'
    this.nodeEmpty.layoutAlign = 'STRETCH'
    this.nodeEmpty.primaryAxisAlignItems = 'CENTER'

    // Insert
    this.nodeEmpty.appendChild(
      new Sample({
        name: tolgee.t('warning.emptySourceColors'),
        rgb: [255, 255, 255],
        colorSpace: this.base.colorSpace,
        visionSimulationMode: this.theme.visionSimulationMode,
        view: this.view,
        textColorsTheme: this.theme.textColorsTheme,
      }).makeNodeName({
        mode: 'FILL',
        width: 48,
        height: 48,
      })
    )

    return this.nodeEmpty
  }

  makeNodeShades = () => {
    // Base
    this.nodeShades = figma.createFrame()
    this.nodeShades.name = '_shades'
    this.nodeShades.fills = []

    // Layout
    this.nodeShades.layoutMode = 'VERTICAL'
    this.nodeShades.layoutSizingHorizontal = 'HUG'
    this.nodeShades.layoutSizingVertical = 'HUG'

    // Insert
    this.nodeShades.appendChild(
      new Header({
        base: this.base,
        theme: this.theme,
        view: this.view,
        size:
          this.sampleSize * this.sampleScale * 4 +
          this.sampleSize * this.sampleRatio +
          this.gap * 4,
      }).node
    )

    this.data?.colors.forEach((color) => {
      const sourceColor = color.shades.find(
        (shade) => shade.name === 'source'
      ) ?? { hex: '#000000', rgb: [0, 0, 0] }

      // Base
      this.nodeRow = figma.createFrame()
      this.nodeRowSource = figma.createFrame()
      this.nodeRowShades = figma.createFrame()
      this.nodeRow.name = color.name
      this.nodeRowSource.name = '_source'
      this.nodeRowShades.name = '_shades'
      this.nodeRow.fills =
        this.nodeRowSource.fills =
        this.nodeRowShades.fills =
          []
      this.nodeRow.itemSpacing = this.gap

      // Layout
      this.nodeRow.layoutMode =
        this.nodeRowSource.layoutMode =
        this.nodeRowShades.layoutMode =
          'HORIZONTAL'
      this.nodeRow.layoutSizingHorizontal =
        this.nodeRowSource.layoutSizingHorizontal =
        this.nodeRowShades.layoutSizingHorizontal =
          'HUG'
      this.nodeRow.layoutSizingVertical =
        this.nodeRowSource.layoutSizingVertical =
        this.nodeRowShades.layoutSizingVertical =
          'HUG'

      // Insert
      const nodeSample = new Sample({
        name: color.name,
        rgb: sourceColor.rgb,
        colorSpace: this.base.colorSpace,
        visionSimulationMode: this.theme.visionSimulationMode,
        view: this.view,
        textColorsTheme: this.theme.textColorsTheme,
      }).makeNodeRichShade({
        width: this.sampleSize * this.sampleRatio,
        height: this.sampleSize * this.sampleRatio * this.sampleScale,
        name: color.name,
        description: color.description,
        isColorName: true,
      })

      this.nodeRowSource.appendChild(nodeSample)

      color.shades
        .filter((shade) => shade.name !== 'source')
        .forEach((shade) => {
          if (!this.nodeRowShades) return
          this.nodeRowShades.layoutSizingHorizontal = 'FIXED'
          this.nodeRowShades.layoutWrap = 'WRAP'
          this.nodeRowShades.itemSpacing = this.gap
          this.nodeRowShades.resize(
            this.sampleSize * this.sampleRatio * 3 + this.gap * 2,
            100
          )
          this.nodeRowShades.layoutSizingVertical = 'HUG'
          this.nodeRowShades?.appendChild(
            new Sample({
              name: color.name,
              source: {
                r: sourceColor.rgb[0] / 255,
                g: sourceColor.rgb[1] / 255,
                b: sourceColor.rgb[2] / 255,
              },
              scale: shade.name,
              rgb: shade.rgb,
              alpha: shade.alpha,
              backgroundColor: shade.backgroundColor,
              mixedColor: shade.mixedColor,
              colorSpace: this.base.colorSpace,
              visionSimulationMode: this.theme.visionSimulationMode,
              view: this.view,
              textColorsTheme: this.theme.textColorsTheme,
              status: {
                isClosestToRef: shade.isClosestToRef ?? false,
                isLocked: shade.isSourceColorLocked ?? false,
                isTransparent: shade.isTransparent ?? false,
              },
            }).makeNodeRichShade({
              width: this.sampleSize * this.sampleRatio,
              height: this.sampleSize * this.sampleRatio * this.sampleScale,
              name: shade.name,
            })
          )
        })

      this.nodeRow.appendChild(this.nodeRowSource)
      this.nodeRow.appendChild(this.nodeRowShades)
      this.nodeShades?.appendChild(this.nodeRow)
    })
    if (this.base.colors.length === 0)
      this.nodeShades.appendChild(this.makeEmptyCase())

    return this.nodeShades
  }

  makeNode = () => {
    // Base
    this.node = figma.createFrame()
    this.node.name = `_colors${tolgee.t('separator')}do not edit any layer`
    this.node.fills = []
    this.node.locked = true

    // Layout
    this.node.layoutMode = 'VERTICAL'
    this.node.layoutSizingHorizontal = 'HUG'
    this.node.layoutSizingVertical = 'HUG'
    this.node.itemSpacing = 16

    // Insert
    const nodeTitle = new Title({
      base: this.base,
      theme: this.theme,
      data: this.data,
      meta: this.meta,
    }).node
    const nodeSignature = new Signature().node

    this.node.appendChild(nodeTitle)
    this.node.appendChild(this.makeNodeShades())
    this.node.appendChild(nodeSignature)

    return this.node
  }
}
