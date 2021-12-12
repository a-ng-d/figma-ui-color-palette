import chroma from 'chroma-js';
import Sample from './modules/nodes';

figma.showUI(__html__);
figma.ui.resize(640, 264);
figma.loadFontAsync({ family: "Roboto", style: "Regular" });

figma.ui.onmessage = msg => {

  if (msg.type === 'make-palette' && figma.currentPage.selection.length != 0) {

    let i = 0,
        j = 0;

    const nodes: SceneNode[] = [];

    figma.currentPage.selection.forEach(element => {

      let fills = element['fills'].filter(fill => fill.type === "SOLID");

      if (fills.length != 0) {

        fills.forEach(fill => {

          let rgb = fill.color;

          Object.values(msg.data).forEach(lightness => {
      			let palette = chroma([rgb.r * 255, rgb.g * 255, rgb.b * 255]).set('lch.l', lightness);
            const sample = new Sample(`${element.name}-${Object.keys(msg.data).find(key => msg.data[key] === lightness).substr(10)}`, 128, 64, i, j, palette._rgb).makeNode();
            figma.currentPage.appendChild(sample);
            nodes.push(sample);
            i += 128;
      		});

          i = 0;
          j += 64

        });

      } else {
        figma.notify(`The layer "${element.name}" must get at least one solid color`)
      }


    });

    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes)

  } else {
    figma.notify('Select some filled layers to generate a palette')
  };

}
