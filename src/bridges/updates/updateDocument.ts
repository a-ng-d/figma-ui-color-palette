import chroma from 'chroma-js'
import {
  Data,
  FullConfiguration,
  PaletteDataThemeItem,
  ThemeConfiguration,
  ViewConfiguration,
} from '@a_ng_d/utils-ui-color-palette'
import setPaletteName from '../../utils/setPaletteName'
import Sheet from '../../canvas/Sheet'
import Palette from '../../canvas/Palette'
import { tolgee } from '../..'

const updateDocument = async (view: ViewConfiguration) => {
  const document = figma.currentPage.selection[0] as FrameNode
  const id = document.getSharedPluginData('uicp', 'id')
  const themeId = document.getSharedPluginData('uicp', 'themeId')

  const rawPalette = figma.currentPage.getSharedPluginData(
    'uicp',
    `palette_${id}`
  )

  if (rawPalette === '') throw new Error(tolgee.t('error.unfoundPalette'))

  const palette = JSON.parse(rawPalette) as FullConfiguration

  const themeData = new Data(palette)
    .makePaletteData()
    .themes.find((theme: PaletteDataThemeItem) => theme.id === themeId)
  const currentTheme = palette.themes.find(
    (theme: ThemeConfiguration) => theme.id === themeId
  )

  if (themeData === undefined || currentTheme === undefined)
    throw new Error(tolgee.t('error.document'))

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
  document.name = setPaletteName(
    palette.base.name,
    currentTheme.name,
    palette.base.preset.name,
    palette.base.colorSpace,
    currentTheme.visionSimulationMode
  )

  // Update
  document.setSharedPluginData('uicp', 'view', view)
  document.setSharedPluginData(
    'uicp',
    'updatedAt',
    palette.meta.dates.updatedAt.toString()
  )
  document.setSharedPluginData('uicp', 'backup', JSON.stringify(palette))

  figma.ui.postMessage({
    type: 'DOCUMENT_SELECTED',
    data: {
      view: view,
      id: id,
      updatedAt: palette.meta.dates.updatedAt.toString(),
      isLinkedToPalette: true,
    },
  })

  await new Promise((r) => setTimeout(r, 1000))
  await figma.saveVersionHistoryAsync(
    `${palette.base.name} - ${tolgee.t('events.documentUpdated')}`
  )

  return palette
}

export default updateDocument
