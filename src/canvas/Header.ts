import type { PaletteNode } from '../utils/types'
import Sample from './Sample'
import { locals, lang } from '../content/locals'

export default class Header {
  parent: PaletteNode
  sampleSize: number
  node: FrameNode

  constructor(parent: PaletteNode, size: number) {
    this.parent = parent
    this.sampleSize = size
  }

  makeNode = () => {
    // base
    this.node = figma.createFrame()
    this.node.name = '_header'
    this.node.resize(100, this.sampleSize / 4)
    this.node.fills = []

    // layout
    this.node.layoutMode = 'HORIZONTAL'
    this.node.layoutSizingHorizontal = 'HUG'
    this.node.layoutSizingVertical = 'HUG'

    // insert
    this.node.appendChild(
      new Sample(
        locals[lang].colors.title,
        null,
        null,
        [255, 255, 255],
        this.parent.colorSpace,
        this.parent.view,
        this.parent.textColorsTheme
      ).makeNodeName('ABSOLUTE', this.sampleSize, 48)
    )
    if (this.parent.view.includes('PALETTE'))
      Object.values(this.parent.scale)
        .reverse()
        .forEach((lightness) => {
          this.node.appendChild(
            new Sample(
              Object.keys(this.parent.scale)
                .find((key) => this.parent.scale[key] === lightness)
                .substr(10),
              null,
              null,
              [255, 255, 255],
              this.parent.colorSpace,
              this.parent.view,
              this.parent.textColorsTheme
            ).makeNodeName('ABSOLUTE', this.sampleSize, 48)
          )
        })

    return this.node
  }
}
