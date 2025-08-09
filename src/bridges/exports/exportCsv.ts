import { Data } from '@a_ng_d/utils-ui-color-palette'
import { locales } from '../../content/locales'

const exportCsv = (id: string) => {
  const rawPalette = figma.currentPage.getSharedPluginData(
    'uicp',
    `palette_${id}`
  )

  if (rawPalette === '')
    return figma.ui.postMessage({
      type: 'EXPORT_PALETTE_CSV',
      data: {
        context: 'CSV',
        code: locales.get().error.export,
      },
    })

  const csv = new Data(JSON.parse(rawPalette)).makeCsv()

  return figma.ui.postMessage({
    type: 'EXPORT_PALETTE_CSV',
    data: {
      context: 'CSV',
      code:
        csv[0].colors.length === 0
          ? [
              {
                name: 'empty',
                colors: [{ csv: locales.get().warning.emptySourceColors }],
              },
            ]
          : csv,
    },
  })
}

export default exportCsv
