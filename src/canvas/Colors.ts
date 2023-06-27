import chroma from 'chroma-js'
import type { PaletteNode, PaletteDataItem } from '../utils/types'
import Sample from './Sample'
import Header from './Header'
import Title from './Title'
import { locals, lang } from '../content/locals'

export default class Colors {
  parent: PaletteNode
  palette: FrameNode
  paletteData: Array<PaletteDataItem>
  nodeRow: FrameNode
  nodeRowSource: FrameNode
  nodeRowShades: FrameNode
  nodeRowSlice: FrameNode
  nodeEmpty: FrameNode
  node: FrameNode

  constructor(parent?: PaletteNode, palette?: FrameNode) {
    this.parent = parent
    this.palette = palette
    this.paletteData = []
  }

  getShadeColorFromLch(
    sourceColor: Array<number>,
    lightness: number,
    hueShifting: number,
    algorithmVersion: string
  ) {
    const lch: Array<number> = chroma(sourceColor).lch(),
      newColor: { _rgb: Array<number> } = chroma.lch(
        lightness * 1,
        algorithmVersion == 'v2'
          ? Math.sin((lightness / 100) * Math.PI) * chroma(sourceColor).lch()[1]
          : chroma(sourceColor).lch()[1],
        lch[2] + hueShifting < 0
          ? 0
          : lch[2] + hueShifting > 360
          ? 360
          : lch[2] + hueShifting
      )

    return newColor
  }

  getShadeColorFromOklch(
    sourceColor: Array<number>,
    lightness: number,
    hueShifting: number,
    algorithmVersion: string
  ) {
    const oklch: { _rgb: Array<number> } = chroma(sourceColor).oklch()
    const newColor: { _rgb: Array<number> } = chroma.oklch(
      lightness / 100,
      algorithmVersion == 'v2'
        ? Math.sin((lightness / 100) * Math.PI) * chroma(sourceColor).oklch()[1]
        : chroma(sourceColor).oklch()[1],
      oklch[2] + hueShifting < 0
        ? 0
        : oklch[2] + hueShifting > 360
        ? 360
        : oklch[2] + hueShifting
    )

    return newColor
  }

  makeEmptyCase() {
    // base
    this.nodeEmpty = figma.createFrame()
    this.nodeEmpty.name = '_message'
    this.nodeEmpty.resize(100, 48)
    this.nodeEmpty.fills = []

    // layout
    this.nodeEmpty.layoutMode = 'HORIZONTAL'
    this.nodeEmpty.primaryAxisSizingMode = 'FIXED'
    this.nodeEmpty.counterAxisSizingMode = 'AUTO'
    this.nodeEmpty.layoutAlign = 'STRETCH'
    this.nodeEmpty.primaryAxisAlignItems = 'CENTER'

    // insert
    this.nodeEmpty.appendChild(
      new Sample(
        locals[lang].warning.emptySourceColors,
        null,
        null,
        [255, 255, 255],
        this.parent.view,
        this.parent.textColorsTheme
      ).makeNodeName('RELATIVE', 100, 48)
    )

    return this.nodeEmpty
  }

  makePaletteData() {
    this.parent.colors.forEach((color) => {
      const paletteDataItem: PaletteDataItem = {
          name: color.name,
          shades: [],
        },
        sourceColor: Array<number> = chroma([
          color.rgb.r * 255,
          color.rgb.g * 255,
          color.rgb.b * 255,
        ])._rgb

      paletteDataItem.shades.push({
        name: 'source',
        hex: chroma(sourceColor).hex(),
        rgb: sourceColor.map(value => Math.floor(value)),
        gl: chroma(sourceColor).gl(),
        oklch: chroma(sourceColor).oklch(),
      })

      Object.values(this.parent.scale)
        .reverse()
        .forEach((lightness: number) => {
          let newColor: { _rgb: Array<number> }

          if (color.oklch) {
            newColor = this.getShadeColorFromOklch(
              sourceColor,
              lightness,
              color.hueShifting,
              this.parent.algorithmVersion
            )
          } else {
            newColor = this.getShadeColorFromLch(
              sourceColor,
              lightness,
              color.hueShifting,
              this.parent.algorithmVersion
            )
          }

          const scaleName: string = Object.keys(this.parent.scale)
            .find((key) => this.parent.scale[key] === lightness)
            .substr(10)

          paletteDataItem.shades.push({
            name: scaleName,
            hex: chroma(newColor).hex(),
            rgb: newColor._rgb.map(value => Math.floor(value)),
            gl: chroma(newColor).gl(),
            oklch: chroma(newColor).oklch(),
          })
        })

      this.paletteData.push(paletteDataItem)
    })

    this.palette.setPluginData('data', JSON.stringify(this.paletteData))
  }

