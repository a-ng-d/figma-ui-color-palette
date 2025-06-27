import chroma from 'chroma-js'
import {
  Channel,
  Color,
  ColorSpaceConfiguration,
  Contrast,
  HexModel,
  TextColorsThemeConfiguration,
  VisionSimulationModeConfiguration,
} from '@a_ng_d/utils-ui-color-palette'
import { locales } from '../content/locales'
import Tag from './Tag'

export default class Properties {
  private name: string
  private rgb: Channel
  private alpha?: number
  private mixedColor?: Channel
  private colorSpace: ColorSpaceConfiguration
  private visionSimulationMode: VisionSimulationModeConfiguration
  private textColorsTheme: TextColorsThemeConfiguration<'HEX'>
  private hex: HexModel
  private lch: Array<number>
  private oklch: Array<number>
  private lab: Array<number>
  private oklab: Array<number>
  private hsl: Array<number>
  private hsluv: Array<number>
  private lightTextColor: Channel
  private darkTextColor: Channel
  private lightTextColorContrast: Contrast
  private darkTextColorContrast: Contrast
  private nodeTopProps: FrameNode | null
  private nodeBottomProps: FrameNode | null
  private nodeBaseProps: FrameNode | null
  private nodeContrastScoresProps: FrameNode | null
  private nodeDetailedBaseProps: FrameNode | null
  private nodeDetailedWCAGScoresProps: FrameNode | null
  private nodeDetailedAPCAScoresProps: FrameNode | null
  private nodeColumns: FrameNode | null
  private nodeLeftColumn: FrameNode | null
  private nodeRightColumn: FrameNode | null
  private node: FrameNode | null

  constructor({
    name,
    rgb,
    alpha,
    mixedColor,
    colorSpace,
    visionSimulationMode,
    textColorsTheme,
  }: {
    name: string
    rgb: Channel
    alpha?: number
    mixedColor?: Channel
    colorSpace: ColorSpaceConfiguration
    visionSimulationMode: VisionSimulationModeConfiguration
    textColorsTheme: TextColorsThemeConfiguration<'HEX'>
  }) {
    this.name = name
    this.rgb = rgb
    this.alpha = alpha
    this.mixedColor = mixedColor
    this.colorSpace = colorSpace
    this.visionSimulationMode = visionSimulationMode
    this.textColorsTheme = textColorsTheme
    this.hex = chroma(rgb).hex()
    this.lch = chroma(rgb).lch()
    this.oklch = chroma(rgb).oklch()
    this.lab = chroma(rgb).lab()
    this.oklab = chroma(rgb).oklab()
    this.hsl = chroma(rgb).hsl()
    this.hsluv = new Color({
      sourceColor: rgb,
      visionSimulationMode: this.visionSimulationMode,
    }).getHsluv()
    this.lightTextColor = new Color({
      sourceColor: chroma(this.textColorsTheme.lightColor).rgb(),
      visionSimulationMode: this.visionSimulationMode,
    }).setColor() as Channel
    this.darkTextColor = new Color({
      sourceColor: chroma(this.textColorsTheme.darkColor).rgb(),
      visionSimulationMode: this.visionSimulationMode,
    }).setColor() as Channel
    this.lightTextColorContrast = new Contrast({
      backgroundColor: this.alpha !== undefined ? this.mixedColor : this.rgb,
      textColor: chroma(this.lightTextColor).hex(),
    })
    this.darkTextColorContrast = new Contrast({
      backgroundColor: this.alpha !== undefined ? this.mixedColor : this.rgb,
      textColor: chroma(this.darkTextColor).hex(),
    })
    this.nodeTopProps = null
    this.nodeBottomProps = null
    this.nodeBaseProps = null
    this.nodeContrastScoresProps = null
    this.nodeDetailedBaseProps = null
    this.nodeDetailedWCAGScoresProps = null
    this.nodeDetailedAPCAScoresProps = null
    this.nodeColumns = null
    this.nodeLeftColumn = null
    this.nodeRightColumn = null
    this.node = null
  }

