import type {
  PresetConfiguration,
  TextColorsThemeHexModel,
  ColorConfiguration,
  ThemeConfiguration,
} from '../utils/types'
import {
  previousSelection,
  currentSelection,
  isSelectionChanged,
} from './processSelection'
import Colors from './../canvas/Colors'
import { locals, lang } from '../content/locals'
import doLightnessScale from '../utils/doLightnessScale'

const updateScale = (msg, palette) => {
  palette = isSelectionChanged ? previousSelection[0] : currentSelection[0]

  if (palette.children.length == 1) {
    const name: string =
        palette.getPluginData('name') === ''
          ? locals[lang].name
          : palette.getPluginData('name'),
      preset: PresetConfiguration = JSON.parse(palette.getPluginData('preset')),
      colors: Array<ColorConfiguration> = JSON.parse(
        palette.getPluginData('colors')
      ),
      colorSpace: string = palette.getPluginData('colorSpace'),
      themes: Array<ThemeConfiguration> = JSON.parse(
        palette.getPluginData('themes')
      ),
      view: string = palette.getPluginData('view'),
      textColorsTheme: TextColorsThemeHexModel = JSON.parse(
        palette.getPluginData('textColorsTheme')
      ),
      algorithmVersion: string = palette.getPluginData('algorithmVersion')

    themes.find((theme) => theme.isEnabled).scale = msg.data.scale
    if (msg.feature === 'ADD_STOP' || msg.feature === 'DELETE_STOP')
      themes.forEach((theme) => {
        if (!theme.isEnabled) {
          theme.scale = doLightnessScale(
            Object.keys(msg.data.scale).map((stop) => {
              return parseFloat(stop.replace('lightness-', ''))
            }),
            theme.scale[
              Object.keys(theme.scale)[Object.keys(theme.scale).length - 1]
            ],
            theme.scale[Object.keys(theme.scale)[0]]
          )
        }
      })
    palette.setPluginData('themes', JSON.stringify(themes))

    if (Object.keys(msg.data.preset).length != 0)
      palette.setPluginData('preset', JSON.stringify(msg.data.preset))

    palette.children[0].remove()
    palette.appendChild(
      new Colors(
        {
          name: palette.getPluginData('name'),
          preset: preset,
          scale: msg.data.scale,
          colors: colors,
          colorSpace: colorSpace,
          themes: themes,
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
    palette.name = `${name}﹒${preset.name}﹒${colorSpace} ${
      view.includes('PALETTE') ? 'Palette' : 'Sheet'
    }`
  } else figma.notify(locals[lang].error.corruption)
}

export default updateScale
