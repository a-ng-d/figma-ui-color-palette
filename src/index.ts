import chroma from 'chroma-js';
import Palette from './modules/Palette';
import Sample from './modules/Sample';


figma.showUI(__html__);
figma.ui.resize(640, 312);
figma.loadFontAsync({ family: 'Roboto', style: 'Regular' });

figma.on('run', () => {
  if (figma.currentPage.selection.length == 1) {
    figma.ui.postMessage(JSON.stringify({
      scale: figma.currentPage.selection[0].getPluginData('scale'),
      captions: figma.currentPage.selection[0].getPluginData('captions')
    }))
  }
  else if (figma.currentPage.selection.length == 0)
    figma.ui.postMessage('empty-selection')
})

figma.on('selectionchange', () => {
  if (figma.currentPage.selection.length == 1) {
    figma.ui.postMessage(JSON.stringify({
      scale: figma.currentPage.selection[0].getPluginData('scale'),
      captions: figma.currentPage.selection[0].getPluginData('captions')
    }))
  }
  else if (figma.currentPage.selection.length == 0)
    figma.ui.postMessage('empty-selection')
})

figma.ui.onmessage = msg => {

  let palette: any;

  switch (msg.type) {

    case 'create-palette':
      if (figma.currentPage.selection.length != 0) {

        const scene: SceneNode[] = [];

        palette = new Palette(msg.palette.min, msg.palette.max, msg.palette.scale, msg.palette.captions).makeNode();

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
      palette = figma.currentPage.selection[0];
      palette.setPluginData('min', msg.palette.min.toString());
      palette.setPluginData('max', msg.palette.max.toString());
      palette.setPluginData('scale', JSON.stringify(msg.palette.scale));

      for (let i = 0 ; i < (palette as FrameNode).children.length ; i++) {
        const rgb = JSON.parse(palette.getPluginData('colors'))[i],
              row = (palette as FrameNode).children[i];

        for (let j = 0 ; j < (row as FrameNode).children.length ; j++) {
          const sample = (row as FrameNode).children[j],
                newColor = chroma([rgb.r * 255, rgb.g * 255, rgb.b * 255]).set('lch.l', Object.values(msg.palette.scale)[j]);
          (row as FrameNode).insertChild(j, new Sample(sample.name, 128, 96, newColor._rgb, msg.palette.captions).makeNode())
          sample.remove()
        }
      };

      figma.ui.postMessage(palette.getPluginData('scale'));
      break;

    case 'update-captions':
      palette = figma.currentPage.selection[0];

      if (msg.hasCaptions) {
        palette.setPluginData('captions', 'hasCaptions');
        palette.children.forEach(row => {
          row.children.forEach(sample => {
            sample.children.forEach(caption => {
              caption.visible = true
            })
          })
        })

      } else {
        palette.setPluginData('captions', 'hasNotCaptions');
        palette.children.forEach(row => {
          row.children.forEach(sample => {
            sample.children.forEach(caption => {
              caption.visible = false
            })
          })
        })
      }

  }

};
