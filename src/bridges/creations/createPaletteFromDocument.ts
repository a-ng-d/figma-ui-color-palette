import { FullConfiguration } from '@a_ng_d/utils-ui-color-palette'
import processSelection from '../processSelection'
import { locales } from '../../content/locales'

const createPaletteFromDocument = async () => {
  const document = figma.currentPage.selection[0]
  const backup = JSON.parse(
    document.getSharedPluginData('uicp', 'backup')
  ) as FullConfiguration

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
    `${backup.base.name} - ${locales.get().events.paletteCreatedFromDocument}`
  )

  return backup
}

export default createPaletteFromDocument
