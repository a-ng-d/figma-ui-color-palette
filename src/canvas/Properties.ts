import type { TextColorsThemeHexModel } from '../utils/types'
import chroma from 'chroma-js'
import { APCAcontrast, sRGBtoY, fontLookupAPCA } from 'apca-w3'
import Tag from './Tag'

export default class Properties {
  name: string
  rgb: Array<number>
  textColorsTheme: TextColorsThemeHexModel
  hex: string
  lch: Array<number>
  nodeTop: FrameNode
  nodeBottom: FrameNode
  nodeBasics: FrameNode
  nodeContrastScores: FrameNode
  nodeProperties: TextNode
  nodeDetailedBaseProps: FrameNode
  nodeDetailedWCAGScoresProps: FrameNode
  nodeDetailedAPCAScoresProps: FrameNode
  nodeColumns: FrameNode
  nodeLeftColumn: FrameNode
  nodeRightColumn: FrameNode
  node: FrameNode

  constructor(
    name: string,
    rgb: Array<number>,
    textColorsTheme: TextColorsThemeHexModel
  ) {
    this.name = name
    this.rgb = rgb
    this.textColorsTheme = textColorsTheme
    this.hex = chroma(rgb).hex()
    this.lch = chroma(rgb).lch()
    this.node = figma.createFrame()
  }

  getContrast(textColor: string) {
    return chroma.contrast(
      this.rgb,
      textColor === 'BLACK'
        ? this.textColorsTheme.darkColor
        : this.textColorsTheme.lightColor
    )
  }

  getAPCAContrast(textColor: string) {
    return APCAcontrast(
      sRGBtoY(
        textColor === 'BLACK'
          ? chroma(this.textColorsTheme.darkColor).rgb()
          : chroma(this.textColorsTheme.lightColor).rgb()
      ),
      sRGBtoY(this.rgb)
    )
  }

  getLevel(textColor: string) {
    return this.getContrast(textColor) < 4.5
      ? 'A'
      : this.getContrast(textColor) >= 4.5 && this.getContrast(textColor) < 7
      ? 'AA'
      : 'AAA'
  }

  getMinFontSizes(textColor: string) {
    return fontLookupAPCA(this.getAPCAContrast(textColor))
  }

  makeNodeTop() {
    // base
    this.nodeTop = figma.createFrame()
    this.nodeTop.name = '_top'
    this.nodeTop.fills = []

    // layout
    this.nodeTop.layoutMode = 'HORIZONTAL'
    this.nodeTop.primaryAxisSizingMode = 'FIXED'
    this.nodeTop.counterAxisSizingMode = 'AUTO'
    this.nodeTop.layoutAlign = 'STRETCH'

    return this.nodeTop
  }

  makeNodeBottom() {
    // base
    this.nodeBottom = figma.createFrame()
    this.nodeBottom.name = '_bottom'
    this.nodeBottom.fills = []

    // layout
    this.nodeBottom.layoutMode = 'VERTICAL'
    this.nodeBottom.primaryAxisSizingMode = 'AUTO'
    this.nodeBottom.counterAxisSizingMode = 'FIXED'
    this.nodeBottom.layoutAlign = 'STRETCH'

    // insert
    this.nodeBottom.appendChild(this.makeNodeContrastScores())

    return this.nodeBottom
  }

  makeNodeBasics() {
    // base
    this.nodeBasics = figma.createFrame()
    this.nodeBasics.name = '_basics'
    this.nodeBasics.fills = []

    // layout
    this.nodeBasics.layoutMode = 'VERTICAL'
    this.nodeBasics.primaryAxisSizingMode = 'AUTO'
    this.nodeBasics.counterAxisSizingMode = 'FIXED'
    this.nodeBasics.counterAxisAlignItems = 'MAX'
    this.nodeBasics.layoutGrow = 1
    this.nodeBasics.itemSpacing = 4

    // insert
    this.nodeBasics.appendChild(
      new Tag('_hex', this.hex.toUpperCase(), 8).makeNodeTag()
    )
    this.nodeBasics.appendChild(
      new Tag(
        '_lch',
        `L ${Math.floor(this.lch[0])} • C ${Math.floor(
          this.lch[1]
        )} • H ${Math.floor(this.lch[2])}`,
        8
      ).makeNodeTag()
    )

    return this.nodeBasics
  }

