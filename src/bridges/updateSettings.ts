import Colors from '../canvas/Colors'
import {
  previousSelection,
  currentSelection,
  isSelectionChanged,
} from './processSelection'

const updateSettings = (msg, palette) => {
  palette = isSelectionChanged ? previousSelection[0] : currentSelection[0]

  if (palette.children.length == 1) {
    const colors = JSON.parse(palette.getPluginData('colors')),
      scale = JSON.parse(palette.getPluginData('scale')),
      captions =
        palette.getPluginData('captions') == 'hasCaptions' ? true : false,
      preset = JSON.parse(palette.getPluginData('preset'))

    let paletteName: string

    palette.setPluginData('name', msg.data.name)
    ;(paletteName =
      palette.getPluginData('name') === '' ||
      palette.getPluginData('name') == undefined
        ? 'UI Color Palette'
        : palette.getPluginData('name')),
      (palette.name = `${msg.data.name === '' ? 'UI Color Palette' : msg.data.name}﹒${
        preset.name
      }`)
    palette.setPluginData('algorithmVersion', msg.data.algorithmVersion)

    palette.children[0].remove()
    palette.appendChild(
      new Colors({
        paletteName: paletteName,
        colors: colors,
        scale: scale,
        captions: captions,
        preset: preset,
        algorithmVersion: msg.data.algorithmVersion
      }).makeNode()
    )

    // palette migration
    palette.counterAxisSizingMode = 'AUTO'
  } else
    figma.notify(
      'Your UI Color Palette seems corrupted. Do not edit any layer within it.'
    )
}

export default updateSettings
