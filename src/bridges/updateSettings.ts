import Colors from '../canvas/Colors';

const updateSettings = (msg, palette) => {

  palette = figma.currentPage.selection[0];

  if (palette.children.length == 1) {
    const colors = JSON.parse(palette.getPluginData('colors')),
          scale = JSON.parse(palette.getPluginData('scale')),
          captions = palette.getPluginData('captions') == 'hasCaptions' ? true : false,
          preset = JSON.parse(palette.getPluginData('preset'));
    
    let paletteName: string;

    palette.setPluginData('name', msg.data);
    paletteName = palette.getPluginData('name') === ''  || palette.getPluginData('name') == undefined  ? 'UI Color Palette' : palette.getPluginData('name'),
    
    palette.name = `${msg.data}﹒${preset.name}`

    palette.children[0].remove();
    palette.appendChild(new Colors({
      paletteName: paletteName,
      colors: colors,
      scale: scale,
      captions: captions,
      preset: preset
    }).makeNode());

    // palette migration
    palette.counterAxisSizingMode = 'AUTO';

  } else
  figma.notify('Your UI Color Palette seems corrupted. Do not edit any layer within it.')

};

export default updateSettings
