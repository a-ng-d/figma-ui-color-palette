import chroma from 'chroma-js'
import {
  Data,
  FullConfiguration,
  PaletteDataThemeItem,
  ThemeConfiguration,
  ViewConfiguration,
} from '@a_ng_d/utils-ui-color-palette'
import { locales } from '../../content/locales'
import Sheet from '../../canvas/Sheet'
import Palette from '../../canvas/Palette'

const updateDocument = async (view: ViewConfiguration) => {
  const document = figma.currentPage.selection[0] as FrameNode
  const id = document.getPluginData('id')
  const themeId = document.getPluginData('themeId')

  const rawPalette = figma.currentPage.getPluginData(`palette_${id}`)

  if (rawPalette === '') throw new Error(locales.get().error.unfoundPalette)

  const palette = JSON.parse(rawPalette) as FullConfiguration

  const themeData = new Data(palette)
    .makePaletteData()
    .themes.find((theme: PaletteDataThemeItem) => theme.id === themeId)
  const currentTheme = palette.themes.find(
    (theme: ThemeConfiguration) => theme.id === themeId
  )

  if (themeData === undefined || currentTheme === undefined)
    throw new Error(locales.get().error.document)

  const newDocument =
    view === 'PALETTE_WITH_PROPERTIES' || view === 'PALETTE'
      ? new Palette({
          base: palette.base,
          theme: currentTheme,
          data: themeData,
          meta: palette.meta,
          view: view,
        }).node
      : new Sheet({
          base: palette.base,
          theme: currentTheme,
          data: themeData,
          meta: palette.meta,
          view: view,
        }).node

  document.children[0].remove()
  document.appendChild(newDocument)
  document.fills = [
    {
      type: 'SOLID',
      color: {
        r: chroma(currentTheme.paletteBackground).get('rgb.r') / 255,
        g: chroma(currentTheme.paletteBackground).get('rgb.g') / 255,
        b: chroma(currentTheme.paletteBackground).get('rgb.b') / 255,
      },
    },
  ]

  // Update
  document.setPluginData('view', view)
  document.setPluginData('updatedAt', palette.meta.dates.updatedAt.toString())
  document.setPluginData('backup', JSON.stringify(palette))

  figma.saveVersionHistoryAsync(
    `${palette.base.name} - ${locales.get().events.documentUpdated}`
  )

  return true
}

export default updateDocument
