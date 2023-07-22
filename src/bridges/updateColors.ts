import type {
  AlgorithmVersionConfiguration,
  ColorSpaceConfiguration,
  PresetConfiguration,
  ScaleConfiguration,
  TextColorsThemeHexModel,
  ThemeConfiguration,
  ViewConfiguration,
} from '../utils/types'
import Colors from './../canvas/Colors'
import {
  previousSelection,
  currentSelection,
  isSelectionChanged,
} from './processSelection'
import { locals, lang } from '../content/locals'

const updateColors = (msg, palette) => {
  palette = isSelectionChanged ? previousSelection[0] : currentSelection[0]

  if (palette.children.length == 1) {
    const name: string =
        palette.getPluginData('name') === ''
          ? locals[lang].name
          : palette.getPluginData('name'),
      preset: PresetConfiguration = JSON.parse(palette.getPluginData('preset')),
      scale: ScaleConfiguration = JSON.parse(palette.getPluginData('scale')),
      colorSpace: ColorSpaceConfiguration = palette.getPluginData('colorSpace'),
      themes: Array<ThemeConfiguration> = JSON.parse(
        palette.getPluginData('themes')
      ),
      view: ViewConfiguration = palette.getPluginData('view'),
      textColorsTheme: TextColorsThemeHexModel = JSON.parse(
        palette.getPluginData('textColorsTheme')
      ),
      algorithmVersion: AlgorithmVersionConfiguration = palette.getPluginData('algorithmVersion')

    palette.setPluginData('colors', JSON.stringify(msg.data))

    palette.children[0].remove()
    palette.appendChild(
      new Colors(
        {
          name: palette.getPluginData('name'),
          preset: preset,
          scale: scale,
          colors: msg.data,
          colorSpace: colorSpace,
          themes: themes,
          view:
            msg.isEditedInRealTime && view === 'PALETTE_WITH_PROPERTIES'
              ? 'PALETTE'
              : msg.isEditedInRealTime && view === 'SHEET'
              ? 'SHEET_SAFE_MODE'
              : view,
          textColorsTheme: textColorsTheme,
          algorithmVersion: algorithmVersion,
          service: 'EDIT',
        },
        palette
      ).makeNode()
    )

    // palette migration
    palette.counterAxisSizingMode = 'AUTO'
    palette.name = `${name}﹒${preset.name}﹒${colorSpace} ${
      view.includes('PALETTE') ? 'Palette' : 'Sheet'
    }`
  } else figma.notify(locals[lang].error.corruption)
}

export default updateColors
