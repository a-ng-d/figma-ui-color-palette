export default class Tag {

  name: string;
  content: string;
  fontSize: number;
  nodeTag: FrameNode;
  nodeText: TextNode;
  nodeIndicator: EllipseNode;

  constructor(name, content, fontSize) {
    this.name = name;
    this.content = content;
    this.fontSize = fontSize;
    this.nodeTag = figma.createFrame();
    this.nodeText = figma.createText();
    this.nodeIndicator = figma.createEllipse()
  }

  makeNodeTag(hasBlackIndicator: boolean = false, hasWhiteIndicator: boolean = false) {
    // base
    this.nodeTag.name = this.name;
    this.nodeTag.fills = [{
      type: 'SOLID',
      opacity: .5,
      color: {
        r: 1,
        g: 1,
        b: 1
      }
    }];
    this.nodeTag.cornerRadius = 16;

    // layout
    this.nodeTag.layoutMode = 'HORIZONTAL';
    this.nodeTag.primaryAxisSizingMode = 'AUTO';
    this.nodeTag.counterAxisSizingMode = 'AUTO';
    this.nodeTag.horizontalPadding = 4;
    this.nodeTag.verticalPadding = 2;
    this.nodeTag.itemSpacing = 4;

    hasBlackIndicator ? this.nodeTag.appendChild(this.makeNodeIndicator('BLACK')) : null;
    hasWhiteIndicator ? this.nodeTag.appendChild(this.makeNodeIndicator('WHITE')) : null;
    this.nodeTag.appendChild(this.makeNodeText());

    return this.nodeTag
  }

  makeNodeText() {
    // base
    this.nodeText.name = '_text';
    this.nodeText.characters = this.content;
    this.nodeText.fontName = {
      family: 'Roboto Mono',
      style: 'Medium'
    };
    this.nodeText.fontSize = this.fontSize;
    this.nodeText.fills = [{
      type: 'SOLID',
      color: {
        r: 0,
        g: 0,
        b: 0
      }
    }];

    return this.nodeText
  }

  makeNodeIndicator(textColor: string) {
    // base
    this.nodeIndicator.name = '_indicator';
    this.nodeIndicator.resize(8, 8);
    this.nodeIndicator.fills = [{
      type: 'SOLID',
      color: {
        r: textColor === 'WHITE' ? 1 : 0,
        g: textColor === 'WHITE' ? 1 : 0,
        b: textColor === 'WHITE' ? 1 : 0
      }
    }];

    return this.nodeIndicator
  }

}
