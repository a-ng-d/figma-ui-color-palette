import chroma from 'chroma-js';

export default class Caption {

  name: string;
  rgb: Array<number>;
  hex: string;
  lch: Array<number>;
  nodeScale: TextNode;
  nodeProperties: TextNode;
  nodeName: TextNode;
  node: FrameNode;

  constructor(name, rgb) {
    this.name = name;
    this.rgb = rgb;
    this.hex = chroma(rgb).hex();
    this.lch = chroma(rgb).lch();
    this.nodeScale = figma.createText();
    this.nodeProperties = figma.createText();
    this.nodeName = figma.createText();
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
    return `${this.hex.toUpperCase()}\nR ${Math.floor(this.rgb[0])} • G ${Math.floor(this.rgb[1])} • B ${Math.floor(this.rgb[2])}\nL ${Math.floor(this.lch[0])} • C ${Math.floor(this.lch[1])} • H ${Math.floor(this.lch[2])}\n${this.getLevel()} • ${this.getContrast().toFixed(2)} : 1`
  }

  makeName() {
    this.nodeName.name = '_color-name';
    this.nodeName.characters = this.name;
    this.nodeName.fontName = {
      family: 'Roboto Mono',
      style: 'Medium'
    };
    this.nodeName.fontSize = 10;
    this.nodeName.fills = [{
      type: 'SOLID',
      color: {
        r: this.getCaptionColor()[0],
        g: this.getCaptionColor()[1],
        b: this.getCaptionColor()[2]
      }
    }];
    this.nodeName.layoutAlign = 'STRETCH';
    this.nodeName.layoutGrow = 1;

    return this.nodeName
  }

  makeNodeScale() {
    // base
    this.nodeScale.name = '_lightness-scale';
    this.nodeScale.characters = this.name;
    this.nodeScale.fontName = {
      family: 'Roboto Mono',
      style: 'Medium'
    };
    this.nodeScale.fontSize = 10;
    this.nodeScale.fills = [{
      type: 'SOLID',
      color: {
        r: this.getCaptionColor()[0],
        g: this.getCaptionColor()[1],
        b: this.getCaptionColor()[2]
      }
    }];

    // layout
    this.nodeScale.layoutAlign = 'STRETCH';

    return this.nodeScale
  }

  makeNodeProperties() {
    // base
    this.nodeProperties.name = '_properties';
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

    // layout
    this.nodeProperties.layoutAlign = 'STRETCH';

    return this.nodeProperties
  }

  makeNode(type) {
    // base
    this.node.name = '_captions';
    this.node.fills = [];

    // layout
    this.node.layoutMode = 'VERTICAL';
    this.node.primaryAxisSizingMode = 'FIXED';
    this.node.counterAxisSizingMode = 'FIXED';
    this.node.primaryAxisAlignItems = 'SPACE_BETWEEN';
    this.node.layoutAlign = 'STRETCH';
    this.node.layoutGrow = 1;

    if (type === 'SAMPLE') {
      this.nodeName.remove();
      this.node.appendChild(this.makeNodeScale());
      this.node.appendChild(this.makeNodeProperties());
    } else if (type === 'NAME') {
      this.nodeScale.remove();
      this.nodeProperties.remove();
      this.node.appendChild(this.makeName())
    };

    return this.node
  }

}
