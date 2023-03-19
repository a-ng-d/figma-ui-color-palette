import * as React from 'react'
import PopIn from '../components/PopIn'

interface Props {
  closeHighlight: any
}

export default class Highlight extends React.Component<Props> {
  render() {
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
