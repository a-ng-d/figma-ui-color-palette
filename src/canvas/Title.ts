import Sample from './Sample';

export default class Title {

  text: string;
  parent: any;
  node: FrameNode;

  constructor(text, parent) {
    this.text = text;
    this.parent = parent;
    this.node = figma.createFrame()
  }

  makeNode() {
    // base
    this.node.name = '_title';
    this.node.resize(100, 48);
    this.node.fills = [];

    // layout
    this.node.layoutMode = 'HORIZONTAL';
    this.node.primaryAxisSizingMode = 'FIXED';
    this.node.counterAxisSizingMode = 'AUTO';
    this.node.layoutAlign = 'STRETCH';

    // insert
    this.node.appendChild(new Sample(this.text, null, [255, 255, 255], this.parent.captions).makeName('relative', 100, 48))

    return this.node
  }

}
