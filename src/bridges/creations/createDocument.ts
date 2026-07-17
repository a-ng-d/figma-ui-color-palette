import {
  Data,
  FullConfiguration,
  ViewConfiguration,
} from '@yelbolt/engine-ui-color-palette'
import Documents from '../../canvas/Documents'
import { tolgee } from '../..'

const createDocument = async (id: string, view: ViewConfiguration) => {
  const rawPalette = figma.currentPage.getSharedPluginData(
    'uicp',
    `palette_${id}`
  )

  if (rawPalette === '') throw new Error(tolgee.t('error.unfoundPalette'))

  const palette = JSON.parse(rawPalette) as FullConfiguration

  const documents = new Documents({
    base: palette.base,
    themes: palette.themes,
    data: new Data(palette).makePaletteData(),
    meta: palette.meta,
    view: view,
  })

  figma.currentPage.selection = documents.documents
  figma.viewport.scrollAndZoomIntoView(figma.currentPage.selection)

  await new Promise((r) => setTimeout(r, 1000))
  await figma.saveVersionHistoryAsync(
    `${palette.base.name} - ${tolgee.t('events.documentCreated')}`
  )

  return palette
}

export default createDocument
