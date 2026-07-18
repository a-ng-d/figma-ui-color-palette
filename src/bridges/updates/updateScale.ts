import { Data, FullConfiguration } from '@yelbolt/engine-ui-color-palette'
import { doScale } from '@unoff/utils'
import scheduleSaveVersion from '../../utils/scheduleSaveVersion'
import { getJsonSize } from '../../utils/getSize'
import { ScaleMessage } from '../../types/messages'
import { tolgee } from '../..'

const updateScale = async (msg: ScaleMessage) => {
  const now = new Date().toISOString()
  const palette: FullConfiguration = JSON.parse(
    figma.currentPage.getSharedPluginData('uicp', `palette_${msg.data.id}`) ??
      '{}'
  )

  const theme = palette.themes.find((theme) => theme.isEnabled)
  if (theme !== undefined) theme.scale = msg.data.scale

  if (msg.feature === 'ADD_STOP' || msg.feature === 'DELETE_STOP')
    palette.themes
      .filter((theme) => !theme.isEnabled)
      .forEach((theme) => {
        const currentScaleArray = Object.entries(theme.scale)

        const isInverted = currentScaleArray.every((val, index, arr) => {
          if (index === 0) return true
          return (
            parseFloat(val[1].toString()) <
            parseFloat(arr[index - 1][1].toString())
          )
        })

        const scaleValues = Object.values(theme.scale)
        const scaleMin = !isInverted
          ? Math.max(...scaleValues)
          : Math.min(...scaleValues)
        const scaleMax = !isInverted
          ? Math.min(...scaleValues)
          : Math.max(...scaleValues)

        theme.scale = doScale(
          Object.keys(msg.data.scale).map((stop) => parseFloat(stop)),
          scaleMin,
          scaleMax
        )

        if (!isInverted) {
          const newScaleArray = Object.entries(theme.scale)
          theme.scale = Object.fromEntries(newScaleArray.reverse())
        }
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

  figma.ui.postMessage({
    type: 'LOAD_PALETTE',
    data: palette,
  })

  if (getJsonSize(palette) < 100) {
    figma.currentPage.setSharedPluginData(
      'uicp',
      `palette_${msg.id}`,
      JSON.stringify(palette)
    )

    scheduleSaveVersion(
      `${palette.base.name} - ${tolgee.t('events.scaleUpdated')}`
    )

    return palette
  } else throw new Error(tolgee.t('error.paletteSizeExceeded'))
}

export default updateScale
