import type { PresetConfiguration, ScaleConfiguration, TextColorsThemeHexModel } from '../utils/types'
import Colors from './../canvas/Colors'
import {
  previousSelection,
  currentSelection,
  isSelectionChanged,
} from './processSelection'

const updateColors = (msg, palette) => {
  palette = isSelectionChanged ? previousSelection[0] : currentSelection[0]

  if (palette.children.length == 1) {
    const paletteName: string =
        palette.getPluginData('name') === ''
          ? 'UI Color Palette'
          : palette.getPluginData('name'),
      scale: ScaleConfiguration = JSON.parse(palette.getPluginData('scale')),
      properties: boolean =
        palette.getPluginData('properties') == 'hasProperties' ? true : false,
      preset: PresetConfiguration = JSON.parse(palette.getPluginData('preset')),
      textColorsTheme: TextColorsThemeHexModel = JSON.parse(palette.getPluginData('textColorsTheme')),
      algorithmVersion: string = palette.getPluginData('algorithmVersion')

    palette.setPluginData('colors', JSON.stringify(msg.data))

    palette.children[0].remove()
    palette.appendChild(
      new Colors({
        paletteName: paletteName,
        colors: msg.data,
        scale: scale,
        properties: msg.isEditedInRealTime ? false : properties,
        preset: preset,
        textColorsTheme: textColorsTheme,
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

export default updateColors
