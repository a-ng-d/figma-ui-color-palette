import { lang, locals } from '../content/locals'

const getPalettesOnCurrentPage = async () => {
  const palettes = await figma.currentPage
    .loadAsync()
    .then(() =>
      figma.currentPage.findAllWithCriteria({
        pluginData: {},
      })
    )
    .catch(() => {
      figma.notify(locals[lang].error.palettesPicking)
      return []
    }) as Array<FrameNode>

  if (palettes.length != 0) {
    const palettesList = async () => {
      const palettePromises = palettes.map(async (palette) => {
        const bytes = await palette.exportAsync({
          format: 'PNG',
          constraint: { type: 'SCALE', value: 0.25 },
        })
        return {
          id: palette.id,
          name: palette.getPluginData('name'),
          preset: JSON.parse(palette.getPluginData('preset')).name,
          colors: JSON.parse(palette.getPluginData('colors')),
          themes: JSON.parse(palette.getPluginData('themes')),
          screenshot: bytes,
          devStatus: palette.devStatus !== null
            ? palette.devStatus.type
            : null
        }
      })
      return Promise.all(palettePromises)
    }

    figma.ui.postMessage({
      type: 'EXPOSE_PALETTES',
      data: await palettesList()
    })
  }
  else
    figma.ui.postMessage({
      type: 'EXPOSE_PALETTES',
      data: [],
    })
}

export default getPalettesOnCurrentPage
