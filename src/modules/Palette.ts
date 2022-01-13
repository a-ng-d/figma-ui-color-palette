import chroma from 'chroma-js';
import Colors from './Colors';

export default class Palette {

  name: string;
  min: number;
  max: number;
  scale: string;
  colors: Array<Object>;
  captions: boolean;
  children: any;
  node: FrameNode;

  constructor(min, max, scale, captions) {
    this.name = 'Awesome Color Palette';
    this.min = min;
    this.max = max;
    this.scale = scale;
    this.colors = [];
    this.captions = captions;
    this.children = null;
    this.node = figma.createFrame()
  }

  makeNode() {
    this.node.layoutMode = 'VERTICAL';
    this.node.primaryAxisSizingMode = 'AUTO';
    this.node.counterAxisSizingMode = 'AUTO';
    this.node.name = this.name;
    this.node.paddingTop = this.node.paddingRight = this.node.paddingBottom = this.node.paddingLeft = 32;
    this.node.cornerRadius = 16;
    this.node.setPluginData('min', this.min.toString());
    this.node.setPluginData('max', this.max.toString());
    this.node.setRelaunchData({ edit: '' });
    this.node.setPluginData('scale', JSON.stringify(this.scale));
    if (this.captions)
      this.node.setPluginData('captions', 'hasCaptions')
    else
      this.node.setPluginData('captions', 'hasNotCaptions');

    figma.currentPage.selection.forEach(element => {

      let fills = element['fills'].filter(fill => fill.type === 'SOLID');

      if (fills.length != 0) {
        fills.forEach(fill => {
          const obj = {};
          obj['name'] = element.name;
          obj['rgb'] = fill.color;
          this.colors.push(obj)
        })
      } else
        figma.notify(`The layer '${element.name}' must get at least one solid color`)

    });

    this.node.appendChild(new Colors(this).makeNode());

    this.node.setPluginData('colors', JSON.stringify(this.colors));
    return this.node
  }

}
