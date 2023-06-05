import type {
  PresetConfiguration,
  TextColorsThemeHexModel,
  ColorConfiguration,
} from '../utils/types'
import Colors from './../canvas/Colors'

const updateScale = (msg, palette) => {
  palette = figma.currentPage.selection[0]

  if (palette.children.length == 1) {
    const paletteName: string =
        palette.getPluginData('name') === ''
          ? 'UI Color Palette'
          : palette.getPluginData('name'),
      colors: Array<ColorConfiguration> = JSON.parse(
        palette.getPluginData('colors')
      ),
      properties: boolean =
        palette.getPluginData('properties') == 'hasProperties' ? true : false,
      preset: PresetConfiguration = JSON.parse(palette.getPluginData('preset')),
      textColorsTheme: TextColorsThemeHexModel = JSON.parse(
        palette.getPluginData('textColorsTheme')
      ),
      view: string = palette.getPluginData('view'),
      algorithmVersion: string = palette.getPluginData('algorithmVersion')

    palette.setPluginData('scale', JSON.stringify(msg.data.scale))

    if (Object.keys(msg.data.preset).length != 0)
      palette.setPluginData('preset', JSON.stringify(msg.data.preset))

    palette.children[0].remove()
    palette.appendChild(
      new Colors({
        paletteName: paletteName,
        colors: colors,
        scale: msg.data.scale,
        properties: msg.isEditedInRealTime ? false : properties,
        preset: preset,
        textColorsTheme: textColorsTheme,
        view: msg.isEditedInRealTime && view === 'PALETTE_WITH_PROPERTIES' ? 'PALETTE' : view,
        algorithmVersion: algorithmVersion,
      }, palette).makeNode()
    )

    // palette migration
    palette.counterAxisSizingMode = 'AUTO'
    palette.name = `${paletteName}﹒${preset.name}`
  } else
    figma.notify(
      'Your UI Color Palette seems corrupted. Do not edit any layer within it.'
    )
}

export default updateScale
