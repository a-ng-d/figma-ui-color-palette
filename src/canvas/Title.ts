import type { PaletteNode } from '../utils/types'
import Tag from './Tag'
import Paragraph from './Paragraph'
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

  makeNodeName = () => {
    // base
    this.nodeName = figma.createFrame()
    this.nodeName.name = '_palette-name'
    this.nodeName.fills = []

    // layout
    this.nodeName.layoutMode = 'VERTICAL'
    this.nodeName.primaryAxisSizingMode = 'AUTO'
    this.nodeName.counterAxisSizingMode = 'FIXED'
    this.nodeName.layoutGrow = 1
    this.nodeName.itemSpacing = 8

    // insert
    this.nodeName.appendChild(
      new Tag(
        '_name',
        this.parent.name === '' ? locals[lang].name : this.parent.name,
        20
      ).makeNodeTag()
    )
    if (
      this.parent.themes.find((theme) => theme.isEnabled).type != 'default theme'
      && this.parent.themes.find((theme) => theme.isEnabled).description != ''
    )
      this.nodeName.appendChild(
        new Paragraph(
          '_description',
          this.parent.themes.find((theme) => theme.isEnabled).description,
          'FIXED',
          644,
          12
        ).makeNode()
      )

    return this.nodeName
  }

  makeNodeProps = () => {
    // base
    this.nodeProps = figma.createFrame()
    this.nodeProps.name = '_palette-props'
    this.nodeProps.fills = []

    // layout
    this.nodeProps.layoutMode = 'VERTICAL'
    this.nodeProps.primaryAxisSizingMode = 'AUTO'
    this.nodeProps.counterAxisSizingMode = 'FIXED'
    this.nodeProps.layoutGrow = 1
    this.nodeProps.counterAxisAlignItems = 'MAX'
    this.nodeProps.itemSpacing = 8

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
    if (
      this.parent.themes.find((theme) => theme.isEnabled).type != 'default theme'
    )
      this.nodeProps.appendChild(
        new Tag(
          '_theme',
          `Theme: ${this.parent.themes.find((theme) => theme.isEnabled).name}`,
          12
        ).makeNodeTag()
      )

    return this.nodeProps
  }

  makeNode = () => {
    // base
    this.node = figma.createFrame()
    this.node.name = '_title'
    this.node.fills = []

    // layout
    this.node.layoutMode = 'HORIZONTAL'
    this.node.primaryAxisSizingMode = 'FIXED'
    this.node.layoutAlign = 'STRETCH'
    this.node.counterAxisSizingMode = 'AUTO'

    // insert
    this.node.appendChild(this.makeNodeName())
    this.node.appendChild(this.makeNodeProps())

    return this.node
  }
}
