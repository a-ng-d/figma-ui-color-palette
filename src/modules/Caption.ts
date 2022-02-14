import chroma from 'chroma-js';

export default class Caption {

  scale: string;
  rgb: Array<number>;
  hex: string;
  lch: Array<number>;
  nodeTitle: TextNode;
  nodeProperties: TextNode;
  node: FrameNode;

  constructor(scale, rgb) {
    this.scale = scale;
    this.rgb = rgb;
    this.hex = chroma(rgb).hex();
    this.lch = chroma(rgb).lch();
    this.nodeTitle = figma.createText();
    this.nodeProperties = figma.createText();
    this.node = figma.createFrame()
  }

  getContrast() {
    return Math.max(chroma.contrast(this.rgb, '#FFF'), chroma.contrast(this.rgb, '#000'))
  }

  getLevel() {
    return this.getContrast() < 4.5 ? 'A'
         : this.getContrast() >= 4.5 && this.getContrast() < 7 ? 'AA'
         : 'AAA'
  }

  getCaptionColor() {
    return chroma.contrast(this.rgb, '#FFF') < chroma.contrast(this.rgb, '#000') ? [0, 0, 0] : [1, 1, 1];
  }

  doContent() {
    return `${this.hex.toUpperCase()}\nR ${Math.floor(this.rgb[0])}﹒G ${Math.floor(this.rgb[1])}﹒B ${Math.floor(this.rgb[2])}\nL ${Math.floor(this.lch[0])}﹒C ${Math.floor(this.lch[1])}﹒H ${Math.floor(this.lch[2])}\n${this.getLevel()}﹒${this.getContrast().toFixed(2)} : 1`
  }

  makeNodeTitle() {
    this.nodeTitle.name = 'lightning-scale';
    this.nodeTitle.characters = this.scale;
    this.nodeTitle.fontName = {
      family: 'Roboto Mono',
      style: 'Regular'
    };
    this.nodeTitle.fontSize = 10;
    this.nodeTitle.fills = [{
      type: 'SOLID',
      color: {
        r: this.getCaptionColor()[0],
        g: this.getCaptionColor()[1],
        b: this.getCaptionColor()[2]
      }
    }];
    this.nodeTitle.layoutGrow = 1;

    return this.nodeTitle
  }

  makeNodeProperties() {
    this.nodeProperties.name = 'properties';
    this.nodeProperties.characters = this.doContent();
    this.nodeProperties.fontName = {
      family: 'Roboto Mono',
      style: 'Regular'
    };
    this.nodeProperties.fontSize = 10;
    this.nodeProperties.fills = [{
      type: 'SOLID',
      color: {
        r: this.getCaptionColor()[0],
        g: this.getCaptionColor()[1],
        b: this.getCaptionColor()[2]
      }
    }];
    this.nodeProperties.layoutGrow = 1;

    return this.nodeProperties
  }

  makeNode() {
    this.node.name = 'captions';
    this.node.fills = [];
    this.node.locked = true;

    this.node.appendChild(this.makeNodeTitle());
    this.node.appendChild(this.makeNodeProperties());

    return this.node
  }

}
