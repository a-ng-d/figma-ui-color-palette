import * as React from 'react'
import PopIn from '../components/PopIn'

interface Props {
  title: string
  image: string
  content: string
  label: string
  action: React.ReactEventHandler
}

export default class Dialog extends React.Component<Props> {
  render() {
    return (
      <div className="dialog">
        <PopIn
          title={this.props.title}
          actions={{
            primary: {
              label: this.props.label,
              action: this.props.action,
            }
          }}
          close={this.props.action}
        >
          <img
            className="dialog__cover"
            src={this.props.image}
          />
          <p className="dialog__text type">{this.props.content}</p>
        </PopIn>
      </div>
    )
  }
}
