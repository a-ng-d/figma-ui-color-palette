import { setData } from './../utils/setData';
import { presets } from './../utils/palette-package';

export const processSelection = () => {

  const selection: ReadonlyArray<BaseNode> = figma.currentPage.selection

  if (selection.length == 1 && selection[0].getPluginData('scale') != '') {
    if (selection[0].getPluginData('preset') === '')
      selection[0].setPluginData('preset', JSON.stringify(presets.material));

    if (!selection[0].getPluginData('colors').includes('oklch'))
      selection[0].setPluginData('colors', setData(selection[0].getPluginData('colors'), 'oklch', false));

    if (!selection[0].getPluginData('colors').includes('hueShifting'))
      selection[0].setPluginData('colors', setData(selection[0].getPluginData('colors'), 'hueShifting', 0));

    figma.ui.postMessage({
      type: 'palette-selected',
      data: {
        scale: JSON.parse(selection[0].getPluginData('scale')),
        captions: selection[0].getPluginData('captions'),
        colors: JSON.parse(selection[0].getPluginData('colors')),
        preset: JSON.parse(selection[0].getPluginData('preset'))
      }
    })
  }
  else if (selection.length == 0)
    figma.ui.postMessage({
      type: 'empty-selection',
      data: {}
    });

  selection.forEach(element => {
    if (element.type != 'GROUP')
      if (element['fills'].filter(fill => fill.type === 'SOLID').length != 0 && element.getPluginData('scale') === '')
        figma.ui.postMessage({
          type: 'color-selected',
          data: {}
        })
  })

};
