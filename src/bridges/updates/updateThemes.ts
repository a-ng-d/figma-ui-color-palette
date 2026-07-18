import { Data, FullConfiguration } from '@yelbolt/engine-ui-color-palette'
import scheduleSaveVersion from '../../utils/scheduleSaveVersion'
import { getJsonSize } from '../../utils/getSize'
import { ThemesMessage } from '../../types/messages'
import { tolgee } from '../..'

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

    scheduleSaveVersion(
      `${palette.base.name} - ${tolgee.t('events.themesUpdated')}`
    )

    return palette
  } else throw new Error(tolgee.t('error.paletteSizeExceeded'))
}

export default updateThemes
