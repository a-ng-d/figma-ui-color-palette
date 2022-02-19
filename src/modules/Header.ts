import Sample from './Sample';

export default class Header {

  parent: any;
  node: FrameNode;

  constructor(parent) {
    this.parent = parent;
    this.node = figma.createFrame()
  }

  makeNode() {
    // base
    this.node.name = 'header';
    this.node.resize(100, 48);
    this.node.fills = [];
    this.node.locked = true;

    // layout
    this.node.layoutMode = 'HORIZONTAL';
    this.node.primaryAxisSizingMode = 'FIXED';
    this.node.counterAxisSizingMode = 'AUTO';
    this.node.layoutAlign = 'STRETCH';

    // insert
    this.node.appendChild(new Sample('Colors', null, [255, 255, 255], this.parent.captions).makeName())
    Object.values(this.parent.scale).reverse().forEach(lightness => {
      this.node.appendChild(new Sample(Object.keys(this.parent.scale).find(key => this.parent.scale[key] === lightness).substr(10), null, [255, 255, 255], this.parent.captions).makeName())
    });

    return this.node
  }

}
