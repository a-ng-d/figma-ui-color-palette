import type {
  ColorSpaceConfiguration,
  PresetConfiguration,
  ScaleConfiguration,
  SourceColorConfiguration,
  TextColorsThemeHexModel,
  ViewConfiguration,
  visionSimulationModeConfiguration,
} from '../../utils/types'
import Palette from '../../canvas/Palette'

interface Msg {
  data: {
    sourceColors: Array<SourceColorConfiguration>
    palette: {
      name: string
      description: string
      preset: PresetConfiguration
      scale: ScaleConfiguration
      colorSpace: ColorSpaceConfiguration
      visionSimulationMode: visionSimulationModeConfiguration
      view: ViewConfiguration
      textColorsTheme: TextColorsThemeHexModel
    }
  }
}

const createPalette = (msg: Msg) => {
  const scene: SceneNode[] = []

  const palette = new Palette(
    msg.data.sourceColors,
    msg.data.palette.name,
    msg.data.palette.description,
    msg.data.palette.preset,
    msg.data.palette.scale,
    msg.data.palette.colorSpace,
    msg.data.palette.visionSimulationMode,
    msg.data.palette.view,
    msg.data.palette.textColorsTheme,
    'v2'
  ).makeNode()

  if (palette.children.length != 0) {
    figma.currentPage.appendChild(palette)
    scene.push(palette)
    palette.x = figma.viewport.center.x - palette.width / 2
    palette.y = figma.viewport.center.y - palette.height / 2
    figma.currentPage.selection = scene
    figma.viewport.scrollAndZoomIntoView(scene)
  } else palette.remove()
}

export default createPalette
