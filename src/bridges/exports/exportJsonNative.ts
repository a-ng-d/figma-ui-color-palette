import { Data } from '@a_ng_d/utils-ui-color-palette'
import { locales } from '../../content/locales'

const exportJsonNative = (id: string) => {
  const rawPalette = figma.currentPage.getSharedPluginData(
    'uicp',
    `palette_${id}`
  )

  if (rawPalette === '')
    return figma.ui.postMessage({
      type: 'EXPORT_PALETTE_JSON',
      data: {
        context: 'TOKENS_NATIVE',
        code: locales.get().error.export,
      },
    })

  return figma.ui.postMessage({
    type: 'EXPORT_PALETTE_JSON',
    data: {
      context: 'TOKENS_NATIVE',
      code: new Data(JSON.parse(rawPalette)).makeNativeTokens(),
    },
  })
}

export default exportJsonNative
