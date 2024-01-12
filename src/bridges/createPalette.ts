import Palette from './../canvas/Palette'

const createPalette = (msg: any, palette: SceneNode) => {
  const scene: SceneNode[] = []

  palette = new Palette(
    msg.data.sourceColors,
    msg.data.palette.name,
    msg.data.palette.description,
    msg.data.palette.preset,
    msg.data.palette.scale,
    msg.data.palette.colorSpace,
    msg.data.palette.colorBlindMode,
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
