import { locales } from '@ui-lib/content/locales'
import { Data, FullConfiguration } from '@a_ng_d/utils-ui-color-palette'
import { getJsonSize } from '../../utils/getSize'
import { ThemesMessage } from '../../types/messages'

const updateThemes = async (msg: ThemesMessage) => {
  const now = new Date().toISOString()
  const palette: FullConfiguration = JSON.parse(
    figma.currentPage.getSharedPluginData('uicp', `palette_${msg.id}`) ?? '{}'
  )

  palette.themes = msg.data

  palette.libraryData = new Data(palette).makeLibraryData(
    ['style_id', 'collection_id', 'variable_id', 'mode_id'],
    palette.libraryData
  )

  palette.meta.dates.updatedAt = now
  figma.ui.postMessage({
    type: 'UPDATE_PALETTE_DATE',
    data: now,
  })

  if (getJsonSize(palette) < 100) {
    figma.currentPage.setSharedPluginData(
      'uicp',
      `palette_${msg.id}`,
      JSON.stringify(palette)
    )

    await new Promise((r) => setTimeout(r, 1000))
    await figma.saveVersionHistoryAsync(
      `${palette.base.name} - ${locales.get().events.themesUpdated}`
    )

    return palette
  } else throw new Error(locales.get().error.paletteSizeExceeded)
}

export default updateThemes
