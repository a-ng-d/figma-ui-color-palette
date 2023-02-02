import Colors from './../canvas/Colors'
import {
  previousSelection,
  currentSelection,
  isSelectionChanged,
} from './processSelection'

const updateColors = (msg, palette) => {
  palette = isSelectionChanged ? previousSelection[0] : currentSelection[0]

  try {
    if (palette.children.length == 1) {
      const paletteName: string =
          palette.getPluginData('name') === ''
            ? 'UI Color Palette'
            : palette.getPluginData('name'),
        scale: string = JSON.parse(palette.getPluginData('scale')),
        captions: boolean =
          palette.getPluginData('captions') == 'hasCaptions' ? true : false,
        preset = JSON.parse(palette.getPluginData('preset')),
        colors = JSON.parse(palette.getPluginData('colors'))

      palette.setPluginData('colors', JSON.stringify(msg.data))

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

      // palette migration
      palette.counterAxisSizingMode = 'AUTO'
      palette.name = `${paletteName}﹒${preset.name}`
    } else
      figma.notify(
        'Your UI Color Palette seems corrupted. Do not edit any layer within it.'
      )
  } catch {
    return
  }
}

export default updateColors
