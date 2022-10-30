import Colors from './../canvas/Colors';

export const updateColors = (msg, palette) => {

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

}
