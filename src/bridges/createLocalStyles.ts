import Style from './../canvas/Style';

export const createLocalStyles = (palette, i) => {

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

}