  makeNodeContrastScores() {
    // base
    this.nodeContrastScores = figma.createFrame()
    this.nodeContrastScores.name = '_contrast-scores'
    this.nodeContrastScores.fills = []

    // layout
    this.nodeContrastScores.layoutMode = 'VERTICAL'
    this.nodeContrastScores.primaryAxisSizingMode = 'AUTO'
    this.nodeContrastScores.counterAxisSizingMode = 'FIXED'
    this.nodeContrastScores.layoutAlign = 'STRETCH'
    this.nodeContrastScores.itemSpacing = 4

    // insert
    this.nodeContrastScores.appendChild(
      new Tag(
        '_wcag21-white',
        `${this.getContrast('WHITE').toFixed(2)} • ${this.getLevel('WHITE')}`,
        8
      ).makeNodeTag(chroma(this.textColorsTheme.lightColor).gl(), true)
    )
    this.nodeContrastScores.appendChild(
      new Tag(
        '_wcag21-black',
        `${this.getContrast('BLACK').toFixed(2)} • ${this.getLevel('BLACK')}`,
        8
      ).makeNodeTag(chroma(this.textColorsTheme.darkColor).gl(), true)
    )
    this.nodeContrastScores.appendChild(
      new Tag(
        '_apca-white',
        `Lc ${this.getAPCAContrast('WHITE').toFixed(1)} • ${
          this.getMinFontSizes('WHITE')[4]
        }pt (400)`,
        8
      ).makeNodeTag(chroma(this.textColorsTheme.lightColor).gl(), true)
    )
    this.nodeContrastScores.appendChild(
      new Tag(
        '_apca-black',
        `Lc ${this.getAPCAContrast('BLACK').toFixed(1)} • ${
          this.getMinFontSizes('BLACK')[4]
        }pt (400)`,
        8
      ).makeNodeTag(chroma(this.textColorsTheme.darkColor).gl(), true)
    )

    return this.nodeContrastScores
  }

  makeDetailedBaseProps() {
    this.nodeDetailedBaseProps = figma.createFrame()
    this.nodeDetailedBaseProps.name = '_base'
    this.nodeDetailedBaseProps.fills = []

    // layout
    this.nodeDetailedBaseProps.layoutMode = 'VERTICAL'
    this.nodeDetailedBaseProps.primaryAxisSizingMode = 'AUTO'
    this.nodeDetailedBaseProps.layoutAlign = 'STRETCH'
    this.nodeDetailedBaseProps.itemSpacing = 4

    // insert
    this.nodeDetailedBaseProps.appendChild(
      new Tag('_title', 'Base', 10).makeNodeTag()
    )
    this.nodeDetailedBaseProps.appendChild(
      new Tag('_hex', this.hex.toUpperCase()).makeNodeTag()
    )
    this.nodeDetailedBaseProps.appendChild(
      new Tag(
        '_lch',
        `L ${Math.floor(this.lch[0])} • C ${Math.floor(
          this.lch[1]
        )} • H ${Math.floor(this.lch[2])}`
      ).makeNodeTag()
    )

    return this.nodeDetailedBaseProps
  }

  makeDetailedWCAGScoresProps() {
    this.nodeDetailedWCAGScoresProps = figma.createFrame()
    this.nodeDetailedWCAGScoresProps.name = '_wcag-score'
    this.nodeDetailedWCAGScoresProps.fills = []

    // layout
    this.nodeDetailedWCAGScoresProps.layoutMode = 'VERTICAL'
    this.nodeDetailedWCAGScoresProps.primaryAxisSizingMode = 'AUTO'
    this.nodeDetailedWCAGScoresProps.layoutAlign = 'STRETCH'
    this.nodeDetailedWCAGScoresProps.itemSpacing = 4

    // insert
    this.nodeDetailedWCAGScoresProps.appendChild(
      new Tag('_title', 'WCAG scores', 10).makeNodeTag()
    )
    this.nodeDetailedWCAGScoresProps.appendChild(
      new Tag(
        '_wcag21-white',
        `${this.getContrast('WHITE').toFixed(2)} • ${this.getLevel('WHITE')}`
      ).makeNodeTag(chroma(this.textColorsTheme.lightColor).gl(), true)
    )
    this.nodeDetailedWCAGScoresProps.appendChild(
      new Tag(
        '_wcag21-black',
        `${this.getContrast('BLACK').toFixed(2)} • ${this.getLevel('BLACK')}`
      ).makeNodeTag(chroma(this.textColorsTheme.darkColor).gl(), true)
    )

    return this.nodeDetailedWCAGScoresProps
  }

