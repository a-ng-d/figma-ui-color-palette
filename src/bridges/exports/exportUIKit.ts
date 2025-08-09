import { Data } from '@a_ng_d/utils-ui-color-palette'
import { locales } from '../../content/locales'

const exportUIKit = (id: string) => {
  const rawPalette = figma.currentPage.getSharedPluginData(
    'uicp',
    `palette_${id}`
  )

  if (rawPalette === '')
    return figma.ui.postMessage({
      type: 'EXPORT_PALETTE_SWIFT',
      data: {
        context: 'APPLE_UIKIT',
        code: locales.get().error.export,
      },
    })

  return figma.ui.postMessage({
    type: 'EXPORT_PALETTE_SWIFT',
    data: {
      context: 'APPLE_UIKIT',
      code: new Data(JSON.parse(rawPalette)).makeUIKit(),
    },
  })
}

export default exportUIKit
