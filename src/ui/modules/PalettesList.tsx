import { Chip, Message, Thumbnail, texts } from '@a_ng_d/figmug-ui'
import React from 'react'

import { locals } from '../../content/locals'
import type { ColorConfiguration, ExtractOfPaletteConfiguration, Language, ThemeConfiguration } from '../../utils/types'

interface PalettesListProps {
  paletteLists: Array<ExtractOfPaletteConfiguration>
  lang: Language
}

export default class PalettesList extends React.Component<PalettesListProps> {
  // Lifecycle
  componentDidMount = () =>
    parent.postMessage({ pluginMessage: { type: 'GET_PALETTES' } }, '*')

  // Direct actions
  getImageSrc = (screenshot: Uint8Array | null) => {
    if (screenshot !== null) {
      const blob = new Blob([screenshot], {
        type: 'image/png',
      })
      return URL.createObjectURL(blob)
    } else return ''
  }

  getPaletteMeta = (colors: Array<ColorConfiguration>, themes: Array<ThemeConfiguration>) => {
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
          <li
            className="rich-list__item"
            key={`palette-${index}`}
            data-id={palette.id}
            tabIndex={0}
            onMouseDown={this.onSelectPalette}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') this.onSelectPalette?.(e)
              if (e.key === 'Escape') (e.target as HTMLElement).blur()
            }}
          >
            <div className="rich-list__item__asset">
              <Thumbnail src={this.getImageSrc(palette.screenshot)} />
            </div>
            <div className="rich-list__item__content">
              <div className={`${texts.type} type--large`}>
                {palette.name === ''
                  ? locals[this.props.lang].name
                  : palette.name}
                {palette.devStatus === 'READY_FOR_DEV'
                && <Chip>{locals[this.props.lang].palettesList.readyForDev}</Chip>}
              </div>
              <div className={`${texts.type} type`}>{palette.preset}</div>
              <div
                className={`${texts.type} ${texts['type--secondary']} type`}
              >
                {this.getPaletteMeta(palette.colors, palette.themes)}
              </div>
            </div>
          </li>
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
              {this.props.paletteLists.length > 0 ? (
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
