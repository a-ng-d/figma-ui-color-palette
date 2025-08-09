import { Data } from '@a_ng_d/utils-ui-color-palette'
import { locales } from '../../content/locales'

const exportJsonStyleDictionaryV3 = (id: string) => {
  const rawPalette = figma.currentPage.getSharedPluginData(
    'uicp',
    `palette_${id}`
  )

  if (rawPalette === '')
    return figma.ui.postMessage({
      type: 'EXPORT_PALETTE_JSON',
      data: {
        context: 'TOKENS_STYLE_DICTIONARY_V3',
        code: locales.get().error.export,
      },
    })

  return figma.ui.postMessage({
    type: 'EXPORT_PALETTE_JSON',
    data: {
      context: 'TOKENS_STYLE_DICTIONARY_V3',
      code: new Data(JSON.parse(rawPalette)).makeStyleDictionaryV3Tokens(),
    },
  })
}

export default exportJsonStyleDictionaryV3
