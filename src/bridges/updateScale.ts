import Colors from './../canvas/Colors';

export const updateScale = (msg, palette) => {

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

}
