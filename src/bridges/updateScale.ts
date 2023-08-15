import type {
  PresetConfiguration,
  TextColorsThemeHexModel,
  ColorConfiguration,
  ThemeConfiguration,
  ColorSpaceConfiguration,
  ViewConfiguration,
  AlgorithmVersionConfiguration,
  ScaleMessage,
} from '../utils/types'
import {
  previousSelection,
  currentSelection,
  isSelectionChanged,
} from './processSelection'
import Colors from './../canvas/Colors'
import { locals, lang } from '../content/locals'
import doLightnessScale from '../utils/doLightnessScale'

const updateScale = (msg: ScaleMessage, palette: SceneNode) => {
  palette = isSelectionChanged
    ? (previousSelection?.[0] as FrameNode)
    : (currentSelection[0] as FrameNode)

  if (palette.children.length == 1) {
    const name: string =
        palette.getPluginData('name') === ''
          ? locals[lang].name
          : palette.getPluginData('name'),
      description: string = palette.getPluginData('description'),
      preset = JSON.parse(
        palette.getPluginData('preset')
      ) as PresetConfiguration,
      colors = JSON.parse(
        palette.getPluginData('colors')
      ) as Array<ColorConfiguration>,
      colorSpace = palette.getPluginData(
        'colorSpace'
      ) as ColorSpaceConfiguration,
      themes = JSON.parse(
        palette.getPluginData('themes')
      ) as Array<ThemeConfiguration>,
      view = palette.getPluginData('view') as ViewConfiguration,
      textColorsTheme = JSON.parse(
        palette.getPluginData('textColorsTheme')
      ) as TextColorsThemeHexModel,
      algorithmVersion = palette.getPluginData(
        'algorithmVersion'
      ) as AlgorithmVersionConfiguration

    const theme = themes.find((theme) => theme.isEnabled)
    if (theme != undefined) theme.scale = msg.data.scale

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
          description: description,
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
    palette.name = `${name}﹒${
      themes.find((theme) => theme.isEnabled)?.type === 'default theme'
        ? ''
        : themes.find((theme) => theme.isEnabled)?.name + '﹒'
    }${preset.name}﹒${colorSpace} ${
      view.includes('PALETTE') ? 'Palette' : 'Sheet'
    }`
  } else figma.notify(locals[lang].error.corruption)
}

export default updateScale
