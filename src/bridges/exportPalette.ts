import chroma from 'chroma-js';

let json = {};

const exportPalette = (msg, palette) => {

  palette = figma.currentPage.selection[0];

  if (palette.children.length == 1) {
    palette.children[0].children.forEach(row => {
      if (row.name != '_header' && row.name != '_title')
        row.children.forEach((sample, index) => {
          if (index != 0) {
            const color = sample.fills[0].color;
            json[row.name][sample.name] = {};
            json[row.name][sample.name] = {
              rgb: {
                r: color.r * 255,
                g: color.g * 255,
                b: color.b * 255
              },
              lch: {
                l: chroma(color.r * 255, color.g * 255, color.b * 255).lch()[0],
                c: chroma(color.r * 255, color.g * 255, color.b * 255).lch()[1],
                h: chroma(color.r * 255, color.g * 255, color.b * 255).lch()[2]
              },
              hex: chroma(color.r * 255, color.g * 255, color.b * 255).hex(),
              type: 'color'
            }
          } else
            json[row.name] = {}
        })
    })
    console.log(json)
  } else
    figma.notify('Your UI Color Palette seems corrupted. Do not edit any layer within it.')

};

export default exportPalette
