import { Data } from '@a_ng_d/utils-ui-color-palette'
import { locales } from '../../content/locales'

const exportKt = (id: string) => {
  const rawPalette = figma.currentPage.getSharedPluginData(
    'uicp',
    `palette_${id}`
  )

  if (rawPalette === '')
    return figma.ui.postMessage({
      type: 'EXPORT_PALETTE_KT',
      data: {
        context: 'ANDROID_COMPOSE',
        code: locales.get().error.export,
      },
    })

  return figma.ui.postMessage({
    type: 'EXPORT_PALETTE_KT',
    data: {
      context: 'ANDROID_COMPOSE',
      code: new Data(JSON.parse(rawPalette)).makeCompose(),
    },
  })
}

export default exportKt
