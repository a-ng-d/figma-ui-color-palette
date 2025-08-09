import { Data } from '@a_ng_d/utils-ui-color-palette'
import { locales } from '../../content/locales'

const exportJson = (id: string) => {
  const rawPalette = figma.currentPage.getSharedPluginData(
    'uicp',
    `palette_${id}`
  )

  if (rawPalette === '')
    return figma.ui.postMessage({
      type: 'EXPORT_PALETTE_JSON',
      data: {
        context: 'TOKENS_UNIVERSAL',
        code: locales.get().error.export,
      },
    })

  return figma.ui.postMessage({
    type: 'EXPORT_PALETTE_JSON',
    data: {
      context: 'TOKENS_UNIVERSAL',
      code: new Data(JSON.parse(rawPalette)).makeUniversalJson(),
    },
  })
}

export default exportJson
