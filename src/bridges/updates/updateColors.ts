import { Data, FullConfiguration } from '@a_ng_d/utils-ui-color-palette'
import { getJsonSize } from '../../utils/getSize'
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
    ['style_id', 'collection_id', 'variable_id', 'mode_id'],
    palette.libraryData
  )

  if (getJsonSize(palette) < 100) {
    figma.currentPage.setPluginData(
      `palette_${msg.id}`,
      JSON.stringify(palette)
    )

    await new Promise((r) => setTimeout(r, 1000))
    await figma.saveVersionHistoryAsync(
      `${palette.base.name} - ${locales.get().events.colorsUpdated}`
    )

    return palette
  } else throw new Error(locales.get().error.paletteSizeExceeded)
}

export default updateColors
