import chroma from 'chroma-js';
import Colors from './Colors';

export default class Palette {

  name: string;
  scale: string;
  colors: Array<Object>;
  captions: boolean;
  preset: string;
  children: any;
  node: FrameNode;

  constructor(min, max, scale, captions, preset) {
    this.name = 'UI Color Palette';
    this.scale = scale;
    this.colors = [];
    this.captions = captions;
    this.preset = preset;
    this.children = null;
    this.node = figma.createFrame()
  }

  makeNode() {
    // base
    this.node.name = this.name;
    this.node.resize(1640, 100);
    this.node.cornerRadius = 16;

    // layout
    this.node.layoutMode = 'VERTICAL';
    this.node.primaryAxisSizingMode = 'AUTO';
    this.node.counterAxisSizingMode = 'FIXED';
    this.node.paddingTop = this.node.paddingRight = this.node.paddingBottom = this.node.paddingLeft = 32;

    // data
    this.node.setRelaunchData({ edit: '' });
    this.node.setPluginData('scale', JSON.stringify(this.scale));
    this.node.setPluginData('preset', JSON.stringify(this.preset));
    if (this.captions)
      this.node.setPluginData('captions', 'hasCaptions')
    else
      this.node.setPluginData('captions', 'hasNotCaptions');

    // insert
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
