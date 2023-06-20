import type {
  PresetConfiguration,
  ScaleConfiguration,
  TextColorsThemeHexModel,
  ColorConfiguration,
} from '../utils/types'
import Colors from '../canvas/Colors'
import { locals } from '../content/locals'

const updateView = (msg, palette) => {
  palette = figma.currentPage.selection[0]

  if (palette.children.length == 1) {
    const paletteName: string =
        palette.getPluginData('name') === ''
          ? locals.en.name
          : palette.getPluginData('name'),
      colors: Array<ColorConfiguration> = JSON.parse(
        palette.getPluginData('colors')
      ),
      scale: ScaleConfiguration = JSON.parse(palette.getPluginData('scale')),
      preset: PresetConfiguration = JSON.parse(palette.getPluginData('preset')),
      textColorsTheme: TextColorsThemeHexModel = JSON.parse(
        palette.getPluginData('textColorsTheme')
      ),
      algorithmVersion: string = palette.getPluginData('algorithmVersion')

    palette.setPluginData('view', msg.data.view)
    palette.children[0].remove()
    palette.appendChild(
      new Colors(
        {
          paletteName: paletteName,
          preset: preset,
          scale: scale,
          colors: colors,
          view: msg.data.view,
          textColorsTheme: textColorsTheme,
          algorithmVersion: algorithmVersion,
        },
        palette
      ).makeNode()
    )

    // palette migration
    palette.counterAxisSizingMode = 'AUTO'
    palette.name = `${paletteName}﹒${preset.name}﹒${
      msg.data.view.includes('PALETTE') ? 'Palette' : 'Sheet'
    }`
  } else figma.notify(locals.en.error.corruption)
}

export default updateView
