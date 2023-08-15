import Tag from './Tag'

export default class Property {
  name: string
  content: string
  size: number
  node: FrameNode | null

  constructor(name: string, content: string, size: number) {
    this.name = name
    this.content = content
    this.size = size
    this.node = null
  }

  makeNode = () => {
    // base
    this.node = figma.createFrame()
    this.node.name = '_property'
    this.node.fills = []

    // layout
    this.node.layoutMode = 'VERTICAL'
    this.node.counterAxisSizingMode = 'FIXED'
    this.node.layoutAlign = 'STRETCH'
    this.node.primaryAxisSizingMode = 'FIXED'
    this.node.layoutGrow = 1

    // insert
    this.node.appendChild(
      new Tag(this.name, this.content, this.size).makeNodeTag()
    )

    return this.node
  }
}
