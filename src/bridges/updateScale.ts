import type {
  PresetConfiguration,
  TextColorsThemeHexModel,
  ColorConfiguration,
} from '../utils/types'
import {
  previousSelection,
  currentSelection,
  isSelectionChanged,
} from './processSelection'
import Colors from './../canvas/Colors'
import { locals } from '../content/locals'

const updateScale = (msg, palette) => {
  palette = isSelectionChanged ? previousSelection[0] : currentSelection[0]

  if (palette.children.length == 1) {
    const paletteName: string =
        palette.getPluginData('name') === ''
          ? locals.en.name
          : palette.getPluginData('name'),
      colors: Array<ColorConfiguration> = JSON.parse(
        palette.getPluginData('colors')
      ),
      preset: PresetConfiguration = JSON.parse(palette.getPluginData('preset')),
      textColorsTheme: TextColorsThemeHexModel = JSON.parse(
        palette.getPluginData('textColorsTheme')
      ),
      view: string = palette.getPluginData('view'),
      algorithmVersion: string = palette.getPluginData('algorithmVersion')

    palette.setPluginData('scale', JSON.stringify(msg.data.scale))

    if (Object.keys(msg.data.preset).length != 0)
      palette.setPluginData('preset', JSON.stringify(msg.data.preset))

    palette.children[0].remove()
    palette.appendChild(
      new Colors(
        {
          paletteName: paletteName,
          preset: preset,
          scale: msg.data.scale,
          colors: colors,
          view:
            msg.isEditedInRealTime && view === 'PALETTE_WITH_PROPERTIES'
              ? 'PALETTE'
              : msg.isEditedInRealTime && view === 'SHEET'
              ? 'SHEET_SAFE_MODE'
              : view,
          textColorsTheme: textColorsTheme,
          algorithmVersion: algorithmVersion,
        },
        palette
      ).makeNode()
    )

    // palette migration
    palette.counterAxisSizingMode = 'AUTO'
    palette.name = `${paletteName}﹒${preset.name}﹒${
      view.includes('PALETTE') ? 'Palette' : 'Sheet'
    }`
  } else figma.notify(locals.en.error.corruption)
}

export default updateScale