  makeNodeTopProps = () => {
    // Base
    this.nodeTopProps = figma.createFrame()
    this.nodeTopProps.name = '_top'
    this.nodeTopProps.fills = []

    // Layout
    this.nodeTopProps.layoutMode = 'HORIZONTAL'
    this.nodeTopProps.primaryAxisSizingMode = 'FIXED'
    this.nodeTopProps.layoutAlign = 'STRETCH'
    this.nodeTopProps.layoutSizingVertical = 'HUG'

    return this.nodeTopProps
  }

  makeNodeBottomProps = () => {
    // Base
    this.nodeBottomProps = figma.createFrame()
    this.nodeBottomProps.name = '_bottom'
    this.nodeBottomProps.fills = []

    // Layout
    this.nodeBottomProps.layoutMode = 'VERTICAL'
    this.nodeBottomProps.counterAxisSizingMode = 'FIXED'
    this.nodeBottomProps.layoutAlign = 'STRETCH'
    this.nodeBottomProps.layoutSizingVertical = 'HUG'

    // Insert
    this.nodeBottomProps.appendChild(this.makeNodeContrastScoresProps())

    return this.nodeBottomProps
  }

  makeNodeBaseProps = () => {
    // Base
    this.nodeBaseProps = figma.createFrame()
    this.nodeBaseProps.name = '_base'
    this.nodeBaseProps.fills = []
    this.nodeBaseProps.clipsContent = false

    // Layout
    this.nodeBaseProps.layoutMode = 'VERTICAL'
    this.nodeBaseProps.counterAxisSizingMode = 'FIXED'
    this.nodeBaseProps.layoutGrow = 1
    this.nodeBaseProps.layoutSizingVertical = 'HUG'
    this.nodeBaseProps.counterAxisAlignItems = 'MAX'
    this.nodeBaseProps.itemSpacing = 4

    let basePropViaColorSpace

    if (this.colorSpace === 'LCH')
      basePropViaColorSpace = new Tag({
        name: '_lch',
        content: `L ${Math.floor(this.lch[0])} • C ${Math.floor(
          this.lch[1]
        )} • H ${Math.floor(this.lch[2])}`,
      }).makeNodeTag()
    else if (this.colorSpace === 'OKLCH')
      basePropViaColorSpace = new Tag({
        name: '_oklch',
        content: `L ${parseFloat(this.oklch[0].toFixed(2))} • C ${parseFloat(
          this.oklch[1].toFixed(2)
        )} • H ${Math.floor(this.oklch[2])}`,
      }).makeNodeTag()
    else if (this.colorSpace === 'LAB')
      basePropViaColorSpace = new Tag({
        name: '_lab',
        content: `L ${Math.floor(this.lab[0])} • A ${Math.floor(
          this.lab[1]
        )} • B ${Math.floor(this.lab[2])}`,
      }).makeNodeTag()
    else if (this.colorSpace === 'OKLAB')
      basePropViaColorSpace = new Tag({
        name: '_oklab',
        content: `L ${parseFloat(this.oklab[0].toFixed(2))} • A ${parseFloat(
          this.oklab[1].toFixed(2)
        )} • B ${parseFloat(this.oklab[2].toFixed(2))}`,
      }).makeNodeTag()
    else if (this.colorSpace === 'HSL')
      basePropViaColorSpace = new Tag({
        name: '_hsl',
        content: `H ${Math.floor(this.hsl[0])} • S ${Math.floor(
          this.hsl[1] * 100
        )} • L ${Math.floor(this.hsl[2] * 100)}`,
      }).makeNodeTag()
    else if (this.colorSpace === 'HSLUV')
      basePropViaColorSpace = new Tag({
        name: '_hsluv',
        content: `H ${Math.floor(this.hsluv[0])} • S ${Math.floor(
          this.hsluv[1]
        )} • L ${Math.floor(this.hsluv[2])}`,
      }).makeNodeTag()

    // Insert
     this.nodeBaseProps.appendChild(
     new Tag({
       name: '_hex',
       content: this.hex.toUpperCase(),
     }).makeNodeTag()
   )
    this.nodeBaseProps.appendChild(basePropViaColorSpace as FrameNode)

    if (this.alpha !== undefined) {
      const basePropViaAlpha = new Tag({
        name: '_alpha',
        content: `A ${this.alpha.toString()}`,
      }).makeNodeTag()

      this.nodeBaseProps.appendChild(basePropViaAlpha as FrameNode)
    }

    return this.nodeBaseProps
  }

