import Colors from '../canvas/Colors';

const updateSettings = (msg, palette) => {

  palette = figma.currentPage.selection[0];
  palette.setPluginData('name', msg.data)

};

export default updateSettings