  makeNodeSlice(shades: Array<FrameNode>) {
    // base
    this.nodeRowSlice = figma.createFrame()
    this.nodeRowSlice.name = '_slice'
    this.nodeRowSlice.fills = []

    // layout
    this.nodeRowSlice.layoutMode = 'HORIZONTAL'
    this.nodeRowSlice.primaryAxisSizingMode = 'AUTO'
    this.nodeRowSlice.counterAxisSizingMode = 'AUTO'

    // insert
    shades.forEach((shade) => this.nodeRowSlice.appendChild(shade))

    return this.nodeRowSlice
  }

  makeNode() {
    // base
    this.node = figma.createFrame()
    this.node.name = '_colors﹒do not edit any layer'
    this.node.fills = []
    this.node.locked = true

    // layout
    this.node.layoutMode = 'VERTICAL'
    this.node.primaryAxisSizingMode = 'AUTO'
    this.node.counterAxisSizingMode = 'AUTO'

    // insert
    this.node.appendChild(
      new Title(
        `${
          this.parent.paletteName === ''
            ? locals[lang].name
            : this.parent.paletteName
        } • ${this.parent.preset.name} • ${
          this.parent.view.includes('PALETTE') ? 'Palette' : 'Sheet'
        }`,
        this.parent
      ).makeNode()
    )
    this.node.appendChild(new Header(this.parent).makeNode())
    this.parent.colors.forEach((color) => {
      let i = 1
      const sourceColor: Array<number> = chroma([
          color.rgb.r * 255,
          color.rgb.g * 255,
          color.rgb.b * 255,
        ])._rgb,
        samples: Array<FrameNode> = []

      // base
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

      // layout
      this.nodeRow.layoutMode =
        this.nodeRowSource.layoutMode =
        this.nodeRowShades.layoutMode =
          'HORIZONTAL'
      this.nodeRow.primaryAxisSizingMode =
        this.nodeRowSource.primaryAxisSizingMode =
        this.nodeRowShades.primaryAxisSizingMode =
          'AUTO'
      this.nodeRow.counterAxisSizingMode =
        this.nodeRowSource.counterAxisSizingMode =
        this.nodeRowShades.counterAxisSizingMode =
          'AUTO'

      // insert
      this.nodeRowSource.appendChild(
        this.parent.view.includes('PALETTE')
          ? new Sample(
              color.name,
              null,
              null,
              [color.rgb.r * 255, color.rgb.g * 255, color.rgb.b * 255],
              this.parent.view,
              this.parent.textColorsTheme
            ).makeNodeShade(160, 224, color.name, true)
          : new Sample(
              color.name,
              null,
              null,
              [color.rgb.r * 255, color.rgb.g * 255, color.rgb.b * 255],
              this.parent.view,
              this.parent.textColorsTheme
            ).makeNodeRichShade(160, 376, color.name, true)
      )

      Object.values(this.parent.scale)
        .reverse()
        .forEach((lightness: number) => {
          let newColor: { _rgb: Array<number> }

          if (color.oklch) {
            newColor = this.getShadeColorFromOklch(
              sourceColor,
              lightness,
              color.hueShifting,
              this.parent.algorithmVersion
            )
          } else {
            newColor = this.getShadeColorFromLch(
              sourceColor,
              lightness,
              color.hueShifting,
              this.parent.algorithmVersion
            )
          }

          const distance: number = chroma.distance(
            chroma(sourceColor).hex(),
            chroma(newColor).hex(),
            'lch'
          )

          const scaleName: string = Object.keys(this.parent.scale)
            .find((key) => this.parent.scale[key] === lightness)
            .substr(10)

          if (this.parent.view.includes('PALETTE')) {
            this.nodeRowShades.appendChild(
              new Sample(
                color.name,
                color.rgb,
                scaleName,
                newColor._rgb,
                this.parent.view,
                this.parent.textColorsTheme,
                { isClosestToRef: distance < 4 ? true : false }
              ).makeNodeShade(160, 224, scaleName)
            )
          } else {
            this.nodeRowShades.layoutMode = 'VERTICAL'
            samples.push(
              new Sample(
                color.name,
                color.rgb,
                scaleName,
                newColor._rgb,
                this.parent.view,
                this.parent.textColorsTheme,
                { isClosestToRef: distance < 4 ? true : false }
              ).makeNodeRichShade(264, 376, scaleName)
            )
            if (i % 4 == 0) {
              this.nodeRowShades.appendChild(this.makeNodeSlice(samples))
              samples.length = 0
            }
          }
          i++
        })
      if (this.parent.view.includes('SHEET'))
        this.nodeRowShades.appendChild(this.makeNodeSlice(samples))
      samples.length = 0
      i = 1

      this.nodeRow.appendChild(this.nodeRowSource)
      this.nodeRow.appendChild(this.nodeRowShades)
      this.node.appendChild(this.nodeRow)
    })
    this.makePaletteData()
    if (this.parent.colors.length == 0)
      this.node.appendChild(this.makeEmptyCase())

    return this.node
  }
}
