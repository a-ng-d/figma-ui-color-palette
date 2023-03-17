import Tag from './Tag'

export default class Status {
  status: { isClosestToRef: boolean }
  node: FrameNode

  constructor(status: { isClosestToRef: boolean }) {
    this.status = status
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
      this.node.appendChild(new Tag('_close', 'Closest to ref', 10).makeNodeTag())

    return this.node
  }
}
