import * as blinder from 'color-blind'
import { HexModel } from '@a_ng_d/figmug-ui'
import { APCAcontrast, fontLookupAPCA, sRGBtoY } from 'apca-w3'
import chroma from 'chroma-js'
import { Hsluv } from 'hsluv'

import { lang, locals } from '../content/locals'
import {
  ColorSpaceConfiguration,
  VisionSimulationModeConfiguration,
} from '../types/configurations'
import { ActionsList, TextColorsThemeHexModel } from '../types/models'
import Tag from './Tag'

export default class Properties {
  name: string
  rgb: [number, number, number]
  colorSpace: ColorSpaceConfiguration
  visionSimulationMode: VisionSimulationModeConfiguration
  textColorsTheme: TextColorsThemeHexModel
  hex: HexModel
  lch: Array<number>
  oklch: Array<number>
  lab: Array<number>
  oklab: Array<number>
  hsl: Array<number>
  hsluv: Array<number>
  nodeTopProps: FrameNode | null
  nodeBottomProps: FrameNode | null
  nodeBaseProps: FrameNode | null
  nodeContrastScoresProps: FrameNode | null
  nodeProperties: TextNode | null
  nodeDetailedBaseProps: FrameNode | null
  nodeDetailedWCAGScoresProps: FrameNode | null
  nodeDetailedAPCAScoresProps: FrameNode | null
  nodeColumns: FrameNode | null
  nodeLeftColumn: FrameNode | null
  nodeRightColumn: FrameNode | null
  node: FrameNode | null

  constructor(
    name: string,
    rgb: [number, number, number],
    colorSpace: ColorSpaceConfiguration,
    visionSimulationMode: VisionSimulationModeConfiguration,
    textColorsTheme: TextColorsThemeHexModel
  ) {
    this.name = name
    this.rgb = rgb
    this.colorSpace = colorSpace
    this.visionSimulationMode = visionSimulationMode
    this.textColorsTheme = textColorsTheme
    this.hex = chroma(rgb).hex()
    this.lch = chroma(rgb).lch()
    this.oklch = chroma(rgb).oklch()
    this.lab = chroma(rgb).lab()
    this.oklab = chroma(rgb).oklab()
    this.hsl = chroma(rgb).hsl()
    this.hsluv = this.getHsluv(rgb)
    this.nodeTopProps = null
    this.nodeBottomProps = null
    this.nodeBaseProps = null
    this.nodeContrastScoresProps = null
    this.nodeProperties = null
    this.nodeDetailedBaseProps = null
    this.nodeDetailedWCAGScoresProps = null
    this.nodeDetailedAPCAScoresProps = null
    this.nodeColumns = null
    this.nodeLeftColumn = null
    this.nodeRightColumn = null
    this.node = null
  }

  simulateColorBlind = (
    sourceColor: string,
    visionSimulationMode: VisionSimulationModeConfiguration
  ): string => {
    const actions: ActionsList = {
      NONE: () => sourceColor,
      PROTANOMALY: () => chroma(blinder.protanomaly(sourceColor)),
      PROTANOPIA: () => chroma(blinder.protanopia(sourceColor)),
      DEUTERANOMALY: () => chroma(blinder.deuteranomaly(sourceColor)),
      DEUTERANOPIA: () => chroma(blinder.deuteranopia(sourceColor)),
      TRITANOMALY: () => chroma(blinder.tritanomaly(sourceColor)),
      TRITANOPIA: () => chroma(blinder.tritanopia(sourceColor)),
      ACHROMATOMALY: () => chroma(blinder.achromatomaly(sourceColor)),
      ACHROMATOPSIA: () => chroma(blinder.achromatopsia(sourceColor)),
    }

    const result = actions[visionSimulationMode]?.()
    return result !== undefined ? result : '#000000'
  }

  getContrast = (textColor: string) => {
    return chroma.contrast(
      chroma(this.rgb).hex(),
      textColor === 'DARK'
        ? this.simulateColorBlind(
            this.textColorsTheme.darkColor,
            this.visionSimulationMode
          )
        : this.simulateColorBlind(
            this.textColorsTheme.lightColor,
            this.visionSimulationMode
          )
    )
  }

