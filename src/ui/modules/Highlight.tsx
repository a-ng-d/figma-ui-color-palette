import * as React from 'react'
import PopIn from '../components/PopIn'
import releaseNotes from '../../utils/releaseNotes'
import type { RealeaseNote } from '../../utils/releaseNotes'

interface Props {
  currentVersion: string
  closeHighlight: any
}

export default class Highlight extends React.Component<Props> {
  openUrl = (currentNote: RealeaseNote) => window.open(currentNote['learnMore'], '_blank')

  render() {
    const currentNote = releaseNotes.filter(note => note['version'] === this.props.currentVersion)[0]
    return (
      <div className="highlight">
        <PopIn
          title={currentNote['title']}
          actions={{
            primary: {
              label: 'Got it',
              action: this.props.closeHighlight
            },
            secondary: {
              label: 'Learn more',
              action: () => this.openUrl(currentNote)
            }
          }}
          close={this.props.closeHighlight}
        >
          <img src={currentNote['image']} />
          <p className="type">{currentNote['content']}</p>
        </PopIn>
      </div>
    )
  }
}
