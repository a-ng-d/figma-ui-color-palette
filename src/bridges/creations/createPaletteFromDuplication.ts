import { uid } from 'uid'
import { FullConfiguration } from '@a_ng_d/utils-ui-color-palette'
import { tolgee } from '../..'

const createPaletteFromDuplication = async (id: string) => {
  const rawPalette = figma.currentPage.getSharedPluginData(
    'uicp',
    `palette_${id}`
  )
  const now = new Date().toISOString()

  if (rawPalette === '') throw new Error(tolgee.t('error.unfoundPalette'))

  const palette = JSON.parse(rawPalette) as FullConfiguration

  const name: string =
    palette.base.name === '' ? tolgee.t('name') : palette.base.name

  palette.base.name = tolgee.t('browse.copy', {
    name: name,
  })
  delete (palette as Partial<FullConfiguration>).libraryData
  palette.meta.id = uid()
  palette.meta.publicationStatus.isPublished = false
  palette.meta.publicationStatus.isShared = false
  palette.meta.dates.updatedAt = now
  palette.meta.dates.createdAt = now
  palette.meta.dates.publishedAt = ''
  palette.meta.dates.openedAt = now
  palette.meta.creatorIdentity.creatorId = ''
  palette.meta.creatorIdentity.creatorFullName = ''
  palette.meta.creatorIdentity.creatorAvatar = ''

  figma.currentPage.setSharedPluginData(
    'uicp',
    `palette_${palette.meta.id}`,
    JSON.stringify(palette)
  )

  await new Promise((r) => setTimeout(r, 1000))
  await figma.saveVersionHistoryAsync(
    `${palette.base.name} - ${tolgee.t('events.paletteDuplicated')}`
  )

  return palette
}

export default createPaletteFromDuplication
