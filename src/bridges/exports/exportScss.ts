import { ColorSpaceConfiguration, Data } from '@a_ng_d/utils-ui-color-palette'
import { locales } from '../../content/locales'

const exportScss = (id: string, colorSpace: ColorSpaceConfiguration) => {
  const rawPalette = figma.currentPage.getSharedPluginData(
    'uicp',
    `palette_${id}`
  )

  if (rawPalette === '')
    return figma.ui.postMessage({
      type: 'EXPORT_PALETTE_SCSS',
      data: {
        context: 'STYLESHEET_SCSS',
        colorSpace: colorSpace,
        code: locales.get().error.export,
      },
    })

  return figma.ui.postMessage({
    type: 'EXPORT_PALETTE_SCSS',
    data: {
      context: 'STYLESHEET_SCSS',
      colorSpace: colorSpace,
      code: new Data(JSON.parse(rawPalette)).makeScssVariables(colorSpace),
    },
  })
}

export default exportScss
