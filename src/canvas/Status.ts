import Tag from './Tag'

export default class Status {
  status: { isClosestToRef: boolean }
  source: { [key: string]: number }
  node: FrameNode

  constructor(status: { isClosestToRef: boolean }, source: { [key: string]: number }) {
    this.status = status
    this.source = source
    this.node = figma.createFrame()
  }

  makeNode() {
    // base
    this.node.name = '_status'
    this.node.fills = []

    // layout
    this.node.layoutMode = 'HORIZONTAL'
    this.node.primaryAxisSizingMode = 'FIXED'
    this.node.counterAxisSizingMode = 'AUTO'
    this.node.primaryAxisAlignItems = 'SPACE_BETWEEN'
    this.node.layoutAlign = 'STRETCH'
    this.node.layoutGrow = 0

    if (this.status.isClosestToRef)
      this.node.appendChild(
        new Tag('_close', 'Closest to source', 10).makeNodeTag(
          'CUSTOM',
          this.source
        )
      )

    return this.node
  }
}