  makeNodeContrastScoresProps = () => {
    // Base
    this.nodeContrastScoresProps = figma.createFrame()
    this.nodeContrastScoresProps.name = '_contrast-scores'
    this.nodeContrastScoresProps.fills = []

    // Layout
    this.nodeContrastScoresProps.layoutMode = 'VERTICAL'
    this.nodeContrastScoresProps.counterAxisSizingMode = 'FIXED'
    this.nodeContrastScoresProps.layoutAlign = 'STRETCH'
    this.nodeContrastScoresProps.layoutSizingVertical = 'HUG'
    this.nodeContrastScoresProps.itemSpacing = 4

    // Insert
    // WCAG
    const wcagLightContrast = this.lightTextColorContrast
        .getWCAGContrast()
        .toFixed(2),
      wcagDarkContrast = this.darkTextColorContrast
        .getWCAGContrast()
        .toFixed(2),
      wcagLightScore = this.lightTextColorContrast.getWCAGScore(),
      wcagDarkScore = this.darkTextColorContrast.getWCAGScore()

    const nodeWCAGLightProp = new Tag({
        name: '_wcag21-light',
        content: wcagLightContrast,
      }).makeNodeTagwithIndicator(chroma(this.lightTextColor).gl()),
      nodeWCAGLightScore = new Tag({
        name: '_wcag21-light-score',
        content: wcagLightScore,
        backgroundColor: {
          rgb: this.lightTextColorContrast.getWCAGScoreColor(),
          alpha: 1,
        },
      }).makeNodeTag(),
      nodeWCAGDarkProp = new Tag({
        name: '_wcag21-dark',
        content: wcagDarkContrast,
      }).makeNodeTagwithIndicator(chroma(this.darkTextColor).gl()),
      nodeWCAGDarkScore = new Tag({
        name: '_wcag21-dark-score',
        content: wcagDarkScore,
        backgroundColor: {
          rgb: this.darkTextColorContrast.getWCAGScoreColor(),
          alpha: 1,
        },
      }).makeNodeTag()

    nodeWCAGLightProp.appendChild(nodeWCAGLightScore)
    nodeWCAGDarkProp.appendChild(nodeWCAGDarkScore)

    // APCA
    const apcaLightContrast = this.lightTextColorContrast
        .getAPCAContrast()
        .toFixed(1),
      apcaLightRecommendation =
        this.lightTextColorContrast.getRecommendedUsage(),
      apcaDarkContrast = this.darkTextColorContrast
        .getAPCAContrast()
        .toFixed(1),
      apcaDarkRecommendation = this.darkTextColorContrast.getRecommendedUsage()

    const nodeAPCALightProp = new Tag({
        name: '_apca-light',
        content: `Lc ${apcaLightContrast}`,
      }).makeNodeTagwithIndicator(chroma(this.lightTextColor).gl()),
      nodeAPCALightScore = new Tag({
        name: '_apca-light-score',
        content: apcaLightRecommendation,
        backgroundColor: {
          rgb: this.lightTextColorContrast.getAPCAScoreColor(),
          alpha: 1,
        },
      }).makeNodeTag(),
      nodeAPCADarkProp = new Tag({
        name: '_apca-dark',
        content: `Lc ${apcaDarkContrast}`,
      }).makeNodeTagwithIndicator(chroma(this.darkTextColor).gl()),
      nodeAPCADarkScore = new Tag({
        name: '_apca-dark-score',
        content: apcaDarkRecommendation,
        backgroundColor: {
          rgb: this.darkTextColorContrast.getAPCAScoreColor(),
          alpha: 1,
        },
      }).makeNodeTag()

    nodeAPCALightProp.appendChild(nodeAPCALightScore)
    nodeAPCADarkProp.appendChild(nodeAPCADarkScore)

    this.nodeContrastScoresProps.appendChild(nodeWCAGLightProp)
    this.nodeContrastScoresProps.appendChild(nodeAPCALightProp)
    this.nodeContrastScoresProps.appendChild(nodeWCAGDarkProp)
    this.nodeContrastScoresProps.appendChild(nodeAPCADarkProp)

    return this.nodeContrastScoresProps
  }

