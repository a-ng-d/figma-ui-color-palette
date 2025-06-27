import { Data, FullConfiguration } from '@a_ng_d/utils-ui-color-palette'
import { locales } from '../../content/locales'
import { SettingsMessage } from '../../types/messages'

const updateSettings = async (msg: SettingsMessage) => {
  const now = new Date().toISOString()
  const palette: FullConfiguration = JSON.parse(
    figma.currentPage.getPluginData(`palette_${msg.id}`) ?? '{}'
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
    ['style_id', 'collection_id', 'gl', 'variable_id', 'description'],
    palette.libraryData
  )

  palette.meta.dates.updatedAt = now
  figma.ui.postMessage({
    type: 'UPDATE_PALETTE_DATE',
    data: now,
  })

  await figma.saveVersionHistoryAsync(
    `${palette.base.name} - ${locales.get().events.settingsUpdated}`
  )

  return figma.currentPage.setPluginData(
    `palette_${msg.id}`,
    JSON.stringify(palette)
  )
}

export default updateSettings
