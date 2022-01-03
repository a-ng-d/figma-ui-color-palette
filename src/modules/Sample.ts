import Caption from './Caption';

export default class Sample {

  name: string;
  width: number;
  height: number;
  rgb: Array<number>;
  caption: boolean;
  node: FrameNode;

  constructor(name, width, height, rgb, caption) {
    this.name = name;
    this.width = width;
    this.height = height;
    this.rgb = rgb;
    this.caption = caption;
    this.node = figma.createFrame();
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

    if (this.caption == true)
      this.node.appendChild(new Caption(this.name, this.rgb).makeNode());

    return this.node
  }

}
