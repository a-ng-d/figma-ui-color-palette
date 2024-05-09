import React from 'react'
import type { ExtractOfPaletteConfiguration, Language } from '../../utils/types'
import { Message } from '@a_ng_d/figmug-ui'
import { texts } from '@a_ng_d/figmug-ui'
import { locals } from '../../content/locals'

interface PalettesListProps {
  paletteLists: Array<ExtractOfPaletteConfiguration>
  lang: Language
}

export default class PalettesList extends React.Component<PalettesListProps> {
  componentDidMount = () =>
    parent.postMessage({ pluginMessage: { type: 'GET_PALETTES' } }, '*')

  // Direct actions
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
            <div className={`${texts.type} type--large`}>
              {palette.name === ''
                ? locals[this.props.lang].name
                : palette.name}
            </div>
            <div className={`${texts.type} type`}>{palette.preset}</div>
            <div
              className={`${texts.type} ${texts['type--secondary']} type`}
            >{`${palette.colors.length} ${
              palette.colors.length > 1
                ? locals[this.props.lang].actions.sourceColorsNumber.several
                : locals[this.props.lang].actions.sourceColorsNumber.single
            }, ${
              palette.themes.filter((theme) => theme.type === 'custom theme')
                .length
            } ${
              palette.themes.filter((theme) => theme.type === 'custom theme')
                .length > 1
                ? locals[this.props.lang].actions.colorThemesNumber.several
                : locals[this.props.lang].actions.colorThemesNumber.single
            }`}</div>
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
