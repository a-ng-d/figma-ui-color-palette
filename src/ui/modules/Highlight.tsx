import { Dialog, texts } from '@a_ng_d/figmug-ui'
import React from 'react'

import { locals } from '../../content/locals'
import releaseNotes from '../../content/releaseNotes'
import { Language } from '../../types/app'
import { ReleaseNote } from '../../types/content'

interface HighlightProps {
  lang: Language
  onCloseHighlight: React.ReactEventHandler
}

interface HighlightStates {
  position: number
}

export default class Highlight extends React.Component<
  HighlightProps,
  HighlightStates
> {
  constructor(props: HighlightProps) {
    super(props)
    this.state = {
      position: 0,
    }
  }

  goNextSlide = (
    e: React.SyntheticEvent<Element, Event>,
    currentNote: ReleaseNote
  ) => {
    if (this.state.position + 1 < currentNote['numberOfNotes'])
      this.setState({ position: this.state.position + 1 })
    else {
      this.props.onCloseHighlight(e)
      this.setState({ position: 0 })
    }
  }

  render() {
    const currentNote = releaseNotes.filter((note) => note['isMostRecent'])[0]
    return (
      <Dialog
        title={currentNote['title'][this.state.position]}
        actions={{
          primary: {
            label:
              this.state.position + 1 < currentNote['numberOfNotes']
                ? locals[this.props.lang].highlight.cta.next
                : locals[this.props.lang].highlight.cta.gotIt,
            action: (e) => this.goNextSlide(e, currentNote),
          },
          secondary: {
            label: locals[this.props.lang].highlight.cta.learnMore,
            action: () =>
              window.open(
                currentNote['learnMore'][this.state.position],
                '_blank'
              ),
          },
        }}
        indicator={
          currentNote['numberOfNotes'] > 1
            ? `${this.state.position + 1} of ${currentNote['numberOfNotes']}`
            : undefined
        }
        onClose={(e) => {
          this.props.onCloseHighlight(e)
          this.setState({ position: 0 })
        }}
      >
        <div className="dialog__cover">
          <img
            src={currentNote['image'][this.state.position]}
            style={{
              width: '100%',
            }}
          />
        </div>
        <div className="dialog__text">
          <p className={`type ${texts.type}`}>
            {currentNote['content'][this.state.position]}
          </p>
        </div>
      </Dialog>
    )
  }
}
