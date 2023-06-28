import type { PaletteNode } from '../utils/types'
import Tag from './Tag'
import { lang, locals } from '../content/locals'

export default class Title {
  text: string
  parent: PaletteNode
  nodeName: FrameNode
  nodeProps: FrameNode
  node: FrameNode

  constructor(text: string, parent: PaletteNode) {
    this.text = text
    this.parent = parent
  }

  makeNodeName() {
    // base
    this.nodeName = figma.createFrame()
    this.nodeName.name = '_palette-name'
    this.nodeName.fills = []

    // layout
    this.nodeName.layoutMode = 'VERTICAL'
    this.nodeName.primaryAxisSizingMode = 'AUTO'
    this.nodeName.counterAxisSizingMode = 'FIXED'
    this.nodeName.layoutGrow = 1

    // insert
    this.nodeName.appendChild(
      new Tag(
        '_name',
        this.parent.name === '' ? locals[lang].name : this.parent.name,
        20
      ).makeNodeTag()
    )

    return this.nodeName
  }

  makeNodeProps() {
    // base
    this.nodeProps = figma.createFrame()
    this.nodeProps.name = '_palette-props'
    this.nodeProps.fills = []

    // layout
    this.nodeProps.layoutMode = 'VERTICAL'
    this.nodeProps.primaryAxisSizingMode = 'AUTO'
    this.nodeProps.counterAxisSizingMode = 'FIXED'
    this.nodeProps.counterAxisAlignItems = 'MAX'
    this.nodeProps.itemSpacing = 4
    this.nodeProps.layoutGrow = 1

    // insert
    this.nodeProps.appendChild(
      new Tag('_preset', `Preset: ${this.parent.preset.name}`, 12).makeNodeTag()
    )
    this.nodeProps.appendChild(
      new Tag(
        '_view',
        `Layout: ${this.parent.view.includes('PALETTE') ? 'Palette' : 'Sheet'}`,
        12
      ).makeNodeTag()
    )
    this.nodeProps.appendChild(
      new Tag(
        '_color-space',
        `Color space: ${this.parent.colorSpace}`,
        12
      ).makeNodeTag()
    )

    return this.nodeProps
  }

  makeNode() {
    // base
    this.node = figma.createFrame()
    this.node.name = '_title'
    this.node.fills = []

    // layout
    this.node.layoutMode = 'HORIZONTAL'
    this.node.primaryAxisSizingMode = 'FIXED'
    this.node.counterAxisSizingMode = 'AUTO'
    this.node.layoutAlign = 'STRETCH'

    // insert
    this.node.appendChild(this.makeNodeName())
    this.node.appendChild(this.makeNodeProps())

    return this.node
  }
}
