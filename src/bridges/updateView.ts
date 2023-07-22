import type {
  PresetConfiguration,
  ScaleConfiguration,
  TextColorsThemeHexModel,
  ColorConfiguration,
  ThemeConfiguration,
  ColorSpaceConfiguration,
  AlgorithmVersionConfiguration,
} from '../utils/types'
import Colors from '../canvas/Colors'
import { locals, lang } from '../content/locals'

const updateView = (msg, palette) => {
  palette = figma.currentPage.selection[0]

  if (palette.children.length == 1) {
    const name: string =
        palette.getPluginData('name') === ''
          ? locals[lang].name
          : palette.getPluginData('name'),
      preset: PresetConfiguration = JSON.parse(palette.getPluginData('preset')),
      scale: ScaleConfiguration = JSON.parse(palette.getPluginData('scale')),
      colors: Array<ColorConfiguration> = JSON.parse(
        palette.getPluginData('colors')
      ),
      colorSpace: ColorSpaceConfiguration = palette.getPluginData('colorSpace'),
      themes: Array<ThemeConfiguration> = JSON.parse(
        palette.getPluginData('themes')
      ),
      textColorsTheme: TextColorsThemeHexModel = JSON.parse(
        palette.getPluginData('textColorsTheme')
      ),
      algorithmVersion: AlgorithmVersionConfiguration =
        palette.getPluginData('algorithmVersion')

    palette.setPluginData('view', msg.data.view)

    palette.children[0].remove()
    palette.appendChild(
      new Colors(
        {
          name: palette.getPluginData('name'),
          preset: preset,
          scale: scale,
          colors: colors,
          colorSpace: colorSpace,
          themes: themes,
          view: msg.data.view,
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
      msg.data.view.includes('PALETTE') ? 'Palette' : 'Sheet'
    }`
  } else figma.notify(locals[lang].error.corruption)
}

export default updateView
