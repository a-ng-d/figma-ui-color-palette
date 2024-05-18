import Colors from '../../canvas/Colors'
import {
  previousSelection,
  currentSelection,
  isSelectionChanged,
} from '../processSelection'
import { locals, lang } from '../../content/locals'
import setPaletteName from '../../utils/setPaletteName'

const updateGlobal = async (msg: any) => {
  const palette = isSelectionChanged
    ? (previousSelection?.[0] as FrameNode)
    : (currentSelection[0] as FrameNode)

  if (palette.children.length == 1) {

    palette.children[0].remove()
    palette.appendChild(
      new Colors(
        {
          name: msg.data.name,
          description: msg.data.description,
          preset: msg.data.preset,
          scale: msg.data.scale,
          colors: msg.data.colors,
          colorSpace: msg.data.color_space,
          visionSimulationMode: msg.data.vision_simulation_mode,
          themes: msg.data.themes,
          view: msg.data.view,
          textColorsTheme: msg.data.text_colors_theme,
          algorithmVersion: msg.data.algorithm_version,
          service: 'EDIT',
          isSynchronized: true
        },
        palette
      ).makeNode()
    )

    palette.name = setPaletteName(
      msg.data.name,
      msg.data.themes.find((theme: any) => theme.isEnabled)?.name,
      msg.data.preset.name,
      msg.data.color_space,
      msg.data.vision_simulation_mode
    )

    palette.setPluginData('name', msg.data.name)
    palette.setPluginData('description', msg.data.description)
    palette.setPluginData('preset', JSON.stringify(msg.data.preset))
    palette.setPluginData('scale', JSON.stringify(msg.data.scale))
    palette.setPluginData('colors', JSON.stringify(msg.data.colors))
    palette.setPluginData('colorSpace', msg.data.color_space)
    palette.setPluginData('visionSimulationMode', msg.data.vision_simulation_mode)
    palette.setPluginData('themes', JSON.stringify(msg.data.themes))
    palette.setPluginData('view', msg.data.view)
    palette.setPluginData('textColorsTheme', JSON.stringify(msg.data.text_colors_theme))
    palette.setPluginData('algorithmVersion', JSON.stringify(msg.data.algorithm_version))
    palette.setPluginData('createdAt', msg.data.created_at)
    palette.setPluginData('updatedAt', msg.data.updated_at)
    palette.setPluginData('isShared', msg.data.is_shared.toString())
    palette.setPluginData('creatorFullName', msg.data.creator_full_name)
    palette.setPluginData('creatorAvatar', msg.data.creator_avatar)
    palette.setPluginData('creatorId', msg.data.creator_id)

    const bytes = await palette.exportAsync({
      format: 'PNG',
      constraint: { type: 'SCALE', value: 0.25 },
    })
    figma.ui.postMessage({
      type: 'UPDATE_SCREENSHOT',
      data: bytes,
    })

  } else figma.notify(locals[lang].error.corruption)
}

export default updateGlobal
