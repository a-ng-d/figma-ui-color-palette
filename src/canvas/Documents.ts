import chroma from 'chroma-js'
import {
  BaseConfiguration,
  MetaConfiguration,
  PaletteData,
  PaletteDataThemeItem,
  ThemeConfiguration,
  ViewConfiguration,
} from '@a_ng_d/utils-ui-color-palette'
import setPaletteName from '../utils/setPaletteName'
import globalConfig from '../global.config'
import { locales } from '../content/locales'
import Sheet from './Sheet'
import Palette from './Palette'

export default class Documents {
  private base: BaseConfiguration
  private themes: Array<ThemeConfiguration>
  private data: PaletteData
  private meta: MetaConfiguration
  private view: ViewConfiguration
  documents: Array<FrameNode>

  constructor({
    base,
    themes,
    data,
    meta,
    view,
  }: {
    base: BaseConfiguration
    themes: Array<ThemeConfiguration>
    data: PaletteData
    meta: MetaConfiguration
    view: ViewConfiguration
  }) {
    this.base = base
    this.themes = themes
    this.data = data
    this.meta = meta
    this.view = view
    this.documents = this.makeDocuments()
  }

  makeDocuments = () => {
    let x = figma.viewport.center.x
    const y = figma.viewport.center.y
    const documents: Array<FrameNode> = []
    const workingThemesData =
      this.data.themes.filter((theme) => theme.type === 'custom theme')
        .length === 0
        ? this.data.themes.filter((theme) => theme.type === 'default theme')
        : this.data.themes.filter((theme) => theme.type === 'custom theme')
    const workingThemes =
      this.themes.filter((theme) => theme.type === 'custom theme').length === 0
        ? this.themes.filter((theme) => theme.type === 'default theme')
        : this.themes.filter((theme) => theme.type === 'custom theme')

    workingThemesData.forEach((theme, index) => {
      const document = this.makeDocument(workingThemes[index], theme)

      x = x + 32 + document.width
      document.x = x
      document.y = y

      documents.push(document)
    })

    return documents
  }

  makeDocument = (
    theme: ThemeConfiguration,
    data: PaletteDataThemeItem
  ): FrameNode => {
    // Base
    const document = figma.createFrame()
    document.name = setPaletteName(
      this.base.name,
      theme.name,
      this.base.preset.name,
      this.base.colorSpace,
      theme.visionSimulationMode
    )
    document.resize(1640, 100)
    document.cornerRadius = 16
    document.layoutMode = 'VERTICAL'
    document.layoutSizingHorizontal = 'HUG'
    document.layoutSizingVertical = 'HUG'
    document.horizontalPadding = document.verticalPadding = 32
    document.fills = [
      {
        type: 'SOLID',
        color: {
          r: chroma(theme.paletteBackground).get('rgb.r') / 255,
          g: chroma(theme.paletteBackground).get('rgb.g') / 255,
          b: chroma(theme.paletteBackground).get('rgb.b') / 255,
        },
      },
    ]

    // Data
    document.setSharedPluginData('uicp', 'type', 'UI_COLOR_PALETTE')
    document.setSharedPluginData(
      'uicp',
      'version',
      globalConfig.versions.paletteVersion
    )
    document.setSharedPluginData('uicp', 'view', this.view)
    document.setSharedPluginData('uicp', 'id', this.meta.id)
    document.setSharedPluginData('uicp', 'themeId', theme.id)
    document.setSharedPluginData('uicp', 'createdAt', new Date().toISOString())
    document.setSharedPluginData(
      'uicp',
      'updatedAt',
      this.meta.dates.updatedAt as string
    )
    document.setSharedPluginData(
      'uicp',
      'backup',
      JSON.stringify({
        base: this.base,
        themes: this.themes,
        meta: this.meta,
        version: globalConfig.versions.paletteVersion,
        type: 'UI_COLOR_PALETTE',
      })
    )

    document.setRelaunchData({
      edit: locales.get().relaunch.edit.description,
    })

    // Insert
    if (this.view === 'PALETTE' || this.view === 'PALETTE_WITH_PROPERTIES')
      document.appendChild(
        new Palette({
          base: this.base,
          theme: theme,
          data: data,
          meta: this.meta,
          view: this.view,
        }).node
      )
    else
      document.appendChild(
        new Sheet({
          base: this.base,
          theme: theme,
          data: data,
          meta: this.meta,
          view: this.view,
        }).node
      )

    return document
  }
}
