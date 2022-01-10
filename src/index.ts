import chroma from 'chroma-js';
import Palette from './modules/Palette';
import Sample from './modules/Sample';
import Style from './modules/Style';


figma.showUI(__html__);
figma.ui.resize(640, 312);
figma.loadFontAsync({ family: 'Roboto', style: 'Regular' });

figma.on('run', () => messageToUI());
figma.on('selectionchange', () => messageToUI());

figma.ui.onmessage = msg => {

  let palette: any;

  switch (msg.type) {

    case 'create-palette':
      if (figma.currentPage.selection.length != 0) {

        const scene: SceneNode[] = [];

        palette = new Palette(
            msg.palette.min,
            msg.palette.max,
            msg.palette.scale,
            msg.palette.captions
          ).makeNode();

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
          (row as FrameNode).insertChild(j, new Sample(
            sample.name,
            128,
            96,
            newColor._rgb,
            msg.palette.captions
          ).makeNode())
          sample.remove()
        }
      };

      figma.ui.postMessage(palette.getPluginData('scale'));
      break;

    case 'update-captions':
      palette = figma.currentPage.selection[0];

      if (msg.palette.captions) {
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
      break;

    case 'get-infos':
      palette = figma.currentPage.selection[0];

      try {
        figma.ui.postMessage(JSON.stringify({
          scale: palette.getPluginData('scale'),
          captions: palette.getPluginData('captions')
        }))
      } catch { }
      break;

    case 'create-local-styles':
      palette = figma.currentPage.selection[0];

      palette.children.forEach(row => {
        row.children.forEach(sample => {
          new Style(
            sample.name.replace('-', '/'),
            sample.fills[0].color
          ).makeNode()
        })
      })
      break;

    case 'update-local-styles':
      palette = figma.currentPage.selection[0];
      const localStyles = figma.getLocalPaintStyles();

      palette.children.forEach(row => {
        row.children.forEach(sample => {
          localStyles.forEach(localStyle => {
            if (sample.name === localStyle.name.replace('/', '-')) {
              localStyle.paints = sample.fills
            }
          })
        })
      })

  }

};

const messageToUI = () => {
  if (figma.currentPage.selection.length == 1 && figma.currentPage.selection[0].getPluginData('scale') != '')
    figma.ui.postMessage(JSON.stringify({
      type: 'palette-selected',
      data: {
        scale: figma.currentPage.selection[0].getPluginData('scale'),
        captions: figma.currentPage.selection[0].getPluginData('captions')
      }
    }))
  else if (figma.currentPage.selection.length == 0)
    figma.ui.postMessage(JSON.stringify({
      type: 'empty-selection',
      data: {}
    }));

  figma.currentPage.selection.forEach(element => {
    if (element['fills'].filter(fill => fill.type === 'SOLID').length != 0 && element.getPluginData('scale') === '')
      figma.ui.postMessage(JSON.stringify({
        type: 'color-selected',
        data: {}
      }))
  })
}
