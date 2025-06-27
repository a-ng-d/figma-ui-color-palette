import { Data, FullConfiguration } from '@a_ng_d/utils-ui-color-palette'
import { ThemesMessage } from '../../types/messages'
import { locales } from '../../content/locales'

const updateThemes = async (msg: ThemesMessage) => {
  const now = new Date().toISOString()
  const palette: FullConfiguration = JSON.parse(
    figma.currentPage.getPluginData(`palette_${msg.id}`) ?? '{}'
  )

  palette.themes = msg.data

  palette.libraryData = new Data(palette).makeLibraryData(
    ['style_id', 'collection_id', 'gl', 'variable_id', 'description'],
    palette.libraryData
  )

  palette.meta.dates.updatedAt = now
  figma.ui.postMessage({
    type: 'UPDATE_PALETTE_DATE',
    data: now,
  })

  await figma.saveVersionHistoryAsync(
    `${palette.base.name} - ${locales.get().events.themesUpdated}`
  )

  return figma.currentPage.setPluginData(
    `palette_${msg.id}`,
    JSON.stringify(palette)
  )
}

export default updateThemes
