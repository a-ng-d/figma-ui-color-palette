import type {
  PresetConfiguration,
  ScaleConfiguration,
  TextColorsThemeHexModel,
} from '../utils/types'
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
      preset: PresetConfiguration = JSON.parse(palette.getPluginData('preset')),
      textColorsTheme: TextColorsThemeHexModel = JSON.parse(
        palette.getPluginData('textColorsTheme')
      ),
      view: string = palette.getPluginData('view'),
      algorithmVersion: string = palette.getPluginData('algorithmVersion')

    palette.setPluginData('colors', JSON.stringify(msg.data))

    palette.children[0].remove()
    palette.appendChild(
      new Colors({
        paletteName: paletteName,
        preset: preset,
        scale: scale,
        colors: msg.data,
        view: msg.isEditedInRealTime && view === 'PALETTE_WITH_PROPERTIES' ? 'PALETTE' : msg.isEditedInRealTime && view === 'SHEET' ? 'SHEET_SAFE_MODE' : view,
        textColorsTheme: textColorsTheme,
        algorithmVersion: algorithmVersion,
      }, palette).makeNode()
    )

    // palette migration
    palette.counterAxisSizingMode = 'AUTO'
    palette.name = `${paletteName}﹒${preset.name}﹒${view.includes('PALETTE') ? 'Palette' : 'Sheet'}`
  } else
    figma.notify(
      'Your UI Color Palette seems corrupted. Do not edit any layer within it.'
    )
}

export default updateColors
