import { Data } from '@a_ng_d/utils-ui-color-palette'
import { locales } from '../../content/locales'

const exportXml = (id: string) => {
  const rawPalette = figma.currentPage.getSharedPluginData(
    'uicp',
    `palette_${id}`
  )

  if (rawPalette === '')
    return figma.ui.postMessage({
      type: 'EXPORT_PALETTE_XML',
      data: {
        context: 'ANDROID_XML',
        code: locales.get().error.export,
      },
    })

  return figma.ui.postMessage({
    type: 'EXPORT_PALETTE_XML',
    data: {
      context: 'ANDROID_XML',
      code: new Data(JSON.parse(rawPalette)).makeResources(),
    },
  })
}

export default exportXml
