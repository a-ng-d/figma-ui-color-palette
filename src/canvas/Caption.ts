import chroma from 'chroma-js';
import { APCAcontrast, sRGBtoY, fontLookupAPCA } from 'apca-w3';
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
  nodeContrastScores: FrameNode;
  nodeProperties: TextNode;
  node: FrameNode;

  constructor(name: string, rgb: Array<number>) {
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
    this.node = figma.createFrame()
  }

  getContrast(textColor: string) {
    return chroma.contrast(this.rgb, textColor === 'BLACK' ? '#000' : '#FFF')
  }

  getAPCAContrast(textColor: string) {
    return APCAcontrast(sRGBtoY(textColor === 'BLACK' ? [0, 0, 0, 1] : [255, 255, 255, 1]), sRGBtoY(this.rgb))
  }

  getLevel(textColor: string) {
    return this.getContrast(textColor) < 4.5 ? 'A'
         : this.getContrast(textColor) >= 4.5 && this.getContrast(textColor) < 7 ? 'AA'
         : 'AAA'
  }

  getMinFontSizes(textColor: string) {
    return fontLookupAPCA(this.getAPCAContrast(textColor))
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

    // insert
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
    this.nodeScale.counterAxisSizingMode = 'AUTO';
    this.nodeScale.layoutAlign = 'STRETCH';

    // insert
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

    // insert
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

    // insert
    this.nodeContrastScores.appendChild(new Tag('_wcag21-black', `${this.getContrast('BLACK').toFixed(2)} • ${this.getLevel('BLACK')}`, 8).makeNodeTag('BLACK'));
    this.nodeContrastScores.appendChild(new Tag('_wcag21-white', `${this.getContrast('WHITE').toFixed(2)} • ${this.getLevel('WHITE')}`, 8).makeNodeTag('WHITE'));
    this.nodeContrastScores.appendChild(new Tag('_apca-black', `Lc ${this.getAPCAContrast('BLACK').toFixed(1)} • ${this.getMinFontSizes('BLACK')[4]}pt (400)`, 8).makeNodeTag('BLACK'));
    this.nodeContrastScores.appendChild(new Tag('_apca-white', `Lc ${this.getAPCAContrast('WHITE').toFixed(1)} • ${this.getMinFontSizes('WHITE')[4]}pt (400)`, 8).makeNodeTag('WHITE'));

    return this.nodeContrastScores
  }

  makeNode(type: string) {
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

    // insert
    if (type === 'SAMPLE') {
      this.node.appendChild(this.makeNodeTop());
        this.nodeTop.appendChild(this.makeNodeScale());
        this.nodeTop.appendChild(this.makeNodeBasics());
      this.node.appendChild(this.makeNodeBottom());
    }
    else if (type === 'NAME') {
      this.node.appendChild(this.makeNodeTop());
        this.nodeTop.appendChild(new Tag('_color-name', this.name, 10).makeNodeTag())
    }
    else if (type === 'TITLE') {
      this.node.appendChild(this.makeNodeTop());
        this.nodeTop.appendChild(new Tag('_title', this.name, 16).makeNodeTag())
    };

    return this.node
  }

}
