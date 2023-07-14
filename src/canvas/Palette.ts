import type {
  ColorConfiguration,
  PresetConfiguration,
  TextColorsThemeHexModel,
  PaletteNode,
  ScaleConfiguration,
  ThemeConfiguration,
} from '../utils/types'
import Colors from './Colors'
import { locals, lang } from '../content/locals'

export default class Palette {
  name: string
  frameName: string
  scale: ScaleConfiguration
  colors: Array<ColorConfiguration>
  colorSpace: string
  themes: Array<ThemeConfiguration>
  preset: PresetConfiguration
  view: string
  textColorsTheme: TextColorsThemeHexModel
  algorithmVersion: string
  children: PaletteNode
  node: FrameNode

  constructor(
    name: string,
    preset: PresetConfiguration,
    scale: ScaleConfiguration,
    colorSpace: string,
    view: string,
    textColorsTheme: TextColorsThemeHexModel,
    algorithmVersion: string
  ) {
    this.name = name
    this.frameName = `${name === '' ? locals[lang].name : name}﹒${
      preset.name
    }﹒${colorSpace} ${view.includes('PALETTE') ? 'Palette' : 'Sheet'}`
    this.preset = preset
    this.scale = scale
    this.colors = []
    this.colorSpace = colorSpace
    this.themes = [{
      name: locals[lang].themes.switchTheme.defaultTheme,
      description: '',
      scale: this.scale,
      paletteBackground: '#FFFFFF',
      isEnabled: true,
      id: '00000000-0000-0000-0000-000000000000'
    }],
    this.view = view
    this.algorithmVersion = algorithmVersion
    this.textColorsTheme = textColorsTheme
    this.children = null
  }

  makeNode = () => {
    // base
    this.node = figma.createFrame()
    this.node.name = this.frameName
    this.node.resize(1640, 100)
    this.node.cornerRadius = 16

    // layout
    this.node.layoutMode = 'VERTICAL'
    this.node.layoutSizingHorizontal = 'HUG'
    this.node.layoutSizingVertical = 'HUG'
    this.node.paddingTop =
      this.node.paddingRight =
      this.node.paddingBottom =
      this.node.paddingLeft =
        32

    // data
    this.node.setRelaunchData({ edit: '' })
    this.node.setPluginData('name', this.name)
    this.node.setPluginData('preset', JSON.stringify(this.preset))
    this.node.setPluginData('scale', JSON.stringify(this.scale))
    this.node.setPluginData('colorSpace', this.colorSpace)
    this.node.setPluginData('themes', JSON.stringify(this.themes))
    this.node.setPluginData('view', this.view)
    this.node.setPluginData(
      'textColorsTheme',
      JSON.stringify(this.textColorsTheme)
    )
    this.node.setPluginData('algorithmVersion', this.algorithmVersion)

    // insert
    figma.currentPage.selection.forEach((element) => {
      if (
        element.type != 'CONNECTOR' &&
        element.type != 'GROUP' &&
        element.type != 'EMBED'
      ) {
        const fills = element['fills'].filter((fill) => fill.type === 'SOLID')

        if (fills.length != 0) {
          fills.forEach((fill) =>
            this.colors.push({
              name: element.name,
              description: '',
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
      }
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
}
