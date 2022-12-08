import chroma from 'chroma-js';
import Colors from './Colors';

interface UIColors {
  name: string,
  rgb: {
    r: number,
    g: number,
    b: number
  },
  id: string | undefined,
  oklch: boolean,
  hueShifting: number
}

export default class Palette {

  paletteName: string;
  name: string;
  scale: string;
  colors: Array<UIColors>;
  captions: boolean;
  preset: string;
  children: any;
  node: FrameNode;

  constructor(name, scale, captions, preset) {
    this.paletteName = name;
    this.name = `${name === '' ? 'UI Color Palette' : name}﹒${preset.name}`;
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
    this.node.counterAxisSizingMode = 'AUTO';
    this.node.paddingTop = this.node.paddingRight = this.node.paddingBottom = this.node.paddingLeft = 32;

    // data
    this.node.setRelaunchData({ edit: '' });
    this.node.setPluginData('name', this.paletteName);
    this.node.setPluginData('scale', JSON.stringify(this.scale));
    this.node.setPluginData('preset', JSON.stringify(this.preset));
    this.captions ? this.node.setPluginData('captions', 'hasCaptions') : this.node.setPluginData('captions', 'hasNotCaptions');

    // insert
    figma.currentPage.selection.forEach(element => {

      let fills = element['fills'].filter(fill => fill.type === 'SOLID');

      if (fills.length != 0) {
        fills.forEach(fill =>
          this.colors.push({
            name: element.name,
            rgb: fill.color,
            id: undefined,
            oklch: false,
            hueShifting: 0
          })
        )
      } else
        figma.notify(`The layer '${element.name}' must get at least one solid color`)

    });

    this.colors.sort((a, b) => {
      if (a.name.localeCompare(b.name) > 0)
        return 1
      else if (a.name.localeCompare(b.name) < 0)
        return -1
      else
        return 0
   })

    this.node.appendChild(new Colors(this).makeNode());

    this.node.setPluginData('colors', JSON.stringify(this.colors));
    return this.node
  }

  changeName(name) {
    this.node.name = name
  }

}
