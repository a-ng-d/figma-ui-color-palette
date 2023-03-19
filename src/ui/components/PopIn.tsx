import * as React from 'react'
import Button from './Button'

interface Props {
  title: string
  close: any
}

export default class PopIn extends React.Component<Props> {
  render() {
    return (
      <div className="popin">
        <div className="popin__header">
          <p className="type type--large type--bold">{this.props.title}</p>
          <Button
            icon="close"
            type="icon"
            feature="close"
            action={this.props.close}
          />
        </div>
        <div className="popin__content">
          {this.props.children}
        </div>
      </div>
    )
  }
}
