import { Message, texts } from '@a_ng_d/figmug-ui'
import React from 'react'

import { locals } from '../../content/locals'
import type {
  ColorConfiguration,
  ExtractOfPaletteConfiguration,
  Language,
  ThemeConfiguration,
} from '../../utils/types'
import PaletteItem from '../components/PaletteItem'

interface PalettesListProps {
  paletteLists: Array<ExtractOfPaletteConfiguration>
  lang: Language
}

export default class PalettesList extends React.Component<PalettesListProps> {
  hasPalettes: boolean

  constructor(props: PalettesListProps) {
    super(props)
    this.hasPalettes = true
  }

  // Lifecycle
  componentDidMount = () =>
    parent.postMessage({ pluginMessage: { type: 'GET_PALETTES' } }, '*')

  shouldComponentUpdate(prevProps: Readonly<PalettesListProps>): boolean {
    console.log(prevProps.paletteLists.length, this.props.paletteLists.length)
    if (prevProps.paletteLists.length > 0) this.hasPalettes = true
    else this.hasPalettes = false
    return true
  }

  // Direct actions
  getImageSrc = (screenshot: Uint8Array | null) => {
    if (screenshot !== null) {
      const blob = new Blob([screenshot], {
        type: 'image/png',
      })
      return URL.createObjectURL(blob)
    } else return ''
  }

  getPaletteMeta = (
    colors: Array<ColorConfiguration>,
    themes: Array<ThemeConfiguration>
  ) => {
    const colorsNumber = colors.length,
      themesNumber = themes.filter(
        (theme) => theme.type === 'custom theme'
      ).length

    let colorLabel: string, themeLabel: string

    if (colorsNumber > 1)
      colorLabel = locals[this.props.lang].actions.sourceColorsNumber.several
    else colorLabel = locals[this.props.lang].actions.sourceColorsNumber.single

    if (themesNumber > 1)
      themeLabel = locals[this.props.lang].actions.colorThemesNumber.several
    else themeLabel = locals[this.props.lang].actions.colorThemesNumber.single

    return `${colorsNumber} ${colorLabel}, ${themesNumber} ${themeLabel}`
  }

  onSelectPalette = (
    e: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement>
  ) => {
    e.preventDefault()
    parent.postMessage(
      {
        pluginMessage: {
          type: 'JUMP_TO_PALETTE',
          id: (e.currentTarget as HTMLElement).dataset.id,
        },
      },
      '*'
    )
  }

  // Templates
  PalettesList = () => {
    return (
      <ul className="rich-list">
        <div
          className={`${texts.type} ${texts['type--secondary']} type rich-list__title`}
        >
          {locals[this.props.lang].palettesList.title}
        </div>
        {this.props.paletteLists.map((palette, index) => (
          <PaletteItem
            id={palette.id}
            key={`palette-${index}`}
            src={this.getImageSrc(palette.screenshot)}
            title={
              palette.name === '' ? locals[this.props.lang].name : palette.name
            }
            indicator={
              palette.devStatus === 'READY_FOR_DEV'
                ? {
                    label: locals[this.props.lang].palettesList.readyForDev,
                    status: 'ACTIVE',
                  }
                : undefined
            }
            subtitle={palette.preset}
            info={this.getPaletteMeta(palette.colors, palette.themes)}
            action={this.onSelectPalette}
          />
        ))}
      </ul>
    )
  }

  // Render
  render() {
    return (
      <section className="controller">
        <div className="controls">
          <div className="controls__control">
            <div className="control__block">
              {this.hasPalettes ? (
                <this.PalettesList />
              ) : (
                <div className="onboarding__callout">
                  <Message
                    icon="info"
                    messages={[
                      locals[this.props.lang].warning.noPaletteOnCurrrentPage,
                    ]}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }
}
