import { Data } from '@a_ng_d/utils-ui-color-palette'
import { locales } from '../../content/locales'

const exportTailwindV4 = (id: string) => {
  const rawPalette = figma.currentPage.getSharedPluginData(
    'uicp',
    `palette_${id}`
  )

  if (rawPalette === '')
    return figma.ui.postMessage({
      type: 'EXPORT_PALETTE_CSS',
      data: {
        context: 'TAILWIND_V4',
        code: locales.get().error.export,
      },
    })

  return figma.ui.postMessage({
    type: 'EXPORT_PALETTE_CSS',
    data: {
      context: 'TAILWIND_V4',
      code: new Data(JSON.parse(rawPalette)).makeTailwindV4Config(),
    },
  })
}

export default exportTailwindV4
