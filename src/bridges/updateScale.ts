import Colors from './../canvas/Colors';

const updateScale = (msg, palette) => {

  palette = figma.currentPage.selection[0];

  try {
    if (palette.children.length == 1) {
      const paletteName: string = palette.getPluginData('name') === '' ? 'UI Color Palette' : palette.getPluginData('name'),
          colors: string = JSON.parse(palette.getPluginData('colors')),
          captions: boolean = palette.getPluginData('captions') == 'hasCaptions' ? true : false,
          preset = JSON.parse(palette.getPluginData('preset'));
      
      const scale: string = JSON.parse(palette.getPluginData('scale'));
  
      palette.setPluginData('scale', JSON.stringify(msg.palette.scale));
  
      if (Object.keys(msg.palette.preset).length != 0)
        palette.setPluginData('preset', JSON.stringify(msg.palette.preset))
  
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
      palette.name = `${paletteName}﹒${preset.name}`
    }
    else
      figma.notify('Your UI Color Palette seems corrupted. Do not edit any layer within it.') 
  }
  catch { return }
  
};

export default updateScale
