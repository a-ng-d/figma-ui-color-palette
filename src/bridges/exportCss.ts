import chroma from 'chroma-js';

let css = [];

const exportCss = (msg, palette) => {

  palette = figma.currentPage.selection[0];

  if (palette.children.length == 1) {
    palette.children[0].children.forEach(row => {
      if (row.name != '_header' && row.name != '_title')
        row.children.forEach((sample, index) => {
          if (index != 0) {
            const color = sample.fills[0].color;
            css.push(`--${row.name.toLowerCase()}-${sample.name}: rgb(${Math.floor(color.r * 255)}, ${Math.floor(color.g * 255)}, ${Math.floor(color.b * 255)})`)
          }
        })
    })
    figma.ui.postMessage({
      type: 'export-palette',
      export: 'CSS',
      data: css
    })
  } else
    figma.notify('Your UI Color Palette seems corrupted. Do not edit any layer within it.')

};

export default exportCss
