import chroma from 'chroma-js';
import { APCAcontrast, sRGBtoY } from 'apca-w3';
import Tag from './Tag';

export default class Caption {

  name: string;
  rgb: Array<number>;
  hex: string;
  lch: Array<number>;
  nodeTop: FrameNode;
  nodeBottom: FrameNode;
  nodeScale: FrameNode;
  nodeBasics: FrameNode;
  nodeProperties: TextNode;
  nodeName: TextNode;
  node: FrameNode;

  constructor(name, rgb) {
    this.name = name;
    this.rgb = rgb;
    this.hex = chroma(rgb).hex();
    this.lch = chroma(rgb).lch();
    this.nodeTop = figma.createFrame();
    this.nodeBottom = figma.createFrame();
    this.nodeScale = figma.createFrame();
    this.nodeBasics = figma.createFrame();
    this.nodeContrastScores = figma.createFrame();
    this.nodeProperties = figma.createText();
    this.nodeName = figma.createText();
    this.node = figma.createFrame()
  }

  getContrast(textColor: string) {
    return chroma.contrast(this.rgb, textColor === 'BLACK' ? '#000' : '#FFF').toFixed(2)
  }

  getAPCAConstrast(textColor: string) {
    return APCAcontrast(sRGBtoY(textColor === 'BLACK' ? [0, 0, 0, 1] : [1, 1, 1, 1]), sRGBtoY(this.rgb)).toFixed(1)
  }

  getLevel(textColor: string) {
    return this.getContrast(textColor) < 4.5 ? 'A'
         : this.getContrast(textColor) >= 4.5 && this.getContrast(textColor) < 7 ? 'AA'
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

    this.nodeTop.appendChild(this.makeNodeScale());
    this.nodeTop.appendChild(this.makeNodeBasics());

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

    this.nodeBottom.appendChild(this.makeNodeContrastScores());

    return this.nodeBottom
  }

  makeNodeScale() {
    // base
    this.nodeScale.name = '_scale';
    this.nodeScale.fills = [];

    // layout
    this.nodeScale.layoutMode = 'VERTICAL';
    this.nodeScale.primaryAxisSizingMode = 'AUTO';
    this.nodeScale.counterAxisSizingMode = 'FIXED';
    this.nodeScale.layoutAlign = 'STRETCH';

    this.nodeScale.appendChild(new Tag('_scale', this.name, 10).makeNodeTag());

    return this.nodeScale
  }

  makeNodeBasics() {
    // base
    this.nodeBasics.name = '_basics';
    this.nodeBasics.fills = [];

    // layout
    this.nodeBasics.layoutMode = 'VERTICAL';
    this.nodeBasics.primaryAxisSizingMode = 'AUTO';
    this.nodeBasics.counterAxisSizingMode = 'FIXED';
    this.nodeBasics.counterAxisAlignItems = 'MAX';
    this.nodeBasics.layoutAlign = 'STRETCH';
    this.nodeBasics.itemSpacing = 4;

    this.nodeBasics.appendChild(new Tag('_hex', this.hex.toUpperCase(), 8).makeNodeTag());
    this.nodeBasics.appendChild(new Tag('_rgb', `R ${Math.floor(this.rgb[0])} • G ${Math.floor(this.rgb[1])} • B ${Math.floor(this.rgb[2])}`, 8).makeNodeTag());
    this.nodeBasics.appendChild(new Tag('_lch', `L ${Math.floor(this.lch[0])} • C ${Math.floor(this.lch[1])} • H ${Math.floor(this.lch[2])}`, 8).makeNodeTag());

    return this.nodeBasics
  }

  makeNodeContrastScores() {
    // base
    this.nodeContrastScores.name = '_contrast-scores';
    this.nodeContrastScores.fills = [];

    // layout
    this.nodeContrastScores.layoutMode = 'VERTICAL';
    this.nodeContrastScores.primaryAxisSizingMode = 'AUTO';
    this.nodeContrastScores.counterAxisSizingMode = 'FIXED';
    this.nodeContrastScores.layoutAlign = 'STRETCH';
    this.nodeContrastScores.itemSpacing = 4;

    this.nodeContrastScores.appendChild(new Tag('_wcag21-black', `${this.getContrast('BLACK')} • ${this.getLevel('BLACK')}`, 8).makeNodeTag(true, false));
    this.nodeContrastScores.appendChild(new Tag('_wcag21-white', `${this.getContrast('WHITE')} • ${this.getLevel('WHITE')}`, 8).makeNodeTag(false, true));
    this.nodeContrastScores.appendChild(new Tag('_apca-black', `Lc ${this.getAPCAConstrast('BLACK')}`, 8).makeNodeTag(true, false));
    this.nodeContrastScores.appendChild(new Tag('_apca-white', `Lc ${this.getAPCAConstrast('WHITE')}`, 8).makeNodeTag(false, true));

    return this.nodeContrastScores
  }

  makeName(fontSize: number) {
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

  /*makeNodeScale() {
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
  }*/

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
