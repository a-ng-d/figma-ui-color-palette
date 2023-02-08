import Colors from './../canvas/Colors'

const updateCaptions = (msg, palette) => {
  palette = figma.currentPage.selection[0]

    if (palette.children.length == 1) {
      const paletteName: string =
          palette.getPluginData('name') === ''
            ? 'UI Color Palette'
            : palette.getPluginData('name'),
        colors: string = JSON.parse(palette.getPluginData('colors')),
        scale: string = JSON.parse(palette.getPluginData('scale')),
        preset = JSON.parse(palette.getPluginData('preset'))

      let captions: boolean

      if (msg.palette.captions) {
        palette.setPluginData('captions', 'hasCaptions')
        captions =
          palette.getPluginData('captions') == 'hasCaptions' ? true : false

        palette.children[0].remove()
        palette.appendChild(
          new Colors({
            paletteName: paletteName,
            colors: colors,
            scale: scale,
            captions: captions,
            preset: preset,
          }).makeNode()
        )
      } else {
        palette.setPluginData('captions', 'hasNotCaptions')
        captions =
          palette.getPluginData('captions') == 'hasCaptions' ? true : false

        palette.children[0].remove()
        palette.appendChild(
          new Colors({
            paletteName: paletteName,
            colors: colors,
            scale: scale,
            captions: captions,
            preset: preset,
          }).makeNode()
        )
      }

      // palette migration
      palette.counterAxisSizingMode = 'AUTO'
      palette.name = `${paletteName}﹒${preset.name}`
    } else
      figma.notify(
        'Your UI Color Palette seems corrupted. Do not edit any layer within it.'
      )
}

export default updateCaptions
