import { tolgee } from '../..'

const jumpToPalette = async (id: string) => {
  const rawPalette = figma.currentPage.getSharedPluginData(
    'uicp',
    `palette_${id}`
  )

  if (rawPalette === '') throw new Error(tolgee.t('error.fetchPalette'))

  const palette = JSON.parse(rawPalette)
  palette.meta.dates.openedAt = new Date().toISOString()
  figma.currentPage.setSharedPluginData(
    'uicp',
    `palette_${id}`,
    JSON.stringify(palette)
  )

  return figma.ui.postMessage({
    type: 'LOAD_PALETTE',
    data: palette,
  })
}

export default jumpToPalette
