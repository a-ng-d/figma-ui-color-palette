import chroma from 'chroma-js';
import Sample from './Sample';

export default class Colors {

  captions: boolean;
  parent: any;
  node: FrameNode;

  constructor(parent) {
    this.parent = parent;
    this.node = figma.createFrame()
  }

  makeNode() {
    this.node.layoutMode = 'VERTICAL';
    this.node.primaryAxisSizingMode = 'AUTO';
    this.node.counterAxisSizingMode = 'AUTO';
    this.node.name = 'colors';

    figma.currentPage.selection.forEach(element => {

      let fills = element['fills'].filter(fill => fill.type === 'SOLID');

      if (fills.length != 0) {

        fills.forEach(fill => {

          let rgb = fill.color;

          this.parent.colors.push(rgb);

          const row = figma.createFrame();
          row.layoutMode = 'HORIZONTAL';
          row.counterAxisSizingMode = 'AUTO';
          row.name = element.name;

          Object.values(this.parent.scale).reverse().forEach(lightness => {
            let newColor = chroma([rgb.r * 255, rgb.g * 255, rgb.b * 255]).set('lch.l', lightness);
            const sample = new Sample(`${element.name}-${Object.keys(this.parent.scale).find(key => this.parent.scale[key] === lightness).substr(10)}`, 128, 96, newColor._rgb, this.parent.captions).makeNode();
            row.name = element.name;
            row.appendChild(sample)
          });

          this.node.appendChild(row);

        })

      } else {
        figma.notify(`The layer '${element.name}' must get at least one solid color`);
      }

    });

    return this.node
  }

}
