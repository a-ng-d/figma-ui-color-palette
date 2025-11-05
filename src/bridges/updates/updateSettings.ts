import { locales } from '@ui-lib/content/locales'
import { Data, FullConfiguration } from '@a_ng_d/utils-ui-color-palette'
import { getJsonSize } from '../../utils/getSize'
import { SettingsMessage } from '../../types/messages'

const updateSettings = async (msg: SettingsMessage) => {
  const now = new Date().toISOString()
  const palette: FullConfiguration = JSON.parse(
    figma.currentPage.getSharedPluginData('uicp', `palette_${msg.id}`) ?? '{}'
  )

  const theme = palette.themes.find((theme) => theme.isEnabled)
  if (theme !== undefined) {
    theme.visionSimulationMode = msg.data.visionSimulationMode
    theme.textColorsTheme = msg.data.textColorsTheme
  }

  palette.base.name = msg.data.name
  palette.base.description = msg.data.description
  palette.base.colorSpace = msg.data.colorSpace
  palette.base.algorithmVersion = msg.data.algorithmVersion

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
      `${palette.base.name} - ${locales.get().events.settingsUpdated}`
    )

    return palette
  } else throw new Error(locales.get().error.paletteSizeExceeded)
}

export default updateSettings
