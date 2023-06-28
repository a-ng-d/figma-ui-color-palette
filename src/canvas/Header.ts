import type { PaletteNode } from '../utils/types'
import Sample from './Sample'
import { locals, lang } from '../content/locals'

export default class Header {
  parent: PaletteNode
  node: FrameNode

  constructor(parent: PaletteNode) {
    this.parent = parent
  }

  makeNode() {
    // base
    this.node = figma.createFrame()
    this.node.name = '_header'
    this.node.resize(100, 48)
    this.node.fills = []

    // layout
    this.node.layoutMode = 'HORIZONTAL'
    this.node.primaryAxisSizingMode = 'AUTO'
    this.node.counterAxisSizingMode = 'AUTO'

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
      ).makeNodeName('ABSOLUTE', 160, 48)
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
            ).makeNodeName('ABSOLUTE', 160, 48)
          )
        })

    return this.node
  }
}
