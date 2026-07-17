import {
  BaseConfiguration,
  ThemeConfiguration,
  ViewConfiguration,
} from '@yelbolt/engine-ui-color-palette'
import { tolgee } from '..'
import Sample from './Sample'

export default class Header {
  private base: BaseConfiguration
  private theme: ThemeConfiguration
  private view: ViewConfiguration
  private sampleSize: number
  node: FrameNode

  constructor({
    base,
    theme,
    view,
    size,
  }: {
    base: BaseConfiguration
    theme: ThemeConfiguration
    view: ViewConfiguration
    size: number
  }) {
    this.base = base
    this.theme = theme
    this.view = view
    this.sampleSize = size
    this.node = this.makeNode()
  }

  makeNode = () => {
    // Base
    this.node = figma.createFrame()
    this.node.name = '_header'
    this.node.resize(100, this.sampleSize / 4)
    this.node.fills = []

    // Layout
    this.node.layoutMode = 'HORIZONTAL'
    this.node.layoutSizingHorizontal = 'HUG'
    this.node.layoutSizingVertical = 'HUG'

    // Insert
    this.node.appendChild(
      new Sample({
        name: tolgee.t('paletteProperties.sourceColors'),
        rgb: [255, 255, 255],
        colorSpace: this.base.colorSpace,
        visionSimulationMode: this.theme.visionSimulationMode,
        view: this.view,
        textColorsTheme: this.theme.textColorsTheme,
      }).makeNodeName({
        mode: 'FIXED',
        width: this.sampleSize,
        height: 48,
      })
    )
    if (this.view === 'PALETTE' || this.view === 'PALETTE_WITH_PROPERTIES')
      Object.keys(this.theme.scale)
        .reverse()
        .forEach((key) => {
          this.node?.appendChild(
            new Sample({
              name: key,
              rgb: [255, 255, 255],
              colorSpace: this.base.colorSpace,
              visionSimulationMode: this.theme.visionSimulationMode,
              view: this.view,
              textColorsTheme: this.theme.textColorsTheme,
            }).makeNodeName({
              mode: 'FIXED',
              width: this.sampleSize,
              height: 48,
            })
          )
        })

    return this.node
  }
}
