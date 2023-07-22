import * as React from 'react'
import type { Language } from '../../utils/types'
import Dialog from './Dialog'
import releaseNotes from '../../content/releaseNotes'
import { locals } from '../../content/locals'

interface Props {
  lang: Language
  onCloseHighlight: React.ReactEventHandler
}

export default class Highlight extends React.Component<Props> {
  render() {
    const currentNote = releaseNotes.filter((note) => note['isMostRecent'])[0]
    return (
      <Dialog
        title={currentNote['title']}
        actions={{
          primary: {
            label: locals[this.props.lang].highlight.gotIt,
            action: this.props.onCloseHighlight,
          },
          secondary: {
            label: locals[this.props.lang].highlight.learnMore,
            action: () => window.open(currentNote['learnMore'], '_blank'),
          },
        }}
        onClose={this.props.onCloseHighlight}
      >
        <img
          className="dialog__cover"
          src={currentNote['image']}
        />
        <p className="dialog__text type">{currentNote['content']}</p>
      </Dialog>
    )
  }
}
