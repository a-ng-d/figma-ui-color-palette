import Palette from './../canvas/Palette';
import { palette, presets } from './../utils/palette-package';

export const createPalette = (msg, palette) => {

  const scene: SceneNode[] = [];

  palette = new Palette (
    msg.palette.scale,
    msg.palette.captions,
    msg.palette.preset
  ).makeNode();

  if (palette.children.length != 0) {
    figma.currentPage.appendChild(palette);
    scene.push(palette);
    figma.currentPage.selection = scene;
    figma.viewport.scrollAndZoomIntoView(scene)
  } else
    palette.remove()

}
