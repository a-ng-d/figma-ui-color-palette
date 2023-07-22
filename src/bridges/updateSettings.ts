import type {
  ColorConfiguration,
  PresetConfiguration,
  ScaleConfiguration,
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

const updateSettings = (msg, palette) => {
  palette = isSelectionChanged ? previousSelection[0] : currentSelection[0]

  if (palette.children.length == 1) {
    const preset: PresetConfiguration = JSON.parse(
        palette.getPluginData('preset')
      ),
      scale: ScaleConfiguration = JSON.parse(palette.getPluginData('scale')),
      colors: Array<ColorConfiguration> = JSON.parse(
        palette.getPluginData('colors')
      ),
      themes: Array<ThemeConfiguration> = JSON.parse(
        palette.getPluginData('themes')
      ),
      view: ViewConfiguration = palette.getPluginData('view')

    palette.setPluginData('name', msg.data.name)
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
    }﹒${preset.name}﹒${msg.data.colorSpace} ${
      view.includes('PALETTE') ? 'Palette' : 'Sheet'
    }`
  } else figma.notify(locals[lang].error.corruption)
}

export default updateSettings