  makeNodeDetailedBaseProps = () => {
    this.nodeDetailedBaseProps = figma.createFrame()
    this.nodeDetailedBaseProps.name = '_base'
    this.nodeDetailedBaseProps.fills = []

    // Layout
    this.nodeDetailedBaseProps.layoutMode = 'VERTICAL'
    this.nodeDetailedBaseProps.counterAxisSizingMode = 'FIXED'
    this.nodeDetailedBaseProps.layoutAlign = 'STRETCH'
    this.nodeDetailedBaseProps.layoutSizingVertical = 'HUG'
    this.nodeDetailedBaseProps.itemSpacing = 4

    let basePropViaColorSpace

    if (this.colorSpace === 'LCH')
      basePropViaColorSpace = new Tag({
        name: '_lch',
        content: `L ${Math.floor(this.lch[0])} • C ${Math.floor(
          this.lch[1]
        )} • H ${Math.floor(this.lch[2])}`,
      }).makeNodeTag()
    else if (this.colorSpace === 'OKLCH')
      basePropViaColorSpace = new Tag({
        name: '_oklch',
        content: `L ${parseFloat(this.oklch[0].toFixed(2))} • C ${parseFloat(
          this.oklch[1].toFixed(2)
        )} • H ${Math.floor(this.oklch[2])}`,
      }).makeNodeTag()
    else if (this.colorSpace === 'LAB')
      basePropViaColorSpace = new Tag({
        name: '_lab',
        content: `L ${Math.floor(this.lab[0])} • A ${Math.floor(
          this.lab[1]
        )} • B ${Math.floor(this.lab[2])}`,
      }).makeNodeTag()
    else if (this.colorSpace === 'OKLAB')
      basePropViaColorSpace = new Tag({
        name: '_oklab',
        content: `L ${parseFloat(this.oklab[0].toFixed(2))} • A ${parseFloat(
          this.oklab[1].toFixed(2)
        )} • B ${parseFloat(this.oklab[2].toFixed(2))}`,
      }).makeNodeTag()
    else if (this.colorSpace === 'HSL')
      basePropViaColorSpace = new Tag({
        name: '_lab',
        content: `H ${Math.floor(this.hsl[0])} • S ${Math.floor(
          this.hsl[1] * 100
        )} • L ${Math.floor(this.hsl[2] * 100)}`,
      }).makeNodeTag()
    else if (this.colorSpace === 'HSLUV')
      basePropViaColorSpace = new Tag({
        name: '_hsluv',
        content: `H ${Math.floor(this.hsluv[0])} • S ${Math.floor(
          this.hsluv[1]
        )} • L ${Math.floor(this.hsluv[2])}`,
      }).makeNodeTag()

    // Insert
    this.nodeDetailedBaseProps.appendChild(
      new Tag({
        name: '_title',
        content: locales.get().paletteProperties.base,
        fontSize: 10,
      }).makeNodeTag()
    )
    this.nodeDetailedBaseProps.appendChild(
      new Tag({
        name: '_hex',
        content: this.hex.toUpperCase(),
      }).makeNodeTag()
    )
    this.nodeDetailedBaseProps.appendChild(basePropViaColorSpace as FrameNode)

    if (this.alpha !== undefined) {
      const basePropViaAlpha = new Tag({
        name: '_alpha',
        content: `A ${this.alpha.toString()}`,
      }).makeNodeTag()

      this.nodeDetailedBaseProps.appendChild(basePropViaAlpha as FrameNode)
    }

    return this.nodeDetailedBaseProps
  }

