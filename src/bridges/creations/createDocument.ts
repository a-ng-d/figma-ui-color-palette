import {
  Data,
  FullConfiguration,
  ViewConfiguration,
} from '@yelbolt/engine-ui-color-palette'
import { makeDocumentPairs } from '../../utils/usage'
import scheduleSaveVersion from '../../utils/scheduleSaveVersion'
import Documents from '../../canvas/Documents'
import { tolgee } from '../..'

const createDocument = async (id: string, view: ViewConfiguration) => {
  const rawPalette = figma.currentPage.getSharedPluginData(
    'uicp',
    `palette_${id}`
  )

  if (rawPalette === '') throw new Error(tolgee.t('error.unfoundPalette'))

  const palette = JSON.parse(rawPalette) as FullConfiguration

  const data = new Data(palette).makePaletteData()
  const documents = new Documents({
    base: palette.base,
    themes: palette.themes,
    data,
    meta: palette.meta,
    view: view,
  })

  figma.currentPage.selection = documents.documents
  figma.viewport.scrollAndZoomIntoView(figma.currentPage.selection)

  scheduleSaveVersion(
    `${palette.base.name} - ${tolgee.t('events.documentCreated')}`
  )

  return { palette, pairs: makeDocumentPairs(data.themes) }
}

export default createDocument
