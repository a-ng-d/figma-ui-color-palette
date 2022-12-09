import chroma from 'chroma-js';
import Sample from './Sample';
import Header from './Header';
import Title from './Title';

export default class Colors {

  captions: boolean;
  parent: any;
  node: FrameNode;

  constructor(parent) {
    this.parent = parent;
    this.node = figma.createFrame()
  }

  makeNode() {
    // base
    this.node.name = '_colors﹒do not edit any layer';
    this.node.fills = [];
    this.node.locked = true;

    // layout
    this.node.layoutMode = 'VERTICAL';
    this.node.primaryAxisSizingMode = 'AUTO';
    this.node.counterAxisSizingMode = 'AUTO';

    // insert
    this.node.appendChild(new Title(`${this.parent.paletteName === '' ? 'UI Color Palette' : this.parent.paletteName} • ${this.parent.preset.name}`, this.parent).makeNode());
    this.node.appendChild(new Header(this.parent).makeNode());
    this.parent.colors.forEach(color => {

      const row = figma.createFrame();

      // base
      row.name = color.name;
      row.resize(100, 160);
      row.fills = [];

      // layout
      row.layoutMode = 'HORIZONTAL';
      row.primaryAxisSizingMode = 'AUTO';
      row.counterAxisSizingMode = 'AUTO';

      // insert
      const rowName = new Sample(color.name, null, [color.rgb.r * 255, color.rgb.g * 255, color.rgb.b * 255], this.parent.captions).makeName('absolute', 150, 200, 10);
      row.appendChild(rowName);

      Object.values(this.parent.scale).reverse().forEach((lightness: any) => {
        let newColor, lch, oklch;
        if (color.oklch) {
          oklch = chroma([color.rgb.r * 255, color.rgb.g * 255, color.rgb.b * 255]).oklch()
          newColor = chroma.oklch(
            parseFloat(lightness) / 100,
            oklch[1],
            oklch[2] + color.hueShifting < 0 ? 0 : oklch[2] + color.hueShifting > 360 ? 360 : oklch[2] + color.hueShifting
          )
        }
        else {
          lch = chroma([color.rgb.r * 255, color.rgb.g * 255, color.rgb.b * 255]).lch()
          newColor = chroma.lch(
            parseFloat(lightness),
            lch[1],
            lch[2] + color.hueShifting < 0 ? 0 : lch[2] + color.hueShifting > 360 ? 360 : lch[2] + color.hueShifting
          )
        }

        const sample = new Sample(
          color.name,
          Object.keys(this.parent.scale).find(key => this.parent.scale[key] === lightness).substr(10),
          newColor._rgb,
          this.parent.captions
        ).makeScale(150, 200, 10);
        row.name = color.name;
        row.appendChild(sample)
      });

      this.node.appendChild(row)

    });

    return this.node
  }

}