  makeDetailedWCAGScoresProps = () => {
    this.nodeDetailedWCAGScoresProps = figma.createFrame()
    this.nodeDetailedWCAGScoresProps.name = '_wcag-scores'
    this.nodeDetailedWCAGScoresProps.fills = []

    // Layout
    this.nodeDetailedWCAGScoresProps.layoutMode = 'VERTICAL'
    this.nodeDetailedWCAGScoresProps.layoutAlign = 'STRETCH'
    this.nodeDetailedWCAGScoresProps.layoutSizingVertical = 'HUG'
    this.nodeDetailedWCAGScoresProps.itemSpacing = 4

    // Insert
    const wcagLightContrast = this.lightTextColorContrast
        .getWCAGContrast()
        .toFixed(2),
      wcagDarkContrast = this.darkTextColorContrast
        .getWCAGContrast()
        .toFixed(2),
      wcagLightScore = this.lightTextColorContrast.getWCAGScore(),
      wcagDarkScore = this.darkTextColorContrast.getWCAGScore()

    const nodeWCAGLightProp = new Tag({
        name: '_wcag21-light',
        content: wcagLightContrast,
      }).makeNodeTagwithIndicator(chroma(this.lightTextColor).gl()),
      nodeWCAGLightScore = new Tag({
        name: '_wcag21-light-score',
        content: wcagLightScore,
        backgroundColor: {
          rgb: this.lightTextColorContrast.getWCAGScoreColor(),
          alpha: 1,
        },
      }).makeNodeTag(),
      nodeWCAGDarkProp = new Tag({
        name: '_wcag21-dark',
        content: wcagDarkContrast,
      }).makeNodeTagwithIndicator(chroma(this.darkTextColor).gl()),
      nodeWCAGDarkScore = new Tag({
        name: '_wcag21-dark-score',
        content: wcagDarkScore,
        backgroundColor: {
          rgb: this.darkTextColorContrast.getWCAGScoreColor(),
          alpha: 1,
        },
      }).makeNodeTag()

    nodeWCAGLightProp.appendChild(nodeWCAGLightScore)
    nodeWCAGDarkProp.appendChild(nodeWCAGDarkScore)

    this.nodeDetailedWCAGScoresProps.appendChild(
      new Tag({
        name: '_title',
        content: locales.get().paletteProperties.wcag,
        fontSize: 10,
      }).makeNodeTag()
    )
    this.nodeDetailedWCAGScoresProps.appendChild(nodeWCAGLightProp)
    this.nodeDetailedWCAGScoresProps.appendChild(nodeWCAGDarkProp)

    return this.nodeDetailedWCAGScoresProps
  }

