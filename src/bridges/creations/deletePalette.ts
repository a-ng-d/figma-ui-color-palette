import { locales } from '../../content/locales'

const deletePalette = async (id: string) => {
  const rawPalette = figma.currentPage.getSharedPluginData(
    'uicp',
    `palette_${id}`
  )

  if (rawPalette === '') throw new Error(locales.get().error.unfoundPalette)

  const palette = JSON.parse(rawPalette)

  figma.currentPage.setSharedPluginData('uicp', `palette_${id}`, '')

  await new Promise((r) => setTimeout(r, 1000))
  await figma.saveVersionHistoryAsync(
    `${palette.base.name} - ${locales.get().events.paletteRemoved}`
  )

  return palette
}

export default deletePalette
