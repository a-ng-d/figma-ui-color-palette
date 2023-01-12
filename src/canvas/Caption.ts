import chroma from 'chroma-js';
import { APCAcontrast, sRGBtoY } from 'apca-w3';

export default class Caption {

  name: string;
  rgb: Array<number>;
  hex: string;
  lch: Array<number>;
  nodeTop: FrameNode;
  nodeBottom: FrameNode;
  nodeScale: TextNode;
  nodeProperties: TextNode;
  nodeName: TextNode;
  nodeTag: FrameNode;
  nodeText: TextNode;
  node: FrameNode;

  constructor(name, rgb) {
    this.name = name;
    this.rgb = rgb;
    this.hex = chroma(rgb).hex();
    this.lch = chroma(rgb).lch();
    this.nodeTop = figma.createFrame();
    this.nodeBottom = figma.createFrame();
    this.nodeScale = figma.createText();
    this.nodeProperties = figma.createText();
    this.nodeName = figma.createText();
    this.nodeTag = figma.createFrame();
    this.nodeText = figma.createText();
    this.node = figma.createFrame()
  }

  getContrast() {
    return Math.max(chroma.contrast(this.rgb, '#FFF'), chroma.contrast(this.rgb, '#000'))
  }

  getAPCAConstrast() {
    return chroma.contrast(this.rgb, '#FFF') < chroma.contrast(this.rgb, '#000') ? APCAcontrast(sRGBtoY([0, 0, 0, 1]), sRGBtoY(this.rgb)) : APCAcontrast(sRGBtoY([255, 255, 255, 1]), sRGBtoY(this.rgb))
  }

  getLevel() {
    return this.getContrast() < 4.5 ? 'A'
         : this.getContrast() >= 4.5 && this.getContrast() < 7 ? 'AA'
         : 'AAA'
  }

  getCaptionColor() {
    return chroma.contrast(this.rgb, '#FFF') < chroma.contrast(this.rgb, '#000') ? [0, 0, 0] : [1, 1, 1]
  }

  doContent() {
    return `${this.hex.toUpperCase()}\nR ${Math.floor(this.rgb[0])} • G ${Math.floor(this.rgb[1])} • B ${Math.floor(this.rgb[2])}\nL ${Math.floor(this.lch[0])} • C ${Math.floor(this.lch[1])} • H ${Math.floor(this.lch[2])}\n${this.getLevel()} • ${this.getContrast().toFixed(2)} : 1\nLc ${this.getAPCAConstrast().toFixed(1)}`
  }

  makeNodeTop() {
    // base
    this.nodeTop.name = '_top';
    this.nodeTop.fills = [];

    // layout
    this.nodeTop.layoutMode = 'HORIZONTAL';
    this.nodeTop.primaryAxisSizingMode = 'FIXED';
    this.nodeTop.counterAxisSizingMode = 'AUTO';
    this.nodeTop.layoutAlign = 'STRETCH';

    return this.nodeTop
  }

  makeNodeBottom() {
    // base
    this.nodeBottom.name = '_bottom';
    this.nodeBottom.fills = [];

    // layout
    this.nodeBottom.layoutMode = 'VERTICAL';
    this.nodeBottom.primaryAxisSizingMode = 'AUTO';
    this.nodeBottom.counterAxisSizingMode = 'FIXED';
    this.nodeBottom.layoutAlign = 'STRETCH';

    return this.nodeBottom
  }

  makeNodeTag(property, content, fontSize) {
    // base
    this.nodeTag.name = property;
    this.nodeTag.fills = [{
      type: 'SOLID',
      opacity: .5,
      color: {
        r: 1,
        g: 1,
        b: 1
      }
    }];

    // layout
    this.nodeTag.layoutMode = 'HORIZONTAL';
    this.nodeTag.horizontalPadding = 2;
    this.nodeTag.verticalPadding = 4;
    this.nodeTag.itemSpacing = 4;

    this.node.appendChild(this.makeNodeText(content, fontSize));

    return this.nodeTag
  }

  makeNodeText(content, fontSize) {
    // base
    this.nodeText.name = '_text';
    this.nodeText.characters = content;
    this.nodeText.fontName = {
      family: 'Roboto Mono',
      style: 'Medium'
    };
    this.nodeText.fontSize = fontSize;
    this.nodeText.fills = [{
      type: 'SOLID',
      color: {
        r: 0,
        g: 0,
        b: 0
      }
    }];

    return this.nodeText
  }

  makeName(fontSize) {
    this.nodeName.name = '_color-name';
    this.nodeName.characters = this.name;
    this.nodeName.fontName = {
      family: 'Roboto Mono',
      style: 'Medium'
    };
    this.nodeName.fontSize = fontSize;
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

  makeNode(type, fontSize) {
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
    }
    else if (type === 'NAME') {
      this.nodeScale.remove();
      this.nodeProperties.remove();
      this.node.appendChild(this.makeName(fontSize))
    };

    return this.node
  }

}
