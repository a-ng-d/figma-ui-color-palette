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
    this.node.name = '_header';
    this.node.resize(100, 48);
    this.node.fills = [];

    // layout
    this.node.layoutMode = 'HORIZONTAL';
    this.node.primaryAxisSizingMode = 'AUTO';
    this.node.counterAxisSizingMode = 'AUTO';

    // insert
    this.node.appendChild(new Sample('Colors', null, [255, 255, 255], this.parent.captions).makeName('absolute', 140, 48, 10))
    Object.values(this.parent.scale).reverse().forEach(lightness => {
      this.node.appendChild(new Sample(Object.keys(this.parent.scale).find(key => this.parent.scale[key] === lightness).substr(10), null, [255, 255, 255], this.parent.captions).makeName('absolute', 140, 48, 10))
    });

    return this.node
  }

}
