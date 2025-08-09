import { ColorSpaceConfiguration, Data } from '@a_ng_d/utils-ui-color-palette'
import { locales } from '../../content/locales'

const exportLess = (id: string, colorSpace: ColorSpaceConfiguration) => {
  const rawPalette = figma.currentPage.getSharedPluginData(
    'uicp',
    `palette_${id}`
  )

  if (rawPalette === '')
    return figma.ui.postMessage({
      type: 'EXPORT_PALETTE_LESS',
      data: {
        context: 'STYLESHEET_LESS',
        colorSpace: colorSpace,
        code: locales.get().error.export,
      },
    })

  return figma.ui.postMessage({
    type: 'EXPORT_PALETTE_LESS',
    data: {
      context: 'STYLESHEET_LESS',
      colorSpace: colorSpace,
      code: new Data(JSON.parse(rawPalette)).makeLessVariables(colorSpace),
    },
  })
}

export default exportLess
