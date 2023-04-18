import Palette from './../canvas/Palette'

const createPalette = (msg, palette) => {
  const scene: SceneNode[] = []

  palette = new Palette(
    msg.data.name,
    msg.data.scale,
    msg.data.properties,
    msg.data.preset,
    'v2'
  ).makeNode()

  if (palette.children.length != 0) {
    figma.currentPage.appendChild(palette)
    scene.push(palette)
    figma.currentPage.selection = scene
    figma.viewport.scrollAndZoomIntoView(scene)
  } else palette.remove()
}

export default createPalette
