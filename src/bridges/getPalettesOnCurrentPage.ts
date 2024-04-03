import { lang, locals } from "../content/locals"

const getPalettesOnCurrentPage = async () => {
  const palettes = await figma.currentPage.loadAsync()
    .then(() => figma.currentPage.findAllWithCriteria({
      pluginData: {},
    }))
    .catch((error) => {
      console.log(error)
      figma.notify(locals[lang].error.palettesPicking)
      return []
    })

  if (palettes.length != 0)
    figma.ui.postMessage({
      type: 'EXPOSE_PALETTES',
      data: palettes.map((palette) => {
        return {
          id: palette.getPluginData('id'),
          name: palette.getPluginData('name'),
          preset: JSON.parse(palette.getPluginData('preset')).name,
          colors: JSON.parse(palette.getPluginData('colors')),
          themes: JSON.parse(palette.getPluginData('themes')),
        }
      }),
    })
  else
    figma.ui.postMessage({
      type: 'EXPOSE_PALETTES',
      data: [],
    })
}

export default getPalettesOnCurrentPage
