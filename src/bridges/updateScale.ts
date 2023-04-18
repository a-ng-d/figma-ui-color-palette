import Colors from './../canvas/Colors'

const updateScale = (msg, palette) => {
  palette = figma.currentPage.selection[0]

  if (palette.children.length == 1) {
    const paletteName: string =
        palette.getPluginData('name') === ''
          ? 'UI Color Palette'
          : palette.getPluginData('name'),
      colors: string = JSON.parse(palette.getPluginData('colors')),
      properties: boolean =
        palette.getPluginData('properties') == 'hasProperties' ? true : false,
      preset = JSON.parse(palette.getPluginData('preset')),
      algorithmVersion: string = palette.getPluginData('algorithmVersion')

    palette.setPluginData('scale', JSON.stringify(msg.data.scale))

    if (Object.keys(msg.data.preset).length != 0)
      palette.setPluginData('preset', JSON.stringify(msg.data.preset))

    palette.children[0].remove()
    palette.appendChild(
      new Colors({
        paletteName: paletteName,
        colors: colors,
        scale: msg.data.scale,
        properties: msg.isEditedInRealTime ? false : properties,
        preset: preset,
        algorithmVersion: algorithmVersion,
      }).makeNode()
    )

    // palette migration
    palette.counterAxisSizingMode = 'AUTO'
    palette.name = `${paletteName}﹒${preset.name}`
  } else
    figma.notify(
      'Your UI Color Palette seems corrupted. Do not edit any layer within it.'
    )
}

export default updateScale
