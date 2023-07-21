import * as React from 'react'
import PopIn from '../components/PopIn'

interface Props {
  title: string
  actions: {
    primary?: {
      label: string
      action: React.ReactEventHandler | (() => void)
    }
    secondary?: {
      label: string
      action: React.ReactEventHandler | (() => void)
    }
  }
  children: React.ReactNode
  onClose: React.ReactEventHandler
}

export default class Dialog extends React.Component<Props> {
  render() {
    return (
      <div className="dialog">
        <PopIn
          title={this.props.title}
          actions={this.props.actions}
          OnClose={this.props.onClose}
        >
          {this.props.children}
        </PopIn>
      </div>
    )
  }
}
