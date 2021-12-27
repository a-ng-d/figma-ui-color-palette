import chroma from 'chroma-js';

export default class Palette {

  name: string;
  min: number;
  max: number;
  scale: string;
  node: FrameNode;

  constructor(min, max, scale) {
    this.name = "Awesome Palette";
    this.min = min;
    this.max = max;
    this.scale = scale;
    this.node = figma.createFrame();
  }

  makeNode() {
    this.node.layoutMode = "VERTICAL";
    this.node.primaryAxisSizingMode = "AUTO";
    this.node.counterAxisSizingMode = "AUTO";
    this.node.name = this.name;
    this.node.paddingTop = this.node.paddingRight = this.node.paddingBottom = this.node.paddingLeft = 32;
    this.node.cornerRadius = 16;
    this.node.setPluginData('min', this.min.toString());
    this.node.setPluginData('max', this.max.toString());
    this.node.setPluginData('scale', JSON.stringify(this.scale));

    figma.currentPage.selection.forEach(element => {

      let fills = element['fills'].filter(fill => fill.type === "SOLID");

      if (fills.length != 0) {

        fills.forEach(fill => {

          let rgb = fill.color;

          const item = figma.createFrame();
          item.layoutMode = "HORIZONTAL";
          item.counterAxisSizingMode = "AUTO";
          item.name = element.name;

          Object.values(this.scale).forEach(lightness => {
            let newColor = chroma([rgb.r * 255, rgb.g * 255, rgb.b * 255]).set('lch.l', lightness);
            const sample = new Sample(`${element.name}-${Object.keys(this.scale).find(key => this.scale[key] === lightness).substr(10)}`, 128, 96, newColor._rgb).makeNode();
            item.name = element.name;
            item.appendChild(sample)
          });

          this.node.appendChild(item);

        })

      } else {
        figma.notify(`The layer "${element.name}" must get at least one solid color`);
      }
  });

    return this.node
  }

};

class Sample {

  name: string;
  width: number;
  height: number;
  rgb: Array<number>;
  node: FrameNode;

  constructor(name, width, height, rgb) {
    this.name = name;
    this.width = width;
    this.height = height;
    this.rgb = rgb;
    this.node = figma.createFrame();
  }

  makeNode() {
    this.node.name = this.name;
    this.node.resize(this.width, this.height);
    this.node.fills = [{
      type: 'SOLID',
      color: {
        r: this.rgb[0] / 255,
        g: this.rgb[1] / 255,
        b: this.rgb[2] / 255
      }
    }];
    this.node.layoutMode = "HORIZONTAL";
    this.node.paddingTop = this.node.paddingRight = this.node.paddingBottom = this.node.paddingLeft = 8;
    this.node.primaryAxisSizingMode = "FIXED";

    this.node.appendChild(new Legend(this.name, this.rgb).makeNode())

    return this.node
  }

}

class Legend {

  name: string;
  rgb: Array<number>;
  hex: string;
  lch: Array<number>;
  node: TextNode;

  constructor(name, rgb) {
    this.name = name;
    this.rgb = rgb;
    this.hex = chroma(rgb).hex();
    this.lch = chroma(rgb).lch();
    this.node = figma.createText();
  }

  getContrast() {
    return Math.max(chroma.contrast(this.rgb, '#FFF'), chroma.contrast(this.rgb, '#000'))
  }

  getLevel() {
    return this.getContrast() < 4.5 ? 'A'
         : this.getContrast() >= 4.5 && this.getContrast() < 7 ? 'AA'
         : 'AAA'
  }

  getLegendColor() {
    return chroma.contrast(this.rgb, '#FFF') < chroma.contrast(this.rgb, '#000') ? [0, 0, 0] : [1, 1, 1];
  }

  doContent() {
    return `${this.name}\n${this.hex}\nR ${Math.floor(this.rgb[0])} G ${Math.floor(this.rgb[1])} B ${Math.floor(this.rgb[2])}\nL ${Math.floor(this.lch[0])} C ${Math.floor(this.lch[1])} H ${Math.floor(this.lch[2])}\n${this.getLevel()} ${this.getContrast().toFixed(2)} : 1`
  }

  makeNode() {
    this.node.name = 'legend';
    this.node.characters = this.doContent();
    this.node.fontSize = 10;
    this.node.textAlignVertical = "CENTER";
    this.node.fills = [{
      type: 'SOLID',
      color: {
        r: this.getLegendColor()[0],
        g: this.getLegendColor()[1],
        b: this.getLegendColor()[2]
      }
    }];
    this.node.layoutGrow = 1;

    return this.node
  }

}
