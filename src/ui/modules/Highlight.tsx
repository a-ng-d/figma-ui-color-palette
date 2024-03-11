import * as React from 'react'
import type { Language, ReleaseNote } from '../../utils/types'
import { Dialog } from '@a-ng-d/figmug.dialogs.dialog'
import releaseNotes from '../../content/releaseNotes'
import { locals } from '../../content/locals'
import { texts } from '@a-ng-d/figmug.stylesheets.texts'

interface Props {
  lang: Language
  onCloseHighlight: React.ReactEventHandler
}

interface States {
  position: number
}

export default class Highlight extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props)
    this.state = {
      position: 0,
    }
  }

  goNextSlide = (
    e: React.SyntheticEvent<Element, Event>,
    currentNote: ReleaseNote
  ) => {
    if (this.state['position'] + 1 < currentNote['numberOfNotes'])
      this.setState({ position: this.state['position'] + 1 })
    else {
      this.props.onCloseHighlight(e)
      this.setState({ position: 0 })
    }
  }

  render() {
    const currentNote = releaseNotes.filter((note) => note['isMostRecent'])[0]
    return (
      <Dialog
        title={currentNote['title'][this.state['position']]}
        actions={{
          primary: {
            label:
              this.state['position'] + 1 < currentNote['numberOfNotes']
                ? locals[this.props.lang].highlight.cta.next
                : locals[this.props.lang].highlight.cta.gotIt,
            action: (e) => this.goNextSlide(e, currentNote),
          },
          secondary: {
            label: locals[this.props.lang].highlight.cta.learnMore,
            action: () =>
              window.open(
                currentNote['learnMore'][this.state['position']],
                '_blank'
              ),
          },
        }}
        indicator={
          currentNote['numberOfNotes'] > 1
            ? `${this.state['position'] + 1} of ${currentNote['numberOfNotes']}`
            : undefined
        }
        onClose={(e) => {
          this.props.onCloseHighlight(e)
          this.setState({ position: 0 })
        }}
      >
        <img
          className="dialog__cover"
          src={currentNote['image'][this.state['position']]}
        />
        <p className={`dialog__text type ${texts.type}`}>
          {currentNote['content'][this.state['position']]}
        </p>
      </Dialog>
    )
  }
}
