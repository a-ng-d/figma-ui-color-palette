import { FullConfiguration, PaletteData } from '@a_ng_d/utils-ui-color-palette'

const getPalettesOnCurrentPage = async () => {
  const dataKeys = figma.currentPage.getSharedPluginDataKeys('uicp')
  if (dataKeys === undefined)
    return figma.ui.postMessage({
      type: 'EXPOSE_PALETTES',
      data: [],
    })

  const dataList = dataKeys
    .filter((data: string) => data.includes('palette_'))
    .map((key: string) => {
      const data = figma.currentPage.getSharedPluginData('uicp', key)
      return data ? JSON.parse(data) : undefined
    })
  const palettesList: Array<PaletteData> = dataList.filter(
    (data: FullConfiguration) => {
      if (data !== undefined) return data.type === 'UI_COLOR_PALETTE'
    }
  )

  return figma.ui.postMessage({
    type: 'EXPOSE_PALETTES',
    data: palettesList,
  })
}

export default getPalettesOnCurrentPage
