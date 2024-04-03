const getPalettesOnCurrentPage = async () => {
  const palettes = await figma.currentPage.loadAsync()
    .then(() => figma.currentPage.findAllWithCriteria({
      pluginData: {},
    }))

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