  getAPCAContrast = (textColor: string) => {
    return APCAcontrast(
      sRGBtoY(
        textColor === 'DARK'
          ? chroma(
              this.simulateColorBlind(
                this.textColorsTheme.darkColor,
                this.visionSimulationMode
              )
            ).rgb()
          : chroma(
              this.simulateColorBlind(
                this.textColorsTheme.lightColor,
                this.visionSimulationMode
              )
            ).rgb()
      ),
      sRGBtoY(this.rgb)
    )
  }

  getLevel = (textColor: string) => {
    return this.getContrast(textColor) < 4.5
      ? 'A'
      : this.getContrast(textColor) >= 4.5 && this.getContrast(textColor) < 7
        ? 'AA'
        : 'AAA'
  }

  getMinFontSizes = (textColor: string) => {
    return fontLookupAPCA(this.getAPCAContrast(textColor))
  }

  getHsluv = (rgb: [number, number, number]) => {
    const hsluv = new Hsluv()
    hsluv.rgb_r = rgb[0] / 255
    hsluv.rgb_g = rgb[1] / 255
    hsluv.rgb_b = rgb[2] / 255
    hsluv.rgbToHsluv()

    return [hsluv.hsluv_h, hsluv.hsluv_s, hsluv.hsluv_l]
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

    // Layout
    this.nodeBaseProps.layoutMode = 'VERTICAL'
    this.nodeBaseProps.counterAxisSizingMode = 'FIXED'
    this.nodeBaseProps.layoutGrow = 1
    this.nodeBaseProps.layoutSizingVertical = 'HUG'
    this.nodeBaseProps.counterAxisAlignItems = 'MAX'
    this.nodeBaseProps.itemSpacing = 4

    let basePropViaColorSpace

    if (this.colorSpace === 'LCH') {
      basePropViaColorSpace = new Tag(
        '_lch',
        `L ${Math.floor(this.lch[0])} • C ${Math.floor(
          this.lch[1]
        )} • H ${Math.floor(this.lch[2])}`
      ).makeNodeTag()
    } else if (this.colorSpace === 'OKLCH') {
      basePropViaColorSpace = new Tag(
        '_oklch',
        `L ${parseFloat(this.oklch[0].toFixed(2))} • C ${parseFloat(
          this.oklch[1].toFixed(2)
        )} • H ${Math.floor(this.oklch[2])}`
      ).makeNodeTag()
    } else if (this.colorSpace === 'LAB') {
      basePropViaColorSpace = new Tag(
        '_lab',
        `L ${Math.floor(this.lab[0])} • A ${Math.floor(
          this.lab[1]
        )} • B ${Math.floor(this.lab[2])}`
      ).makeNodeTag()
    } else if (this.colorSpace === 'OKLAB') {
      basePropViaColorSpace = new Tag(
        '_oklab',
        `L ${parseFloat(this.oklab[0].toFixed(2))} • A ${parseFloat(
          this.oklab[1].toFixed(2)
        )} • B ${parseFloat(this.oklab[2].toFixed(2))}`
      ).makeNodeTag()
    } else if (this.colorSpace === 'HSL') {
      basePropViaColorSpace = new Tag(
        '_hsl',
        `H ${Math.floor(this.hsl[0])} • S ${Math.floor(
          this.hsl[1] * 100
        )} • L ${Math.floor(this.hsl[2] * 100)}`
      ).makeNodeTag()
    } else if (this.colorSpace === 'HSLUV') {
      basePropViaColorSpace = new Tag(
        '_hsluv',
        `H ${Math.floor(this.hsluv[0])} • S ${Math.floor(
          this.hsluv[1]
        )} • L ${Math.floor(this.hsluv[2])}`
      ).makeNodeTag()
    }

    // Insert
    this.nodeBaseProps.appendChild(
      new Tag('_hex', this.hex.toUpperCase()).makeNodeTag()
    )
    this.nodeBaseProps.appendChild(basePropViaColorSpace as FrameNode)

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
    this.nodeContrastScoresProps.appendChild(
      new Tag(
        '_wcag21-light',
        `${this.getContrast('LIGHT').toFixed(2)} • ${this.getLevel('LIGHT')}`
      ).makeNodeTagwithIndicator(
        chroma(
          this.simulateColorBlind(
            this.textColorsTheme.lightColor,
            this.visionSimulationMode
          )
        ).gl()
      )
    )
    this.nodeContrastScoresProps.appendChild(
      new Tag(
        '_wcag21-dark',
        `${this.getContrast('DARK').toFixed(2)} • ${this.getLevel('DARK')}`
      ).makeNodeTagwithIndicator(
        chroma(
          this.simulateColorBlind(
            this.textColorsTheme.darkColor,
            this.visionSimulationMode
          )
        ).gl()
      )
    )
    this.nodeContrastScoresProps.appendChild(
      new Tag(
        '_apca-light',
        `Lc ${this.getAPCAContrast('LIGHT').toFixed(1)} • ${
          this.getMinFontSizes('LIGHT')[4]
        }pt (400)`
      ).makeNodeTagwithIndicator(
        chroma(
          this.simulateColorBlind(
            this.textColorsTheme.lightColor,
            this.visionSimulationMode
          )
        ).gl()
      )
    )
    this.nodeContrastScoresProps.appendChild(
      new Tag(
        '_apca-dark',
        `Lc ${this.getAPCAContrast('DARK').toFixed(1)} • ${
          this.getMinFontSizes('DARK')[4]
        }pt (400)`
      ).makeNodeTagwithIndicator(
        chroma(
          this.simulateColorBlind(
            this.textColorsTheme.darkColor,
            this.visionSimulationMode
          )
        ).gl()
      )
    )

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

    if (this.colorSpace === 'LCH') {
      basePropViaColorSpace = new Tag(
        '_lch',
        `L ${Math.floor(this.lch[0])} • C ${Math.floor(
          this.lch[1]
        )} • H ${Math.floor(this.lch[2])}`
      ).makeNodeTag()
    } else if (this.colorSpace === 'OKLCH') {
      basePropViaColorSpace = new Tag(
        '_oklch',
        `L ${parseFloat(this.oklch[0].toFixed(2))} • C ${parseFloat(
          this.oklch[1].toFixed(2)
        )} • H ${Math.floor(this.oklch[2])}`
      ).makeNodeTag()
    } else if (this.colorSpace === 'LAB') {
      basePropViaColorSpace = new Tag(
        '_lab',
        `L ${Math.floor(this.lab[0])} • A ${Math.floor(
          this.lab[1]
        )} • B ${Math.floor(this.lab[2])}`
      ).makeNodeTag()
    } else if (this.colorSpace === 'OKLAB') {
      basePropViaColorSpace = new Tag(
        '_oklab',
        `L ${parseFloat(this.oklab[0].toFixed(2))} • A ${parseFloat(
          this.oklab[1].toFixed(2)
        )} • B ${parseFloat(this.oklab[2].toFixed(2))}`
      ).makeNodeTag()
    } else if (this.colorSpace === 'HSL') {
      basePropViaColorSpace = new Tag(
        '_lab',
        `H ${Math.floor(this.hsl[0])} • S ${Math.floor(
          this.hsl[1] * 100
        )} • L ${Math.floor(this.hsl[2] * 100)}`
      ).makeNodeTag()
    } else if (this.colorSpace === 'HSLUV') {
      basePropViaColorSpace = new Tag(
        '_hsluv',
        `H ${Math.floor(this.hsluv[0])} • S ${Math.floor(
          this.hsluv[1]
        )} • L ${Math.floor(this.hsluv[2])}`
      ).makeNodeTag()
    }

    // Insert
    this.nodeDetailedBaseProps.appendChild(
      new Tag('_title', locals[lang].paletteProperties.base, 10).makeNodeTag()
    )
    this.nodeDetailedBaseProps.appendChild(
      new Tag('_hex', this.hex.toUpperCase()).makeNodeTag()
    )
    this.nodeDetailedBaseProps.appendChild(basePropViaColorSpace as FrameNode)

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
    this.nodeDetailedWCAGScoresProps.appendChild(
      new Tag('_title', locals[lang].paletteProperties.wcag, 10).makeNodeTag()
    )
    this.nodeDetailedWCAGScoresProps.appendChild(
      new Tag(
        '_wcag21-light',
        `${this.getContrast('LIGHT').toFixed(2)} • ${this.getLevel('LIGHT')}`
      ).makeNodeTagwithIndicator(chroma(this.textColorsTheme.lightColor).gl())
    )
    this.nodeDetailedWCAGScoresProps.appendChild(
      new Tag(
        '_wcag21-dark',
        `${this.getContrast('DARK').toFixed(2)} • ${this.getLevel('DARK')}`
      ).makeNodeTagwithIndicator(chroma(this.textColorsTheme.darkColor).gl())
    )

    return this.nodeDetailedWCAGScoresProps
  }

