import { Data, FullConfiguration } from '@a_ng_d/utils-ui-color-palette'
import { ColorsMessage } from '../../types/messages'
import { locales } from '../../content/locales'

const updateColors = async (msg: ColorsMessage) => {
  const now = new Date().toISOString()
  const palette: FullConfiguration = JSON.parse(
    figma.currentPage.getPluginData(`palette_${msg.id}`) ?? '{}'
  )

  palette.base.colors = msg.data

  palette.meta.dates.updatedAt = now
  figma.ui.postMessage({
    type: 'UPDATE_PALETTE_DATE',
    data: now,
  })

  palette.libraryData = new Data(palette).makeLibraryData(
    [
      'style_id',
      'collection_id',
      'gl',
      'variable_id',
      'mode_id',
      'description',
    ],
    palette.libraryData
  )

  await figma.saveVersionHistoryAsync(
    `${palette.base.name} - ${locales.get().events.colorsUpdated}`
  )

  return figma.currentPage.setPluginData(
    `palette_${msg.id}`,
    JSON.stringify(palette)
  )
}

export default updateColors
