import chroma from 'chroma-js';

export default class Sample {

  name: string;
  width: number;
  height: number;
  x: number;
  y: number;
  rgb: Array<number>;
  node: FrameNode;

  constructor(name, width, height, x, y, rgb) {
    this.name = name;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.rgb = rgb;
    this.node = figma.createFrame();
  }

  makeNode() {
    this.node.name = this.name;
    this.node.x = this.x;
    this.node.y = this.y;
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

    this.node.appendChild(new Legend(this.rgb).makeNode())

    return this.node
  }

}

class Legend {

  rgb: Array<number>;
  hex: string;
  lch: Array<number>;
  node: TextNode;

  constructor(rgb) {
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
    return `${this.hex}\nR ${Math.floor(this.rgb[0])} G ${Math.floor(this.rgb[1])} B ${Math.floor(this.rgb[2])}\nL ${Math.floor(this.lch[0])} C ${Math.floor(this.lch[1])} H ${Math.floor(this.lch[2])}\n${this.getLevel()} ${this.getContrast().toFixed(2)} : 1`
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
