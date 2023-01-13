import Caption from './Caption';

export default class Sample {

  name: string;
  scale: string;
  rgb: Array<number>;
  captions: boolean;
  node: FrameNode;
  children: any;

  constructor(name, scale, rgb, captions) {
    this.name = name;
    this.scale = scale;
    this.rgb = rgb;
    this.captions = captions;
    this.node = figma.createFrame();
    this.children = null
  }

  makeName(mode, width, height, fontSize) {
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
    this.node.counterAxisSizingMode = 'FIXED';
    if (mode === 'relative') {
      this.node.primaryAxisSizingMode = 'AUTO';
      this.node.layoutAlign = 'STRETCH';
      this.node.layoutGrow = 1;
    }
    else if (mode === 'absolute') {
      this.node.resize(width, height);
      this.node.primaryAxisSizingMode = 'FIXED';
    }


    // insert
    this.children = new Caption(this.name, this.rgb).makeNode('NAME', fontSize);
    this.node.appendChild(this.children);

    return this.node
  }

  makeScale(width, height, fontSize) {
    // base
    this.node.name = this.scale;
    this.node.resize(width, height);
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
    this.node.primaryAxisSizingMode = 'FIXED';
    this.node.counterAxisSizingMode = 'FIXED';

    // insert
    this.children = new Caption(this.scale, this.rgb).makeNode('SAMPLE', fontSize);
    this.node.appendChild(this.children);

    if (!this.captions)
      this.children.visible = false
    else
      this.children.visible = true

    return this.node
  }

}
