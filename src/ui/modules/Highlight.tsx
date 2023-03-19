import * as React from 'react'
import PopIn from '../components/PopIn'
import releaseNotes from '../../utils/releaseNotes'

interface Props {
  currentVersion: string
  closeHighlight: any
}

export default class Highlight extends React.Component<Props> {
  render() {
    const currentNote = releaseNotes.filter(note => note['version'] === this.props.currentVersion)[0]
    return (
      <div className="highlight">
        <PopIn
          title="Test"
          close={this.props.closeHighlight}
        >
          <p className="type">test</p>
        </PopIn>
      </div>
    )
  }
}
