import * as React from 'react'
import type { ReleaseNote } from '../../utils/types'
import PopIn from '../components/PopIn'
import releaseNotes from '../../content/releaseNotes'

interface Props {
  closeHighlight: React.ReactEventHandler
}

export default class Highlight extends React.Component<Props> {
  openUrl = (currentNote: ReleaseNote) =>
    window.open(currentNote['learnMore'], '_blank')

  render = () => {
    const currentNote = releaseNotes.filter((note) => note['isMostRecent'])[0]
    return (
      <div className="dialog">
        <PopIn
          title={currentNote['title']}
          actions={{
            primary: {
              label: 'Got it',
              action: this.props.closeHighlight,
            },
            secondary: {
              label: 'Learn more',
              action: () => this.openUrl(currentNote),
            },
          }}
          close={this.props.closeHighlight}
        >
          <img
            className="dialog__cover"
            src={currentNote['image']}
          />
          <p className="dialog__text type">{currentNote['content']}</p>
        </PopIn>
      </div>
    )
  }
}
