import Colors from '../canvas/Colors'
import {
  previousSelection,
  currentSelection,
  isSelectionChanged,
} from './processSelection'
import { locals, lang } from '../content/locals'

const updateSettings = (msg, palette) => {
  palette = isSelectionChanged ? previousSelection[0] : currentSelection[0]

  if (palette.children.length == 1) {
    const colors = JSON.parse(palette.getPluginData('colors')),
      scale = JSON.parse(palette.getPluginData('scale')),
      preset = JSON.parse(palette.getPluginData('preset')),
      view: string = palette.getPluginData('view')

    let paletteName: string

    palette.setPluginData('name', msg.data.name)
    ;(paletteName =
      palette.getPluginData('name') === '' ||
      palette.getPluginData('name') == undefined
        ? locals[lang].name
        : palette.getPluginData('name')),
      (palette.name = `${
        msg.data.name === '' ? locals[lang].name : msg.data.name
      }﹒${preset.name}﹒${view.includes('PALETTE') ? 'Palette' : 'Sheet'}`)
    palette.setPluginData(
      'textColorsTheme',
      JSON.stringify(msg.data.textColorsTheme)
    )
    palette.setPluginData('algorithmVersion', msg.data.algorithmVersion)

    palette.children[0].remove()
    palette.appendChild(
      new Colors(
        {
          paletteName: paletteName,
          preset: preset,
          scale: scale,
          colors: colors,
          view: view,
          textColorsTheme: msg.data.textColorsTheme,
          algorithmVersion: msg.data.algorithmVersion,
        },
        palette
      ).makeNode()
    )

    // palette migration
    palette.counterAxisSizingMode = 'AUTO'
  } else figma.notify(locals[lang].error.corruption)
}

export default updateSettings
