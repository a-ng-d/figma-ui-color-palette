import { FullConfiguration } from '@yelbolt/engine-ui-color-palette'
import processSelection from '../gets/processSelection'
import { tolgee } from '../..'

const createPaletteFromDocument = async () => {
  const document = figma.currentPage.selection[0]
  const rawPalette = document.getSharedPluginData('uicp', 'backup')

  if (rawPalette === '') throw new Error(tolgee.t('error.unfoundPalette'))
  const backup = JSON.parse(rawPalette) as FullConfiguration

  figma.currentPage.setSharedPluginData(
    'uicp',
    `palette_${backup.meta.id}`,
    JSON.stringify(backup)
  )
  figma.ui.postMessage({
    type: 'LOAD_PALETTE',
    data: backup,
  })
  processSelection()

  await new Promise((r) => setTimeout(r, 1000))
  await figma.saveVersionHistoryAsync(
    `${backup.base.name} - ${tolgee.t('events.paletteCreatedFromDocument')}`
  )

  return backup
}

export default createPaletteFromDocument
