import { uid } from 'uid'
import { FullConfiguration } from '@a_ng_d/utils-ui-color-palette'
import processSelection from '../processSelection'
import { locales } from '../../content/locales'

const createPaletteFromDocument = async () => {
  const document = figma.currentPage.selection[0]
  const backup = JSON.parse(
    document.getSharedPluginData('uicp', 'backup')
  ) as FullConfiguration

  const now = new Date().toISOString()
  delete (backup as Partial<FullConfiguration>).libraryData
  backup.meta.id = uid()
  backup.meta.dates.openedAt = now
  backup.meta.dates.createdAt = now
  backup.meta.dates.updatedAt = now
  backup.meta.publicationStatus.isPublished = false
  backup.meta.publicationStatus.isShared = false
  backup.meta.creatorIdentity.creatorId = ''
  backup.meta.creatorIdentity.creatorFullName = ''
  backup.meta.creatorIdentity.creatorAvatar = ''

  document.setSharedPluginData('uicp', 'id', backup.meta.id)
  document.setSharedPluginData('uicp', 'createdAt', now)
  document.setSharedPluginData('uicp', 'updatedAt', now)

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
