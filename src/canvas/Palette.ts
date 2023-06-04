import type {
  ColorConfiguration,
  PresetConfiguration,
  TextColorsThemeHexModel,
  PaletteNode,
  ScaleConfiguration,
} from '../utils/types'
import Colors from './Colors'

export default class Palette {
  paletteName: string
  name: string
  scale: ScaleConfiguration
  colors: Array<ColorConfiguration>
  properties: boolean
  preset: PresetConfiguration
  textColorsTheme: TextColorsThemeHexModel
  view: string
  algorithmVersion: string
  children: PaletteNode
  node: FrameNode

  constructor(
    name: string,
    scale: ScaleConfiguration,
    properties: boolean,
    preset: PresetConfiguration,
    textColorsTheme: TextColorsThemeHexModel,
    view: string,
    algorithmVersion: string
  ) {
    this.paletteName = name
    this.name = `${name === '' ? 'UI Color Palette' : name}﹒${preset.name}﹒${view === 'PALETTE' ? 'Palette' : 'Sheet'}`
    this.scale = scale
    this.colors = []
    this.properties = properties
    this.preset = preset
    this.algorithmVersion = algorithmVersion
    this.textColorsTheme = textColorsTheme
    this.view = view
    this.children = null
    this.node = figma.createFrame()
  }

  makeNode() {
    // base
    this.node.name = this.name
    this.node.resize(1640, 100)
    this.node.cornerRadius = 16

    // layout
    this.node.layoutMode = 'VERTICAL'
    this.node.primaryAxisSizingMode = 'AUTO'
    this.node.counterAxisSizingMode = 'AUTO'
    this.node.paddingTop =
      this.node.paddingRight =
      this.node.paddingBottom =
      this.node.paddingLeft =
        32

    // data
    this.node.setRelaunchData({ edit: '' })
    this.node.setPluginData('name', this.paletteName)
    this.node.setPluginData('scale', JSON.stringify(this.scale))
    this.node.setPluginData('preset', JSON.stringify(this.preset))
    this.properties
      ? this.node.setPluginData('properties', 'hasProperties')
      : this.node.setPluginData('properties', 'hasNotProperties')
    this.node.setPluginData(
      'textColorsTheme',
      JSON.stringify(this.textColorsTheme)
    )
    this.node.setPluginData('view', this.view)
    this.node.setPluginData('algorithmVersion', this.algorithmVersion)

    // insert
    figma.currentPage.selection.forEach((element) => {
      const fills = element['fills'].filter((fill) => fill.type === 'SOLID')

      if (fills.length != 0) {
        fills.forEach((fill) =>
          this.colors.push({
            name: element.name,
            rgb: fill.color,
            id: undefined,
            oklch: false,
            hueShifting: 0,
          })
        )
      } else
        figma.notify(
          `The layer '${element.name}' must get at least one solid color`
        )
    })

    this.colors.sort((a, b) => {
      if (a.name.localeCompare(b.name) > 0) return 1
      else if (a.name.localeCompare(b.name) < 0) return -1
      else return 0
    })

    this.node.appendChild(new Colors(this as PaletteNode, this.node).makeNode())

    this.node.setPluginData('colors', JSON.stringify(this.colors))
    return this.node
  }

  changeName(name: string) {
    this.node.name = name
  }
}
