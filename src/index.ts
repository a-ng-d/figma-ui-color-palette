import Palette from './canvas/Palette';
import Style from './canvas/Style';
import Colors from './canvas/Colors';
import { createPalette } from './bridges/createPalette';
import { updateScale } from './bridges/updateScale';
import { updateCaptions } from './bridges/updateCaptions';
import { updateColors } from './bridges/updateColors';
import { messageToUI } from './bridges/messageToUI';
import { presets } from './utils/palette-package';

figma.showUI(__html__);
figma.ui.resize(640, 320);
figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
figma.loadFontAsync({ family: 'Roboto', style: 'Regular' });
figma.loadFontAsync({ family: 'Roboto Mono', style: 'Regular' });
figma.loadFontAsync({ family: 'Roboto Mono', style: 'Medium' });

figma.on('run', () => messageToUI());
figma.on('selectionchange', () => messageToUI());

figma.ui.onmessage = msg => {

  let palette: any,
      i = 0;

  switch (msg.type) {

    case 'create-palette': createPalette(msg, palette); break;

    case 'update-scale': updateScale(msg, palette); break;

    case 'update-captions': updateCaptions(msg, palette); break;

    case 'update-colors': updateColors(msg, palette); break;


    case 'create-local-styles':
      palette = figma.currentPage.selection[0];

      if (palette.children.length == 1) {
        const localStyles = figma.getLocalPaintStyles();
        i = 0;

        palette.children[0].children.forEach(row => {
          if (row.name != '_header' && row.name != '_title')
            row.children.forEach((sample, index) => {
              if (index != 0) {
                if (localStyles.filter(e => e.name === `${row.name}/${sample.name.replace(row.name + '-', '')}`).length == 0) {
                  const style = new Style(
                    `${row.name}/${sample.name.replace(row.name + '-', '')}`,
                    sample.fills[0].color
                  ).makeNode();
                  figma.moveLocalPaintStyleAfter(style, null);
                  i++
                }
              }
            })
        })
        if (i > 1)
          figma.notify(`${i} local color styles have been created 🙌`)
        else if (i == 1)
          figma.notify(`${i} local color style has been created 🙌`)
        else
          figma.notify(`No local color style has been created`)
      } else
        figma.notify('Your UI Color Palette seems corrupted. Do not edit any layer within it.')
      break;

    case 'update-local-styles':
      palette = figma.currentPage.selection[0];

      if (palette.children.length == 1) {
        const localStyles = figma.getLocalPaintStyles();
        i = 0;

        palette.children[0].children.forEach(row => {
          row.children.forEach(sample => {
            localStyles.forEach(localStyle => {
              if (`${row.name}/${sample.name}` === localStyle.name) {
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
      } else
        figma.notify('Your UI Color Palette seems corrupted. Do not edit any layer within it.')

  }

};
