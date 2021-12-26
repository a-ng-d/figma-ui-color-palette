import chroma from 'chroma-js';
import Sample from './modules/nodes';

figma.showUI(__html__);
figma.ui.resize(640, 312);
figma.loadFontAsync({ family: "Roboto", style: "Regular" });

figma.ui.onmessage = msg => {

  if (msg.type === 'create-palette' && figma.currentPage.selection.length != 0) {

    const scene: SceneNode[] = [],
          palette: FrameNode = figma.createFrame();

    palette.layoutMode = "VERTICAL";
    palette.primaryAxisSizingMode = "AUTO";
    palette.counterAxisSizingMode = "AUTO";
    palette.name = "Awesome Palette";
    palette.paddingTop = palette.paddingRight = palette.paddingBottom = palette.paddingLeft = 32;
    palette.cornerRadius = 16;
    palette.setPluginData('min', msg.lightness.min.toString());
    palette.setPluginData('max', msg.lightness.max.toString());
    palette.setPluginData('scale', JSON.stringify(msg.lightness.scale));

    figma.currentPage.selection.forEach(element => {

      let fills = element['fills'].filter(fill => fill.type === "SOLID");

      if (fills.length != 0) {

        fills.forEach(fill => {

          let rgb = fill.color;

          const paletteItem: FrameNode = figma.createFrame();
          paletteItem.layoutMode = "HORIZONTAL";
          paletteItem.counterAxisSizingMode = "AUTO";
          paletteItem.name = element.name;

          Object.values(msg.lightness.scale).forEach(lightness => {
      			let newColor = chroma([rgb.r * 255, rgb.g * 255, rgb.b * 255]).set('lch.l', lightness);
            const sample = new Sample(`${element.name}-${Object.keys(msg.lightness.scale).find(key => msg.lightness.scale[key] === lightness).substr(10)}`, 128, 96, newColor._rgb).makeNode();
            paletteItem.name = element.name;
            paletteItem.appendChild(sample)
      		});

          palette.appendChild(paletteItem)
          figma.currentPage.appendChild(palette);
          scene.push(palette);

        })

      } else {
        figma.notify(`The layer "${element.name}" must get at least one solid color`)
      }


    });

    figma.currentPage.selection = scene;
    figma.viewport.scrollAndZoomIntoView(scene)

  } else {
    figma.notify('Select some filled layers to generate a palette')
  };

}
