import type {
  ColorConfiguration,
  PresetConfiguration,
  ScaleConfiguration,
  SettingsMessage,
  ThemeConfiguration,
  ViewConfiguration,
} from '../utils/types'
import {
  previousSelection,
  currentSelection,
  isSelectionChanged,
} from './processSelection'
import Colors from '../canvas/Colors'
import { locals, lang } from '../content/locals'

const updateSettings = (msg: SettingsMessage, palette: SceneNode) => {
  palette = isSelectionChanged
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
    palette.name = `${
      msg.data.name === '' ? locals[lang].name : msg.data.name
    }﹒${
      themes.find((theme) => theme.isEnabled)?.type === 'default theme'
        ? ''
        : themes.find((theme) => theme.isEnabled)?.name + '﹒'
    }${preset.name}﹒${msg.data.colorSpace} ${
      view.includes('PALETTE') ? 'Palette' : 'Sheet'
    }`
  } else figma.notify(locals[lang].error.corruption)
}

export default updateSettings
