import type {
  AlgorithmVersionConfiguration,
  ColorConfiguration,
  ColorSpaceConfiguration,
  PresetConfiguration,
  ScaleConfiguration,
  TextColorsThemeHexModel,
  ThemesMessage,
  ViewConfiguration,
} from '../utils/types'
import Colors from '../canvas/Colors'
import {
  previousSelection,
  currentSelection,
  isSelectionChanged,
} from './processSelection'
import { locals, lang } from '../content/locals'

const updateThemes = (msg: ThemesMessage, palette: SceneNode) => {
  palette = isSelectionChanged
    ? (previousSelection?.[0] as FrameNode)
    : (currentSelection[0] as FrameNode)

  if (palette.children.length == 1) {
    const name: string =
        palette.getPluginData('name') === ''
          ? locals[lang].name
          : palette.getPluginData('name'),
      description: string = palette.getPluginData('description'),
      preset = JSON.parse(
        palette.getPluginData('preset')
      ) as PresetConfiguration,
      scale = JSON.parse(palette.getPluginData('scale')) as ScaleConfiguration,
      colors = JSON.parse(
        palette.getPluginData('colors')
      ) as Array<ColorConfiguration>,
      colorSpace = palette.getPluginData(
        'colorSpace'
      ) as ColorSpaceConfiguration,
      view = palette.getPluginData('view') as ViewConfiguration,
      textColorsTheme = JSON.parse(
        palette.getPluginData('textColorsTheme')
      ) as TextColorsThemeHexModel,
      algorithmVersion = palette.getPluginData(
        'algorithmVersion'
      ) as AlgorithmVersionConfiguration

    palette.setPluginData('themes', JSON.stringify(msg.data))

    palette.children[0].remove()
    palette.appendChild(
      new Colors(
        {
          name: palette.getPluginData('name'),
          description: description,
          preset: preset,
          scale: scale,
          colors: colors,
          colorSpace: colorSpace,
          themes: msg.data,
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
    palette.name = `${name}﹒${
      msg.data.find((theme) => theme.isEnabled)?.type === 'default theme'
        ? ''
        : msg.data.find((theme) => theme.isEnabled)?.name + '﹒'
    }${preset.name}﹒${colorSpace} ${
      view.includes('PALETTE') ? 'Palette' : 'Sheet'
    }`
  } else figma.notify(locals[lang].error.corruption)
}

export default updateThemes
