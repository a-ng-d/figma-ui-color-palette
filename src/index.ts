import chroma from 'chroma-js';
import Palette from './modules/Palette';
import Sample from './modules/Sample';


figma.showUI(__html__);
figma.ui.resize(640, 312);
figma.loadFontAsync({ family: "Roboto", style: "Regular" });

figma.on('run', () => {
  if (figma.currentPage.selection.length == 1)
    figma.ui.postMessage(figma.currentPage.selection[0].getPluginData('scale'))
  else if (figma.currentPage.selection.length == 0)
    figma.ui.postMessage('empty-selection')
})

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
        figma.notify('Select some filled layers to create a palette')
      };
      break;

    case 'update-palette':
      const palette = figma.currentPage.selection[0];
      palette.setPluginData('min', msg.lightness.min.toString());
      palette.setPluginData('max', msg.lightness.max.toString());
      palette.setPluginData('scale', JSON.stringify(msg.lightness.scale));

      for (let i = 0 ; i < (palette as FrameNode).children.length ; i++) {
        const rgb = JSON.parse(palette.getPluginData('colors'))[i],
              row = (palette as FrameNode).children[i];

        for(let j = 0 ; j < (row as FrameNode).children.length ; j++) {
          const sample = (row as FrameNode).children[j],
                newColor = chroma([rgb.r * 255, rgb.g * 255, rgb.b * 255]).set('lch.l', Object.values(msg.lightness.scale)[j]);
          (row as FrameNode).insertChild(j, new Sample(sample.name, 128, 96, newColor._rgb).makeNode())
          sample.remove()
        }
      }

  }

};
