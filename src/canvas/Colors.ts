import chroma from 'chroma-js'
import type { PaletteNode } from '../utils/types'
import Sample from './Sample'
import Header from './Header'
import Title from './Title'

export default class Colors {
  properties: boolean
  parent: PaletteNode
  node: FrameNode

  constructor(parent: PaletteNode) {
    this.parent = parent
    this.node = figma.createFrame()
  }

  makeNode() {
    // base
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
            ? 'UI Color Palette'
            : this.parent.paletteName
        } • ${this.parent.preset.name} • ${this.parent.view === 'PALETTE' ? 'Palette' : 'Sheet'}`,
        this.parent
      ).makeNode()
    )
    this.node.appendChild(new Header(this.parent).makeNode())
    this.parent.colors.forEach((color) => {
      const row = figma.createFrame(),
        sourceColor = chroma([
          color.rgb.r * 255,
          color.rgb.g * 255,
          color.rgb.b * 255,
        ])

      // base
      row.name = color.name
      row.resize(100, 160)
      row.fills = []

      // layout
      row.layoutMode = 'HORIZONTAL'
      row.primaryAxisSizingMode = 'AUTO'
      row.counterAxisSizingMode = 'AUTO'

      // insert
      const rowName = this.parent.view === 'PALETTE' ?
        new Sample(
          color.name,
          null,
          null,
          [color.rgb.r * 255, color.rgb.g * 255, color.rgb.b * 255],
          this.parent.properties,
          this.parent.textColorsTheme
        ).makeScale(160, 224, color.name, true) :
        new Sample(
          color.name,
          null,
          null,
          [color.rgb.r * 255, color.rgb.g * 255, color.rgb.b * 255],
          this.parent.properties,
          this.parent.textColorsTheme
        ).makeRichScale(160, 320, color.name)

      row.appendChild(rowName)

      Object.values(this.parent.scale)
        .reverse()
        .forEach((lightness: string) => {
          let newColor, lch, oklch
          if (color.oklch) {
            oklch = chroma(sourceColor).oklch()
            newColor = chroma.oklch(
              parseFloat(lightness) / 100,
              this.parent.algorithmVersion == 'v2'
                ? Math.sin((parseFloat(lightness) / 100) * Math.PI) *
                    chroma(sourceColor).oklch()[1]
                : chroma(sourceColor).oklch()[1],
              oklch[2] + color.hueShifting < 0
                ? 0
                : oklch[2] + color.hueShifting > 360
                ? 360
                : oklch[2] + color.hueShifting
            )
          } else {
            lch = chroma(sourceColor).lch()
            newColor = chroma.lch(
              parseFloat(lightness) * 1,
              this.parent.algorithmVersion == 'v2'
                ? Math.sin((parseFloat(lightness) / 100) * Math.PI) *
                    chroma(sourceColor).lch()[1]
                : chroma(sourceColor).lch()[1],
              lch[2] + color.hueShifting < 0
                ? 0
                : lch[2] + color.hueShifting > 360
                ? 360
                : lch[2] + color.hueShifting
            )
          }

          const distance: number = chroma.distance(
            chroma(sourceColor).hex(),
            chroma(newColor).hex(),
            'lch'
          )

          const scaleName: string =
            Object.keys(this.parent.scale)
              .find((key) => this.parent.scale[key] === lightness)
              .substr(10)

          const sample = this.parent.view === 'PALETTE' ?
            new Sample(
              color.name,
              color.rgb,
              scaleName,
              newColor._rgb,
              this.parent.properties,
              this.parent.textColorsTheme,
              { isClosestToRef: distance < 4 ? true : false }
            ).makeScale(160, 224, scaleName) :
            new Sample(
              color.name,
              color.rgb,
              scaleName,
              newColor._rgb,
              this.parent.properties,
              this.parent.textColorsTheme,
              { isClosestToRef: distance < 4 ? true : false }
            ).makeRichScale(264, 320, scaleName)
          row.name = color.name
          row.appendChild(sample)
        })

      this.node.appendChild(row)
    })

    return this.node
  }
}
