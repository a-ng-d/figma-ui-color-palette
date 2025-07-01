import { Data, FullConfiguration } from '@a_ng_d/utils-ui-color-palette'
import { doScale } from '@a_ng_d/figmug-utils'
import { getJsonSize } from '../../utils/getSize'
import { ScaleMessage } from '../../types/messages'
import { locales } from '../../content/locales'

const updateScale = async (msg: ScaleMessage) => {
  const now = new Date().toISOString()
  const palette: FullConfiguration = JSON.parse(
    figma.currentPage.getPluginData(`palette_${msg.data.id}`) ?? '{}'
  )

  const theme = palette.themes.find((theme) => theme.isEnabled)
  if (theme !== undefined) theme.scale = msg.data.scale

  if (msg.feature === 'ADD_STOP' || msg.feature === 'DELETE_STOP')
    palette.themes.forEach((theme) => {
      if (!theme.isEnabled)
        theme.scale = doScale(
          Object.keys(msg.data.scale).map((stop) => {
            return parseFloat(stop)
          }),
          theme.scale[
            Object.keys(theme.scale)[Object.keys(theme.scale).length - 1]
          ],
          theme.scale[Object.keys(theme.scale)[0]]
        )
    })

  palette.base.preset = msg.data.preset
  palette.base.shift = msg.data.shift
  palette.base.preset = msg.data.preset

  palette.libraryData = new Data(palette).makeLibraryData(
    ['style_id', 'collection_id', 'variable_id', 'mode_id'],
    palette.libraryData
  )

  palette.meta.dates.updatedAt = now
  figma.ui.postMessage({
    type: 'UPDATE_PALETTE_DATE',
    data: now,
  })

  await figma.saveVersionHistoryAsync(
    `${palette.base.name} - ${locales.get().events.scaleUpdated}`
  )

  if (getJsonSize(palette) < 100)
    return figma.currentPage.setPluginData(
      `palette_${msg.id}`,
      JSON.stringify(palette)
    )
  else throw new Error(locales.get().error.paletteSizeExceeded)
}

export default updateScale
