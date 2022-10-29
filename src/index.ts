import Palette from './canvas/Palette';
import Style from './canvas/Style';
import Colors from './canvas/Colors';
import { createPalette } from './bridges/createPalette';
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

    case 'update-scale':
      palette = figma.currentPage.selection[0];
      if (palette.children.length == 1) {
        palette.setPluginData('scale', JSON.stringify(msg.palette.scale));

        palette.children[0].remove();
        palette.appendChild(new Colors({
          colors: JSON.parse(palette.getPluginData('colors')),
          scale: JSON.parse(palette.getPluginData('scale')),
          captions: palette.getPluginData('captions') == 'hasCaptions' ? true : false,
          preset: JSON.parse(palette.getPluginData('preset'))
        }).makeNode());

        // palette migration
        palette.counterAxisSizingMode = 'AUTO';
        palette.name = `UI Color Palette﹒${JSON.parse(palette.getPluginData('preset')).name}`
      } else
        figma.notify('Your UI Color Palette seems corrupted. Do not edit any layer within it.')
      break;

    case 'update-captions':
      palette = figma.currentPage.selection[0];
      if (palette.children.length == 1) {
        if (msg.palette.captions) {
          palette.setPluginData('captions', 'hasCaptions');
          palette.children[0].remove();
          palette.appendChild(new Colors({
            colors: JSON.parse(palette.getPluginData('colors')),
            scale: JSON.parse(palette.getPluginData('scale')),
            captions: palette.getPluginData('captions') == 'hasCaptions' ? true : false,
            preset: JSON.parse(palette.getPluginData('preset'))
          }).makeNode())
        } else {
          palette.setPluginData('captions', 'hasNotCaptions');
          palette.children[0].remove();
          palette.appendChild(new Colors({
            colors: JSON.parse(palette.getPluginData('colors')),
            scale: JSON.parse(palette.getPluginData('scale')),
            captions: palette.getPluginData('captions') == 'hasCaptions' ? true : false,
            preset: JSON.parse(palette.getPluginData('preset'))
          }).makeNode())
        }

        // palette migration
        palette.counterAxisSizingMode = 'AUTO';
        palette.name = `UI Color Palette﹒${JSON.parse(palette.getPluginData('preset')).name}`
      } else
        figma.notify('Your UI Color Palette seems corrupted. Do not edit any layer within it.')
      break;

    case 'update-colors':
      palette = figma.currentPage.selection[0];
      palette.setPluginData('colors', JSON.stringify(msg.data));
      palette.children[0].remove();
      palette.appendChild(new Colors({
        colors: JSON.parse(palette.getPluginData('colors')),
        scale: JSON.parse(palette.getPluginData('scale')),
        captions: palette.getPluginData('captions') == 'hasCaptions' ? true : false,
        preset: JSON.parse(palette.getPluginData('preset'))
      }).makeNode());

      // palette migration
      palette.counterAxisSizingMode = 'AUTO';
      palette.name = `UI Color Palette﹒${JSON.parse(palette.getPluginData('preset')).name}`
      break;

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