  makeNodeDetailedAPCAScoresProps = () => {
    this.nodeDetailedAPCAScoresProps = figma.createFrame()
    this.nodeDetailedAPCAScoresProps.name = '_apca-scores'
    this.nodeDetailedAPCAScoresProps.fills = []
    const minimumDarkFontSize: Array<string | number> =
        this.getMinFontSizes('DARK'),
      minimumLightFontSize: Array<string | number> =
        this.getMinFontSizes('LIGHT')

    // Layout
    this.nodeDetailedAPCAScoresProps.layoutMode = 'VERTICAL'
    this.nodeDetailedAPCAScoresProps.counterAxisSizingMode = 'FIXED'
    this.nodeDetailedAPCAScoresProps.layoutAlign = 'STRETCH'
    this.nodeDetailedAPCAScoresProps.layoutSizingVertical = 'HUG'
    this.nodeDetailedAPCAScoresProps.itemSpacing = 4

    // Insert
    this.nodeDetailedAPCAScoresProps.appendChild(
      new Tag('_title', locals[lang].paletteProperties.apca, 10).makeNodeTag()
    )
    this.nodeDetailedAPCAScoresProps.appendChild(
      this.makeNodeColumns(
        [
          new Tag(
            '_apca-light',
            `Lc ${this.getAPCAContrast('LIGHT').toFixed(1)}`
          ).makeNodeTagwithIndicator(
            chroma(this.textColorsTheme.lightColor).gl()
          ),
          new Tag(
            '_minimum-font-sizes',
            locals[lang].paletteProperties.fontSize
          ).makeNodeTag(),
          new Tag(
            '_200-light',
            `${minimumLightFontSize[2]}pt (200)`
          ).makeNodeTag(),
          new Tag(
            '_300-light',
            `${minimumLightFontSize[3]}pt (300)`
          ).makeNodeTag(),
          new Tag(
            '_400-light',
            `${minimumLightFontSize[4]}pt (400)`
          ).makeNodeTag(),
          new Tag(
            '_500-light',
            `${minimumLightFontSize[5]}pt (500)`
          ).makeNodeTag(),
          new Tag(
            '_500-light',
            `${minimumLightFontSize[6]}pt (600)`
          ).makeNodeTag(),
          new Tag(
            '_700-light',
            `${minimumLightFontSize[7]}pt (700)`
          ).makeNodeTag(),
        ],
        [
          new Tag(
            '_apca-dark',
            `Lc ${this.getAPCAContrast('DARK').toFixed(1)}`
          ).makeNodeTagwithIndicator(
            chroma(this.textColorsTheme.darkColor).gl()
          ),
          new Tag(
            '_minimum-font-sizes',
            locals[lang].paletteProperties.fontSize
          ).makeNodeTag(),
          new Tag(
            '_200-dark',
            `${minimumDarkFontSize[2]}pt (200)`
          ).makeNodeTag(),
          new Tag(
            '_300-dark',
            `${minimumDarkFontSize[3]}pt (300)`
          ).makeNodeTag(),
          new Tag(
            '_400-dark',
            `${minimumDarkFontSize[4]}pt (400)`
          ).makeNodeTag(),
          new Tag(
            '_500-dark',
            `${minimumDarkFontSize[5]}pt (500)`
          ).makeNodeTag(),
          new Tag(
            '_600-dark',
            `${minimumDarkFontSize[6]}pt (600)`
          ).makeNodeTag(),
          new Tag(
            '_700-dark',
            `${minimumDarkFontSize[7]}pt (700)`
          ).makeNodeTag(),
        ]
      )
    )

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
    this.node.appendChild(
      this.makeNodeColumns(
        [this.makeNodeDetailedBaseProps()],
        [this.makeDetailedWCAGScoresProps()]
      )
    )
    this.node.appendChild(this.makeNodeDetailedAPCAScoresProps())

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
    this.node.appendChild(this.makeNodeTopProps())
    this.nodeTopProps?.appendChild(
      new Tag('_scale', this.name, 10).makeNodeTag()
    )
    this.nodeTopProps?.appendChild(this.makeNodeBaseProps())
    this.node.appendChild(this.makeNodeBottomProps())

    return this.node
  }
}
