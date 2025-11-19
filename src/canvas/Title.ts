import { locales } from '@ui-lib/content/locales'
import {
  BaseConfiguration,
  MetaConfiguration,
  PaletteDataThemeItem,
  ThemeConfiguration,
} from '@a_ng_d/utils-ui-color-palette'
import Tag from './Tag'
import Paragraph from './Paragraph'

export default class Title {
  private base: BaseConfiguration
  private theme: ThemeConfiguration
  private data: PaletteDataThemeItem
  private meta: MetaConfiguration
  private nodeGlobalInfo: FrameNode | null
  private nodeDescriptions: FrameNode | null
  private nodeProps: FrameNode | null
  node: FrameNode

  constructor({
    base,
    theme,
    data,
    meta,
  }: {
    base: BaseConfiguration
    theme: ThemeConfiguration
    data: PaletteDataThemeItem
    meta: MetaConfiguration
  }) {
    this.base = base
    this.theme = theme
    this.data = data
    this.meta = meta
    this.nodeGlobalInfo = null
    this.nodeDescriptions = null
    this.nodeProps = null
    this.node = this.makeNode()
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
      new Tag({
        name: '_name',
        content: this.base.name === '' ? locales.get().name : this.base.name,
        fontSize: 20,
      }).makeNodeTag()
    )
    if (this.base.description !== '' || this.theme.description !== '')
      this.nodeGlobalInfo.appendChild(this.makeNodeDescriptions())

    return this.nodeGlobalInfo
  }

  makeNodeDescriptions = () => {
    // Base
    this.nodeDescriptions = figma.createFrame()
    this.nodeDescriptions.name = '_palette-description(s)'
    this.nodeDescriptions.fills = []

    // Layout
    this.nodeDescriptions.layoutMode = 'VERTICAL'
    this.nodeDescriptions.layoutSizingHorizontal = 'HUG'
    this.nodeDescriptions.layoutSizingVertical = 'HUG'
    this.nodeDescriptions.itemSpacing = 8

    // Insert
    if (this.base.description !== '')
      this.nodeDescriptions.appendChild(
        new Paragraph({
          name: '_palette-description',
          content: this.base.description,
          type: 'FIXED',
          width: 644,
          fontSize: 12,
          fontFamily: 'Lexend',
        }).node
      )

    if (this.theme.description !== '')
      this.nodeDescriptions.appendChild(
        new Paragraph({
          name: '_theme-description',
          content: locales
            .get()
            .paletteProperties.themeDescription.replace(
              '{description}',
              this.theme.description
            ),
          type: 'FIXED',
          width: 644,
          fontSize: 12,
          fontFamily: 'Lexend',
        }).node
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
      this.meta.publicationStatus.isPublished &&
      this.meta.creatorIdentity.creatorAvatar !== ''
    )
      figma
        .createImageAsync(this.meta.creatorIdentity.creatorAvatar)
        .then(async (image: Image) =>
          this.nodeProps?.insertChild(
            0,
            new Tag({
              name: '_provider',
              content: locales
                .get()
                .paletteProperties.provider.replace(
                  '{name}',
                  this.meta.creatorIdentity.creatorFullName
                ),
              fontSize: 12,
            }).makeNodeTagWithAvatar(image)
          )
        )
    if (this.data.type !== 'default theme')
      this.nodeProps.appendChild(
        new Tag({
          name: '_theme',
          content: locales
            .get()
            .paletteProperties.theme.replace('{name}', this.data.name),
          fontSize: 12,
        }).makeNodeTag()
      )
    this.nodeProps.appendChild(
      new Tag({
        name: '_preset',
        content: locales
          .get()
          .paletteProperties.preset.replace('{name}', this.base.preset.name),
        fontSize: 12,
      }).makeNodeTag()
    )
    this.nodeProps.appendChild(
      new Tag({
        name: '_color-space',
        content: locales
          .get()
          .paletteProperties.colorSpace.replace('{name}', this.base.colorSpace),
        fontSize: 12,
      }).makeNodeTag()
    )
    if (this.base.visionSimulationMode !== 'NONE')
      this.nodeProps.appendChild(
        new Tag({
          name: '_vision-simulation',
          content: locales
            .get()
            .paletteProperties.visionSimulation.replace(
              '{mode}',
              this.theme.visionSimulationMode.charAt(0) +
                this.theme.visionSimulationMode.toLocaleLowerCase().slice(1)
            ),
          fontSize: 12,
        }).makeNodeTag()
      )
    this.nodeProps.appendChild(
      new Tag({
        name: '_updated_at',
        content: locales.get().paletteProperties.updatedAt.replace(
          '{date}',
          new Date(this.meta.dates.updatedAt).toLocaleDateString(
            locales.lang(),
            {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }
          )
        ),
        fontSize: 12,
      }).makeNodeTag()
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
