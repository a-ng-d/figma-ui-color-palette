import Caption from './Caption';

export default class Sample {

  name: string;
  scale: string;
  width: number;
  height: number;
  rgb: Array<number>;
  captions: boolean;
  node: FrameNode;
  children: any;

  constructor(name, scale, width, rgb, captions) {
    this.name = name;
    this.scale = scale;
    this.width = width;
    this.rgb = rgb;
    this.captions = captions;
    this.node = figma.createFrame();
    this.children = null
  }

  makeName() {
    // base
    this.node.name = this.name;
    this.node.fills = [{
      type: 'SOLID',
      color: {
        r: this.rgb[0] / 255,
        g: this.rgb[1] / 255,
        b: this.rgb[2] / 255
      }
    }];

    // layout
    this.node.layoutMode = 'HORIZONTAL';
    this.node.paddingTop = this.node.paddingRight = this.node.paddingBottom = this.node.paddingLeft = 8;
    this.node.primaryAxisSizingMode = 'AUTO';
    this.node.layoutAlign = 'STRETCH';
    this.node.layoutGrow = 1;

    // insert
    this.children = new Caption(this.name, this.rgb).makeNode('NAME');
    this.node.appendChild(this.children);

    return this.node
  }

  makeScale() {
    // base
    this.node.name = this.scale;
    this.node.fills = [{
      type: 'SOLID',
      color: {
        r: this.rgb[0] / 255,
        g: this.rgb[1] / 255,
        b: this.rgb[2] / 255
      }
    }];

    // layout
    this.node.layoutMode = 'HORIZONTAL';
    this.node.paddingTop = this.node.paddingRight = this.node.paddingBottom = this.node.paddingLeft = 8;
    this.node.primaryAxisSizingMode = 'AUTO';
    this.node.layoutGrow = 1;
    this.node.layoutAlign = 'STRETCH';

    // insert
    this.children = new Caption(this.scale, this.rgb).makeNode('SAMPLE');
    this.node.appendChild(this.children);

    if (!this.captions)
      this.children.visible = false
    else
      this.children.visible = true

    return this.node
  }

}
