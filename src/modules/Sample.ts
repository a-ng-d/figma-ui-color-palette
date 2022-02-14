import Caption from './Caption';

export default class Sample {

  name: string;
  scale: number;
  width: number;
  height: number;
  rgb: Array<number>;
  captions: boolean;
  node: FrameNode;
  children: any;

  constructor(name, scale, width, height, rgb, captions) {
    this.name = name;
    this.scale = scale;
    this.width = width;
    this.height = height;
    this.rgb = rgb;
    this.captions = captions;
    this.node = figma.createFrame();
    this.children = null
  }

  makeNode() {
    this.node.name = this.name;
    this.node.resize(this.width, this.height);
    this.node.fills = [{
      type: 'SOLID',
      color: {
        r: this.rgb[0] / 255,
        g: this.rgb[1] / 255,
        b: this.rgb[2] / 255
      }
    }];
    this.node.layoutMode = 'HORIZONTAL';
    this.node.paddingTop = this.node.paddingRight = this.node.paddingBottom = this.node.paddingLeft = 8;
    this.node.primaryAxisSizingMode = 'FIXED';
    this.node.locked = true;
    this.children = new Caption(this.scale, this.rgb).makeNode();
    this.node.appendChild(this.children);

    if (!this.captions)
      this.children.visible = false
    else
      this.children.visible = true

    return this.node
  }

}
