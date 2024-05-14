import React from 'react'
import type { AppStates } from '../App'
import type { Language, PublicationDetails } from '../../utils/types'
import { Dialog, Thumbnail, Chip, texts } from '@a_ng_d/figmug-ui'
import publishPalette from '../../bridges/publication/publishPalette'
import { locals } from '../../content/locals'

interface PublicationProps {
  rawData: AppStates
  isPrimaryActionLoading: boolean
  isSecondaryActionLoading: boolean
  lang: Language
  onPrimaryActionLoading: (e: boolean) => void
  onSecondaryActionLoading: (e: boolean) => void
  onPalettePublished: (e: PublicationDetails) => void
  onClosePublication: React.ReactEventHandler
}

interface PublicationStates {
  isPaletteShared: boolean
}

export default class Publication extends React.Component<PublicationProps, PublicationStates> {
  counter: number

  constructor(props: PublicationProps) {
    super(props)
    this.counter = 0
    this.state = {
      isPaletteShared: this.props.rawData.publicationStatus.isShared
    }
  }

  // Direct actions
  getImageSrc = () => {
    if (this.props.rawData.screenshot !== null) {
      const blob = new Blob([this.props.rawData.screenshot], {
        type: 'image/png',
      })
      return URL.createObjectURL(blob)
    } else return ''
  }

  uploadPaletteScreenshot = () => {
    this.counter == 0
      ? parent.postMessage(
          {
            pluginMessage: {
              type: 'UPDATE_SCREENSHOT',
            },
          },
          '*'
        )
      : null
    this.counter = 1
  }

  getPaletteStatus = () => {
    const publishedAt = new Date(this.props.rawData.dates.publishedAt),
      updatedAt = new Date(this.props.rawData.dates.updatedAt)
    
    if (this.props.rawData.publicationStatus.isPublished)
      if (publishedAt < updatedAt)
        return(
          <Chip>
            {locals[this.props.lang].publication.statusChanges}
          </Chip>
        )
      else
        return (
          <Chip
            state='INACTIVE'
          >
            {locals[this.props.lang].publication.statusUptoDate}
          </Chip>
        )
    else
      return (
        <Chip
          state='INACTIVE'
        >
          {locals[this.props.lang].publication.statusUnpublished}
        </Chip>
      )
  }

  getPaletteMeta = () => {
    const colorsNumber = this.props.rawData.colors.length,
      themesNumber = this.props.rawData.themes.filter(
        (theme) => theme.type === 'custom theme'
      ).length
    
    let colorLabel: string, themeLabel: string

    if (colorsNumber > 1)
      colorLabel = locals[this.props.lang].actions.sourceColorsNumber.several
    else
      colorLabel = locals[this.props.lang].actions.sourceColorsNumber.single

    if (themesNumber > 1)
      themeLabel = locals[this.props.lang].actions.colorThemesNumber.several
    else
      themeLabel = locals[this.props.lang].actions.colorThemesNumber.single

    return `${colorsNumber} ${colorLabel}, ${themesNumber} ${themeLabel}`
  }

  render() {
    this.uploadPaletteScreenshot()
    return (
      <Dialog
        title={locals[this.props.lang].publication.title}
        actions={{
          primary: {
            label: locals[this.props.lang].publication.publish,
            state: this.props.isPrimaryActionLoading
              ? 'LOADING'
              : 'DEFAULT',
            action: async () => {
              this.props.onPrimaryActionLoading(true)
              publishPalette(this.props.rawData, this.props.isPrimaryActionLoading)
                .then((data) => {
                  this.props.onPalettePublished(data)
                })
                .finally(() => {
                  this.props.onPrimaryActionLoading(false)
                })
            },
          },
          secondary: (() => {
            if (this.props.rawData.publicationStatus.isPublished)
              return {
                label: locals[this.props.lang].publication.unpublish,
                state: this.props.isSecondaryActionLoading
                  ? 'LOADING'
                  : 'DEFAULT',
                action: async () => {
                  this.props.onSecondaryActionLoading(true)
                  publishPalette(this.props.rawData, this.props.isSecondaryActionLoading).finally(() => {
                    this.props.onSecondaryActionLoading(false)
                  })
                },
              }
            else undefined
          })()
        }}
        select={{
          label: locals[this.props.lang].publication.selectToShare,
          state: this.state['isPaletteShared'],
          action: () =>
            this.setState({
              isPaletteShared: !this.state['isPaletteShared']
            })
        }}
        onClose={this.props.onClosePublication}
      >
        <div className="dialog__cover dialog__cover--padding">
          <Thumbnail src={this.getImageSrc()} />
        </div>
        <div className={`dialog__text`}>
          <div>
            <div className={`${texts.type} type--large`}>
              {this.props.rawData.name === ''
                ? locals[this.props.lang].name
                : this.props.rawData.name}
              {this.getPaletteStatus()}
            </div>
            <div className={`${texts.type} type`}>
              {this.props.rawData.preset.name}
            </div>
            <div
              className={`${texts.type} ${texts['type--secondary']} type`}
            >
              {this.getPaletteMeta()}
            </div>
          </div>
          <div className={`type ${texts.type} ${texts['type--secondary']}`}>
            
          </div>
        </div>
      </Dialog>
    )
  }
}
