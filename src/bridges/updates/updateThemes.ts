import Colors from '../../canvas/Colors'
import { lang, locals } from '../../content/locals'
import setPaletteName from '../../utils/setPaletteName'
import type {
  AlgorithmVersionConfiguration,
  ColorConfiguration,
  ColorSpaceConfiguration,
  PresetConfiguration,
  ScaleConfiguration,
  TextColorsThemeHexModel,
  ThemesMessage,
  ViewConfiguration,
  VisionSimulationModeConfiguration,
} from '../../utils/types'
import {
  currentSelection,
  isSelectionChanged,
  previousSelection,
} from '../processSelection'

const updateThemes = (msg: ThemesMessage) => {
  const palette = isSelectionChanged
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
      scale = JSON.parse(palette.getPluginData('scale')) as ScaleConfiguration,
      colors = JSON.parse(
        palette.getPluginData('colors')
      ) as Array<ColorConfiguration>,
      colorSpace = palette.getPluginData(
        'colorSpace'
      ) as ColorSpaceConfiguration,
      visionSimulationMode = palette.getPluginData(
        'visionSimulationMode'
      ) as VisionSimulationModeConfiguration,
      view = palette.getPluginData('view') as ViewConfiguration,
      textColorsTheme = JSON.parse(
        palette.getPluginData('textColorsTheme')
      ) as TextColorsThemeHexModel,
      algorithmVersion = palette.getPluginData(
        'algorithmVersion'
      ) as AlgorithmVersionConfiguration

    palette.setPluginData('themes', JSON.stringify(msg.data))

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
          themes: msg.data,
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

    // Update
    const now = new Date().toISOString()
    palette.setPluginData('updatedAt', now)
    figma.ui.postMessage({
      type: 'UPDATE_PALETTE_DATE',
      data: now,
    })

    // palette migration
    palette.counterAxisSizingMode = 'AUTO'
    palette.name = setPaletteName(
      name,
      msg.data.find((theme) => theme.isEnabled)?.name,
      preset.name,
      colorSpace,
      visionSimulationMode
    )
  } else figma.notify(locals[lang].error.corruption)
}

export default updateThemes
