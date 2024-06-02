import { lang, locals } from '../content/locals'
import { PaletteNode } from '../types/nodes'
import Paragraph from './Paragraph'
import Tag from './Tag'

export default class Title {
  parent: PaletteNode
  nodeGlobalInfo: FrameNode | null
  nodeDescriptions: FrameNode | null
  nodeProps: FrameNode | null
  node: FrameNode | null

  constructor(parent: PaletteNode) {
    this.parent = parent
    this.nodeGlobalInfo = null
    this.nodeDescriptions = null
    this.nodeProps = null
    this.node = null
  }

  makeNodeGlobalInfo = () => {
    // Base
    this.nodeGlobalInfo = figma.createFrame()
    this.nodeGlobalInfo.name = '_palette-global'
    this.nodeGlobalInfo.fills = []

    // Layout
    this.nodeGlobalInfo.layoutMode = 'VERTICAL'
    this.nodeGlobalInfo.layoutSizingHorizontal = 'HUG'
    this.nodeGlobalInfo.layoutSizingVertical = 'HUG'
    this.nodeGlobalInfo.itemSpacing = 8

    // Insert
    this.nodeGlobalInfo.appendChild(
      new Tag(
        '_name',
        this.parent.name === '' ? locals[lang].name : this.parent.name,
        20
      ).makeNodeTag()
    )
    if (
      this.parent.description !== '' ||
      this.parent.themes.find((theme) => theme.isEnabled)?.description !== ''
    )
      this.nodeGlobalInfo.appendChild(this.makeNodeDescriptions())

    return this.nodeGlobalInfo
  }

  makeNodeDescriptions = () => {
    // Base
    this.nodeDescriptions = figma.createFrame()
    this.nodeDescriptions.name = '_palette-description(s)'
    this.nodeDescriptions.fills = []

    // Layout
    this.nodeDescriptions.layoutMode = 'HORIZONTAL'
    this.nodeDescriptions.layoutSizingHorizontal = 'HUG'
    this.nodeDescriptions.layoutSizingVertical = 'HUG'
    this.nodeDescriptions.itemSpacing = 8

    // Insert
    if (this.parent.description !== '')
      this.nodeDescriptions.appendChild(
        new Paragraph(
          '_palette-description',
          this.parent.description,
          'FIXED',
          644,
          12
        ).makeNode()
      )

    if (this.parent.themes.find((theme) => theme.isEnabled)?.description !== '')
      this.nodeDescriptions.appendChild(
        new Paragraph(
          '_theme-description',
          'Theme description: ' +
            this.parent.themes.find((theme) => theme.isEnabled)?.description,
          'FIXED',
          644,
          12
        ).makeNode()
      )

    return this.nodeDescriptions
  }

  makeNodeProps = () => {
    // Base
    this.nodeProps = figma.createFrame()
    this.nodeProps.name = '_palette-props'
    this.nodeProps.fills = []

    // Layout
    this.nodeProps.layoutMode = 'VERTICAL'
    this.nodeProps.layoutSizingHorizontal = 'HUG'
    this.nodeProps.layoutSizingVertical = 'HUG'
    this.nodeProps.counterAxisAlignItems = 'MAX'
    this.nodeProps.itemSpacing = 8

    // Insert
    if (
      this.parent.creatorFullName !== undefined &&
      this.parent.creatorFullName !== ''
    )
      this.nodeProps.appendChild(
        new Tag(
          '_creator_id',
          `${locals[lang].paletteProperties.provider}${this.parent.creatorFullName}`,
          12
        ).makeNodeTagWithAvatar(this.parent.creatorAvatarImg)
      )

    if (
      this.parent.themes.find((theme) => theme.isEnabled)?.type !==
      'default theme'
    )
      this.nodeProps.appendChild(
        new Tag(
          '_theme',
          `${locals[lang].paletteProperties.theme}${
            this.parent.themes.find((theme) => theme.isEnabled)?.name
          }`,
          12
        ).makeNodeTag()
      )
    this.nodeProps.appendChild(
      new Tag(
        '_preset',
        `${locals[lang].paletteProperties.preset}${this.parent.preset.name}`,
        12
      ).makeNodeTag()
    )
    this.nodeProps.appendChild(
      new Tag(
        '_color-space',
        `${locals[lang].paletteProperties.colorSpace}${this.parent.colorSpace}`,
        12
      ).makeNodeTag()
    )
    if (this.parent.visionSimulationMode !== 'NONE')
      this.nodeProps.appendChild(
        new Tag(
          '_vision-simulation',
          `${locals[lang].paletteProperties.visionSimulation}${
            this.parent.visionSimulationMode.charAt(0) +
            this.parent.visionSimulationMode.toLocaleLowerCase().slice(1)
          }`,
          12
        ).makeNodeTag()
      )

    return this.nodeProps
  }

  makeNode = () => {
    // Base
    this.node = figma.createFrame()
    this.node.name = '_title'
    this.node.fills = []

    // Layout
    this.node.layoutMode = 'HORIZONTAL'
    this.node.primaryAxisSizingMode = 'FIXED'
    this.node.layoutAlign = 'STRETCH'
    this.node.counterAxisSizingMode = 'AUTO'
    this.node.primaryAxisAlignItems = 'SPACE_BETWEEN'

    // Insert
    this.node.appendChild(this.makeNodeGlobalInfo())
    this.node.appendChild(this.makeNodeProps())

    return this.node
  }
}
