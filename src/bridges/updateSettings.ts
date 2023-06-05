import Colors from '../canvas/Colors'
import {
  previousSelection,
  currentSelection,
  isSelectionChanged,
} from './processSelection'

const updateSettings = (msg, palette) => {
  palette = isSelectionChanged ? previousSelection[0] : currentSelection[0]

  if (palette.children.length == 1) {
    const colors = JSON.parse(palette.getPluginData('colors')),
      scale = JSON.parse(palette.getPluginData('scale')),
      properties =
        palette.getPluginData('properties') == 'hasProperties' ? true : false,
      preset = JSON.parse(palette.getPluginData('preset')),
      view: string = palette.getPluginData('view')

    let paletteName: string

    palette.setPluginData('name', msg.data.name)
    ;(paletteName =
      palette.getPluginData('name') === '' ||
      palette.getPluginData('name') == undefined
        ? 'UI Color Palette'
        : palette.getPluginData('name')),
      (palette.name = `${
        msg.data.name === '' ? 'UI Color Palette' : msg.data.name
      }﹒${preset.name}`)
    palette.setPluginData(
      'textColorsTheme',
      JSON.stringify(msg.data.textColorsTheme)
    )
    palette.setPluginData('algorithmVersion', msg.data.algorithmVersion)

    palette.children[0].remove()
    palette.appendChild(
      new Colors({
        paletteName: paletteName,
        colors: colors,
        scale: scale,
        properties: msg.isEditedInRealTime ? false : properties,
        preset: preset,
        textColorsTheme: msg.data.textColorsTheme,
        view: view,
        algorithmVersion: msg.data.algorithmVersion,
      }, palette).makeNode()
    )

    // palette migration
    palette.counterAxisSizingMode = 'AUTO'
  } else
    figma.notify(
      'Your UI Color Palette seems corrupted. Do not edit any layer within it.'
    )
}

export default updateSettings
