import chroma from 'chroma-js';
import Palette from './modules/nodes';

figma.showUI(__html__);
figma.ui.resize(640, 312);
figma.loadFontAsync({ family: "Roboto", style: "Regular" });

figma.on('selectionchange', () => {
  if (figma.currentPage.selection.length == 1)
    figma.ui.postMessage(figma.currentPage.selection[0].getPluginData('scale'))
  else if (figma.currentPage.selection.length == 0)
    figma.ui.postMessage('empty-selection')
})

figma.ui.onmessage = msg => {

  switch (msg.type) {

    case 'create-palette':
      if (figma.currentPage.selection.length != 0) {

        const scene: SceneNode[] = [],
              palette: any = new Palette(msg.lightness.min, msg.lightness.max, msg.lightness.scale).makeNode();

        if (palette.children.length != 0) {
          figma.currentPage.appendChild(palette);
          scene.push(palette);
          figma.currentPage.selection = scene;
          figma.viewport.scrollAndZoomIntoView(scene)
        } else {
          palette.remove()
        }

      } else {
        figma.notify('Select some filled layers to generate a palette')
      };
      break;

    case 'update-palette':
      console.log('ok')

  }

};
