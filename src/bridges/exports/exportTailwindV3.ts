import { Data } from '@a_ng_d/utils-ui-color-palette'
import { locales } from '../../content/locales'

const exportTailwindV3 = (id: string) => {
  const rawPalette = figma.currentPage.getSharedPluginData(
    'uicp',
    `palette_${id}`
  )

  if (rawPalette === '')
    return figma.ui.postMessage({
      type: 'EXPORT_PALETTE_JS',
      data: {
        context: 'TAILWIND_V3',
        code: locales.get().error.export,
      },
    })

  return figma.ui.postMessage({
    type: 'EXPORT_PALETTE_JS',
    data: {
      context: 'TAILWIND_V3',
      code: new Data(JSON.parse(rawPalette)).makeTailwindV3Config(),
    },
  })
}

export default exportTailwindV3