  makeDetailedAPCAScoresProps() {
    this.nodeDetailedAPCAScoresProps = figma.createFrame()
    this.nodeDetailedAPCAScoresProps.name = '_wcag-score'
    this.nodeDetailedAPCAScoresProps.fills = []

    // layout
    this.nodeDetailedAPCAScoresProps.layoutMode = 'VERTICAL'
    this.nodeDetailedAPCAScoresProps.primaryAxisSizingMode = 'AUTO'
    this.nodeDetailedAPCAScoresProps.counterAxisSizingMode = 'FIXED'
    this.nodeDetailedAPCAScoresProps.layoutAlign = 'STRETCH'
    this.nodeDetailedAPCAScoresProps.itemSpacing = 4

    // insert
    this.nodeDetailedAPCAScoresProps.appendChild(
      new Tag('_title', 'APCA scores', 10).makeNodeTag()
    )
    this.nodeDetailedAPCAScoresProps.appendChild(
      this.makeColumns(
        [
          new Tag(
            '_apca-white',
            `Lc ${this.getAPCAContrast('WHITE').toFixed(1)}`,
          ).makeNodeTag(chroma(this.textColorsTheme.lightColor).gl(), true),
          new Tag(
            '_minimum-text-body',
            'Minimum text body',
          ).makeNodeTag(),
          new Tag(
            '_200',
            `${this.getMinFontSizes('WHITE')[4]}pt (200)`,
          ).makeNodeTag(),
          new Tag(
            '_400',
            `${this.getMinFontSizes('WHITE')[4]}pt (400)`,
          ).makeNodeTag(),
          new Tag(
            '_700',
            `${this.getMinFontSizes('WHITE')[4]}pt (700)`
          ).makeNodeTag()
        ],
        [
          new Tag(
            '_apca-black',
            `Lc ${this.getAPCAContrast('BLACK').toFixed(1)}`
          ).makeNodeTag(chroma(this.textColorsTheme.darkColor).gl(), true),
          new Tag(
            '_minimum-text-body',
            'Minimum text body'
          ).makeNodeTag(),
          new Tag(
            '_200',
            `${this.getMinFontSizes('BLACK')[4]}pt (200)`
          ).makeNodeTag(),
          new Tag(
            '_400',
            `${this.getMinFontSizes('BLACK')[4]}pt (400)`
          ).makeNodeTag(),
          new Tag(
            '_700',
            `${this.getMinFontSizes('BLACK')[4]}pt (700)`
          ).makeNodeTag()
        ]
      )
    )

    return this.nodeDetailedAPCAScoresProps
  }

  makeColumns(leftNodes: Array<FrameNode>, rightNodes: Array<FrameNode>) {
    this.nodeColumns = figma.createFrame()
    this.nodeLeftColumn = figma.createFrame()
    this.nodeRightColumn = figma.createFrame()
    this.nodeColumns.name = '_columns'
    this.nodeLeftColumn.name = '_left-column'
    this.nodeRightColumn.name = '_right-column'
    //this.nodeColumns.fills = this.nodeLeftColumn.fills = this.nodeRightColumn.fills = []

    // layout
    this.nodeColumns.layoutMode = 'HORIZONTAL'
    this.nodeColumns.primaryAxisSizingMode = 'FIXED'
    this.nodeColumns.counterAxisSizingMode = 'AUTO'
    this.nodeColumns.layoutAlign = 'STRETCH'
    this.nodeColumns.itemSpacing = 8

    this.nodeLeftColumn.layoutMode = this.nodeRightColumn.layoutMode = 'VERTICAL'
    this.nodeLeftColumn.primaryAxisSizingMode = this.nodeRightColumn.primaryAxisSizingMode = 'AUTO'
    this.nodeLeftColumn.counterAxisSizingMode = this.nodeRightColumn.counterAxisSizingMode = 'FIXED'
    this.nodeLeftColumn.layoutGrow = this.nodeRightColumn.layoutGrow = 1
    this.nodeLeftColumn.itemSpacing = this.nodeRightColumn.itemSpacing = 4

    // insert
    leftNodes.forEach(node => this.nodeLeftColumn.appendChild(node))
    rightNodes.forEach(node => this.nodeRightColumn.appendChild(node))
    this.nodeColumns.appendChild(this.nodeLeftColumn)
    this.nodeColumns.appendChild(this.nodeRightColumn)

    return this.nodeColumns   
  }

  makeDetailedNode() {
    // base
    this.node.name = '_properties'
    this.node.fills = []

    // layout
    this.node.layoutMode = 'VERTICAL'
    this.node.primaryAxisSizingMode = 'FIXED'
    this.node.counterAxisSizingMode = 'FIXED'
    this.node.layoutAlign = 'STRETCH'
    this.node.layoutGrow = 1
    this.node.itemSpacing = 16

    // insert
    this.node.appendChild(
      this.makeColumns(
        [
          this.makeDetailedBaseProps(),
        ],
        [
          this.makeDetailedWCAGScoresProps()
        ]
      )
    )
    this.node.appendChild(this.makeDetailedAPCAScoresProps())

    return this.node
  }

  makeNode() {
    // base
    this.node.name = '_properties'
    this.node.fills = []

    // layout
    this.node.layoutMode = 'VERTICAL'
    this.node.primaryAxisSizingMode = 'FIXED'
    this.node.counterAxisSizingMode = 'FIXED'
    this.node.primaryAxisAlignItems = 'SPACE_BETWEEN'
    this.node.layoutAlign = 'STRETCH'
    this.node.layoutGrow = 1

    // insert
    this.node.appendChild(this.makeNodeTop())
    this.nodeTop.appendChild(new Tag('_scale', this.name, 10).makeNodeTag())
    this.nodeTop.appendChild(this.makeNodeBasics())
    this.node.appendChild(this.makeNodeBottom())

    return this.node
  }
}
