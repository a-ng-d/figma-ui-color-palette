import Colors from '../../canvas/Colors'
import { lang, locals } from '../../content/locals'
import setPaletteName from '../../utils/setPaletteName'
import type {
  ColorConfiguration,
  PresetConfiguration,
  ScaleConfiguration,
  SettingsMessage,
  ThemeConfiguration,
  ViewConfiguration,
} from '../../utils/types'
import {
  currentSelection,
  isSelectionChanged,
  previousSelection,
} from '../processSelection'

const updateSettings = (msg: SettingsMessage) => {
  const palette = isSelectionChanged
    ? (previousSelection?.[0] as FrameNode)
    : (currentSelection[0] as FrameNode)

  if (palette.children.length == 1) {
    const preset = JSON.parse(
        palette.getPluginData('preset')
      ) as PresetConfiguration,
      scale = JSON.parse(palette.getPluginData('scale')) as ScaleConfiguration,
      colors = JSON.parse(
        palette.getPluginData('colors')
      ) as Array<ColorConfiguration>,
      themes = JSON.parse(
        palette.getPluginData('themes')
      ) as Array<ThemeConfiguration>,
      view = palette.getPluginData('view') as ViewConfiguration

    palette.setPluginData('name', msg.data.name)
    palette.setPluginData('description', msg.data.description)
    palette.setPluginData('colorSpace', msg.data.colorSpace)
    palette.setPluginData('visionSimulationMode', msg.data.visionSimulationMode)
    palette.setPluginData(
      'textColorsTheme',
      JSON.stringify(msg.data.textColorsTheme)
    )
    palette.setPluginData('algorithmVersion', msg.data.algorithmVersion)

    palette.children[0].remove()
    palette.appendChild(
      new Colors(
        {
          name: msg.data.name,
          description: msg.data.description,
          preset: preset,
          scale: scale,
          colors: colors,
          colorSpace: msg.data.colorSpace,
          visionSimulationMode: msg.data.visionSimulationMode,
          themes: themes,
          view: view,
          textColorsTheme: msg.data.textColorsTheme,
          algorithmVersion: msg.data.algorithmVersion,
          service: 'EDIT',
        },
        palette
      ).makeNode()
    )

    // palette migration
    palette.counterAxisSizingMode = 'AUTO'
    palette.name = setPaletteName(
      msg.data.name,
      themes.find((theme) => theme.isEnabled)?.name,
      preset.name,
      msg.data.colorSpace,
      msg.data.visionSimulationMode
    )
  } else figma.notify(locals[lang].error.corruption)
}

export default updateSettings
