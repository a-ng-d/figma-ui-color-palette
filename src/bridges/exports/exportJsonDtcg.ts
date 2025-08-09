import { ColorSpaceConfiguration, Data } from '@a_ng_d/utils-ui-color-palette'
import { locales } from '../../content/locales'

const exportJsonDtcg = (id: string, colorSpace: ColorSpaceConfiguration) => {
  const rawPalette = figma.currentPage.getSharedPluginData(
    'uicp',
    `palette_${id}`
  )

  if (rawPalette === '')
    return figma.ui.postMessage({
      type: 'EXPORT_PALETTE_JSON',
      data: {
        context: 'TOKENS_DTCG',
        code: locales.get().error.export,
      },
    })

  return figma.ui.postMessage({
    type: 'EXPORT_PALETTE_JSON',
    data: {
      context: 'TOKENS_DTCG',
      colorSpace: colorSpace,
      code: new Data(JSON.parse(rawPalette)).makeDtcgTokens(colorSpace),
    },
  })
}

export default exportJsonDtcg