  makeNodeDetailedAPCAScoresProps = () => {
    this.nodeDetailedAPCAScoresProps = figma.createFrame()
    this.nodeDetailedAPCAScoresProps.name = '_apca-scores'
    this.nodeDetailedAPCAScoresProps.fills = []
    const minimumDarkFontSize: Array<string | number> =
        this.darkTextColorContrast.getMinFontSizes(),
      minimumLightFontSize: Array<string | number> =
        this.lightTextColorContrast.getMinFontSizes()

    // Layout
    this.nodeDetailedAPCAScoresProps.layoutMode = 'VERTICAL'
    this.nodeDetailedAPCAScoresProps.counterAxisSizingMode = 'FIXED'
    this.nodeDetailedAPCAScoresProps.layoutAlign = 'STRETCH'
    this.nodeDetailedAPCAScoresProps.layoutSizingVertical = 'HUG'
    this.nodeDetailedAPCAScoresProps.itemSpacing = 4

    // Insert
    const apcaLightContrast = this.lightTextColorContrast
        .getAPCAContrast()
        .toFixed(1),
      apcaLightRecommendation =
        this.lightTextColorContrast.getRecommendedUsage(),
      apcaDarkContrast = this.darkTextColorContrast
        .getAPCAContrast()
        .toFixed(1),
      apcaDarkRecommendation = this.darkTextColorContrast.getRecommendedUsage()

    const nodeAPCALightProp = new Tag({
        name: '_apca-light',
        content: `Lc ${apcaLightContrast}`,
      }).makeNodeTagwithIndicator(chroma(this.lightTextColor).gl()),
      nodeAPCALightScore = new Tag({
        name: '_apca-light-score',
        content: apcaLightRecommendation,
        backgroundColor: {
          rgb: this.lightTextColorContrast.getAPCAScoreColor(),
          alpha: 1,
        },
      }).makeNodeTag(),
      nodeAPCADarkProp = new Tag({
        name: '_apca-dark',
        content: `Lc ${apcaDarkContrast}`,
      }).makeNodeTagwithIndicator(chroma(this.darkTextColor).gl()),
      nodeAPCADarkScore = new Tag({
        name: '_apca-dark-score',
        content: apcaDarkRecommendation,
        backgroundColor: {
          rgb: this.darkTextColorContrast.getAPCAScoreColor(),
          alpha: 1,
        },
      }).makeNodeTag()

    nodeAPCALightProp.appendChild(nodeAPCALightScore)
    nodeAPCADarkProp.appendChild(nodeAPCADarkScore)

    this.nodeDetailedAPCAScoresProps.appendChild(
      new Tag({
        name: '_title',
        content: locales.get().paletteProperties.apca,
        fontSize: 10,
      }).makeNodeTag()
    )
    const columnsNode = this.makeNodeColumns(
      [
        nodeAPCALightProp,
        new Tag({
          name: '_minimum-font-sizes',
          content: locales.get().paletteProperties.fontSize,
        }).makeNodeTag(),
        new Tag({
          name: '_200-light',
          content: `${minimumLightFontSize[2]}pt (Extra-Light 200)`,
        }).makeNodeTag(),
        new Tag({
          name: '_300-light',
          content: `${minimumLightFontSize[3]}pt (Light 300)`,
        }).makeNodeTag(),
        new Tag({
          name: '_400-light',
          content: `${minimumLightFontSize[4]}pt (Regular 400)`,
        }).makeNodeTag(),
        new Tag({
          name: '_500-light',
          content: `${minimumLightFontSize[5]}pt (Medium 500)`,
        }).makeNodeTag(),
        new Tag({
          name: '_500-light',
          content: `${minimumLightFontSize[6]}pt (Semi-Bold 600)`,
        }).makeNodeTag(),
        new Tag({
          name: '_700-light',
          content: `${minimumLightFontSize[7]}pt (Bold 700)`,
        }).makeNodeTag(),
      ],
      [
        nodeAPCADarkProp,
        new Tag({
          name: '_minimum-font-sizes',
          content: locales.get().paletteProperties.fontSize,
        }).makeNodeTag(),
        new Tag({
          name: '_200-dark',
          content: `${minimumDarkFontSize[2]}pt (Extra-Light 200)`,
        }).makeNodeTag(),
        new Tag({
          name: '_300-dark',
          content: `${minimumDarkFontSize[3]}pt (Light 300)`,
        }).makeNodeTag(),
        new Tag({
          name: '_400-dark',
          content: `${minimumDarkFontSize[4]}pt (Regular 400)`,
        }).makeNodeTag(),
        new Tag({
          name: '_500-dark',
          content: `${minimumDarkFontSize[5]}pt (Medium 500)`,
        }).makeNodeTag(),
        new Tag({
          name: '_600-dark',
          content: `${minimumDarkFontSize[6]}pt (Semi-Bold 600)`,
        }).makeNodeTag(),
        new Tag({
          name: '_700-dark',
          content: `${minimumDarkFontSize[7]}pt (Bold 700)`,
        }).makeNodeTag(),
      ]
    )
    this.nodeDetailedAPCAScoresProps.appendChild(columnsNode)

    return this.nodeDetailedAPCAScoresProps
  }

