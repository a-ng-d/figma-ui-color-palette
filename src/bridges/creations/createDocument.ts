import {
  Data,
  FullConfiguration,
  ViewConfiguration,
} from '@a_ng_d/utils-ui-color-palette'
import Documents from '../../canvas/Documents'
import { locales } from '../../content/locales'

const createDocument = async (id: string, view: ViewConfiguration) => {
  const rawPalette = figma.currentPage.getPluginData(`palette_${id}`)

  if (rawPalette === undefined || rawPalette === null)
    throw new Error(locales.get().error.unfoundPalette)

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

  figma.saveVersionHistoryAsync(
    `${palette.base.name} - ${locales.get().events.documentCreated}`
  )

  return true
}

export default createDocument
