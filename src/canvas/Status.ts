import { tolgee } from '..'
import Tag from './Tag'

export default class Status {
  private status: {
    isClosestToRef: boolean
    isLocked: boolean
    isTransparent: boolean
  }
  private source: { [key: string]: number }
  node: FrameNode

  constructor({
    status = {
      isClosestToRef: false,
      isLocked: false,
      isTransparent: false,
    },
    source = {
      r: 0,
      g: 0,
      b: 0,
    },
  }: {
    status: {
      isClosestToRef: boolean
      isLocked: boolean
      isTransparent: boolean
    }
    source: { [key: string]: number }
  }) {
    this.status = status
    this.source = source
    this.node = this.makeNode()
  }

  makeNode = () => {
    // Base
    this.node = figma.createFrame()
    this.node.name = '_status'
    this.node.fills = []

    // Layout
    this.node.layoutMode = 'HORIZONTAL'
    this.node.primaryAxisSizingMode = 'FIXED'
    this.node.layoutAlign = 'STRETCH'
    this.node.layoutSizingVertical = 'HUG'

    if (this.status.isClosestToRef)
      this.node.appendChild(
        new Tag({
          name: '_close',
          content: tolgee.t('paletteProperties.closest'),
          fontSize: 10,
        }).makeNodeTagwithIndicator(
          [this.source.r, this.source.g, this.source.b, 1],
          false
        )
      )

    if (this.status.isLocked)
      this.node.appendChild(
        new Tag({
          name: '_lock',
          content: tolgee.t('paletteProperties.locked'),
          fontSize: 10,
        }).makeNodeTag()
      )

    if (this.status.isTransparent)
      this.node.appendChild(
        new Tag({
          name: '_transparent',
          content: 'Transparent',
          fontSize: 10,
        }).makeNodeTag()
      )

    return this.node
  }
}
