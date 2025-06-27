import { locales } from '../../content/locales'

const deletePalette = async (id: string) => {
  const rawPalette = figma.currentPage.getPluginData(`palette_${id}`)

  if (rawPalette === undefined)
    throw new Error(locales.get().error.unfoundPalette)

  const palette = JSON.parse(rawPalette)

  await figma.saveVersionHistoryAsync(
    `${palette.base.name} - ${locales.get().events.paletteRemoved}`
  )

  return figma.currentPage.setPluginData(`palette_${id}`, '')
}

export default deletePalette
