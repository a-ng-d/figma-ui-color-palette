import processSelection from '../gets/processSelection'
import { tolgee } from '../..'

const deletePalette = async (id: string) => {
  const rawPalette = figma.currentPage.getSharedPluginData(
    'uicp',
    `palette_${id}`
  )

  if (rawPalette === '') throw new Error(tolgee.t('error.unfoundPalette'))

  const palette = JSON.parse(rawPalette)

  figma.currentPage.setSharedPluginData('uicp', `palette_${id}`, '')
  processSelection()

  await new Promise((r) => setTimeout(r, 1000))
  await figma.saveVersionHistoryAsync(
    `${palette.base.name} - ${tolgee.t('events.paletteRemoved')}`
  )

  return palette
}

export default deletePalette
