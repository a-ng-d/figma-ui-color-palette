import type {
  PresetConfiguration,
  ScaleConfiguration,
  TextColorsThemeHexModel,
  ColorConfiguration,
  ThemeConfiguration,
  ColorSpaceConfiguration,
  AlgorithmVersionConfiguration,
  ViewMessage,
  visionSimulationModeConfiguration,
} from '../utils/types'
import Colors from '../canvas/Colors'
import { locals, lang } from '../content/locals'
import setPaletteName from '../utils/setPaletteName'

const updateView = (msg: ViewMessage, palette: FrameNode) => {
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
      visionSimulationMode = palette.getPluginData(
        'visionSimulationMode'
      ) as visionSimulationModeConfiguration,
      themes = JSON.parse(
        palette.getPluginData('themes')
      ) as Array<ThemeConfiguration>,
      textColorsTheme = JSON.parse(
        palette.getPluginData('textColorsTheme')
      ) as TextColorsThemeHexModel,
      algorithmVersion = palette.getPluginData(
        'algorithmVersion'
      ) as AlgorithmVersionConfiguration

    palette.setPluginData('view', msg.data.view)

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
          visionSimulationMode: visionSimulationMode,
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
    palette.name = setPaletteName(
      name,
      themes.find((theme) => theme.isEnabled)?.name,
      preset.name,
      colorSpace,
      visionSimulationMode
    )
  } else figma.notify(locals[lang].error.corruption)
}

export default updateView