  makeNodeColumns(leftNodes: Array<FrameNode>, rightNodes: Array<FrameNode>) {
    this.nodeColumns = figma.createFrame()
    this.nodeLeftColumn = figma.createFrame()
    this.nodeRightColumn = figma.createFrame()
    this.nodeColumns.name = '_columns'
    this.nodeLeftColumn.name = '_left-column'
    this.nodeRightColumn.name = '_right-column'
    this.nodeColumns.fills =
      this.nodeLeftColumn.fills =
      this.nodeRightColumn.fills =
        []

    // Layout
    this.nodeColumns.layoutMode = 'HORIZONTAL'
    this.nodeColumns.primaryAxisSizingMode = 'FIXED'
    this.nodeColumns.layoutAlign = 'STRETCH'
    this.nodeColumns.layoutSizingVertical = 'HUG'
    this.nodeColumns.itemSpacing = 8

    this.nodeLeftColumn.layoutMode = this.nodeRightColumn.layoutMode =
      'VERTICAL'
    this.nodeLeftColumn.counterAxisSizingMode =
      this.nodeRightColumn.counterAxisSizingMode = 'FIXED'
    this.nodeLeftColumn.layoutGrow = this.nodeRightColumn.layoutGrow = 1
    this.nodeLeftColumn.layoutSizingVertical =
      this.nodeRightColumn.layoutSizingVertical = 'HUG'
    this.nodeLeftColumn.itemSpacing = this.nodeRightColumn.itemSpacing = 4

    // Insert
    leftNodes.forEach((node) => this.nodeLeftColumn?.appendChild(node))
    rightNodes.forEach((node) => this.nodeRightColumn?.appendChild(node))
    this.nodeColumns.appendChild(this.nodeLeftColumn)
    this.nodeColumns.appendChild(this.nodeRightColumn)

    return this.nodeColumns
  }

  makeNodeDetailed = () => {
    // Base
    this.node = figma.createFrame()
    this.node.name = '_properties'
    this.node.fills = []

    // Layout
    this.node.layoutMode = 'VERTICAL'
    this.node.counterAxisSizingMode = 'FIXED'
    this.node.layoutAlign = 'STRETCH'
    this.node.primaryAxisSizingMode = 'FIXED'
    this.node.layoutGrow = 1
    this.node.itemSpacing = 16

    // Insert
    const detailedBaseProps = this.makeNodeDetailedBaseProps()
    const detailedWCAGScoresProps = this.makeDetailedWCAGScoresProps()
    const detailedAPCAScoresProps = this.makeNodeDetailedAPCAScoresProps()
    const columnsNode = this.makeNodeColumns(
      [detailedBaseProps],
      [detailedWCAGScoresProps]
    )

    this.node.appendChild(columnsNode)
    this.node.appendChild(detailedAPCAScoresProps)

    return this.node
  }

  makeNode = () => {
    // Base
    this.node = figma.createFrame()
    this.node.name = '_properties'
    this.node.fills = []

    // Layout
    this.node.layoutMode = 'VERTICAL'
    this.node.counterAxisSizingMode = 'FIXED'
    this.node.layoutAlign = 'STRETCH'
    this.node.primaryAxisSizingMode = 'FIXED'
    this.node.layoutGrow = 1
    this.node.primaryAxisAlignItems = 'SPACE_BETWEEN'

    // Insert
    const nodeTopPropsNode = this.makeNodeTopProps()
    const nodeBasePropsNode = this.makeNodeBaseProps()
    const nodeBottomPropsNode = this.makeNodeBottomProps()

    this.node.appendChild(nodeTopPropsNode)
    this.nodeTopProps?.appendChild(
      new Tag({
        name: '_scale',
        content: this.name,
        fontSize: 10,
      }).makeNodeTag()
    )
    this.nodeTopProps?.appendChild(nodeBasePropsNode)
    this.node.appendChild(nodeBottomPropsNode)

    return this.node
  }
}
