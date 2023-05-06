import * as React from 'react'
import PopIn from '../components/PopIn'
import releaseNotes from '../../utils/releaseNotes'
import type { ReleaseNote } from '../../utils/types'

interface Props {
  closeHighlight: any
}

export default class Highlight extends React.Component<Props> {
  openUrl = (currentNote: ReleaseNote) =>
    window.open(currentNote['learnMore'], '_blank')

  render() {
    const currentNote = releaseNotes.filter((note) => note['isMostRecent'])[0]
    return (
      <div className="highlight">
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
          <img className="highlight__cover" src={currentNote['image']} />
          <p className="highlight__text type">{currentNote['content']}</p>
        </PopIn>
      </div>
    )
  }
}
