import chroma from 'chroma-js';
import Palette from './modules/Palette';
import Style from './modules/Style';
import Colors from './modules/Colors';

figma.showUI(__html__);
figma.ui.resize(640, 312);
figma.loadFontAsync({ family: 'Roboto', style: 'Regular' });

figma.on('run', () => messageToUI());
figma.on('selectionchange', () => messageToUI());

figma.ui.onmessage = msg => {

  let palette: any,
      i = 0;

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

    case 'edit-palette':
      palette = figma.currentPage.selection[0];
      palette.setPluginData('min', msg.palette.min.toString());
      palette.setPluginData('max', msg.palette.max.toString());
      palette.setPluginData('scale', JSON.stringify(msg.palette.scale));

      palette.children[0].remove();
      palette.appendChild(new Colors({
        colors: JSON.parse(palette.getPluginData('colors')),
        scale: JSON.parse(palette.getPluginData('scale')),
        captions: palette.getPluginData('captions') == 'hasCaptions' ? true : false
      }).makeNode());

      figma.ui.postMessage(palette.getPluginData('scale'));
      break;

    case 'update-captions':
      palette = figma.currentPage.selection[0];

      if (msg.palette.captions) {
        palette.setPluginData('captions', 'hasCaptions');
        palette.children[0].children.forEach(row => {
          row.children.forEach(sample => {
            sample.children[0].visible = true
          })
        })
      } else {
        palette.setPluginData('captions', 'hasNotCaptions');
        palette.children[0].children.forEach(row => {
          row.children.forEach(sample => {
            sample.children[0].visible = false
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
      i = 0;

      palette.children.forEach(row => {
        row.children.forEach(sample => {
          const style = new Style(
            sample.name.replace('-', '/'),
            sample.fills[0].color
          ).makeNode();
          figma.moveLocalPaintStyleAfter(style, null);
          i++
        })
      })
      figma.notify(`${i} local color styles have been created 🙌`)
      break;

    case 'update-local-styles':
      palette = figma.currentPage.selection[0];
      const localStyles = figma.getLocalPaintStyles();
      i = 0;

      palette.children.forEach(row => {
        row.children.forEach(sample => {
          localStyles.forEach(localStyle => {
            if (sample.name === localStyle.name.replace('/', '-')) {
              if (JSON.stringify(localStyle.paints[0]['color']) != JSON.stringify(sample.fills[0]['color'])) {
                localStyle.paints = sample.fills;
                i++
              }
            }
          })
        })
      });
      if (i > 1)
        figma.notify(`${i} local color styles have been updated 🙌`)
      else if (i == 1)
        figma.notify(`${i} local color style has been updated 🙌`)
      else
        figma.notify(`No local color style has been updated`)

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
