import Colors from '../canvas/Colors'

const updateProperties = (msg, palette) => {
  palette = figma.currentPage.selection[0]

  if (palette.children.length == 1) {
    const paletteName: string =
        palette.getPluginData('name') === ''
          ? 'UI Color Palette'
          : palette.getPluginData('name'),
      colors: string = JSON.parse(palette.getPluginData('colors')),
      scale: string = JSON.parse(palette.getPluginData('scale')),
      preset = JSON.parse(palette.getPluginData('preset')),
      algorithmVersion: string = palette.getPluginData('algorithmVersion')

    if (msg.data.properties) {
      palette.setPluginData('PROPERTIES', 'hasProperties')

      palette.children[0].remove()
      palette.appendChild(
        new Colors({
          paletteName: paletteName,
          colors: colors,
          scale: scale,
          properties: msg.data.properties,
          preset: preset,
          algorithmVersion: algorithmVersion,
        }).makeNode()
      )
    } else {
      palette.setPluginData('PROPERTIES', 'hasNotProperties')

      palette.children[0].remove()
      palette.appendChild(
        new Colors({
          paletteName: paletteName,
          colors: colors,
          scale: scale,
          properties: msg.data.properties,
          preset: preset,
          algorithmVersion: algorithmVersion,
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

export default updateProperties
