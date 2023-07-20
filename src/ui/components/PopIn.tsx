import * as React from 'react'
import Button from './Button'

interface Props {
  title: string
  actions: {
    primary: {
      label: string
      action: React.MouseEventHandler
    }
    secondary?: {
      label: string
      action: React.MouseEventHandler
    }
  }
  close: React.MouseEventHandler
  children: React.ReactNode
}

export default class PopIn extends React.Component<Props> {
  render() {
    return (
      <div className="popin">
        <div className="popin__header">
          <p className="type type--large type--bold">{this.props.title}</p>
          <Button
            type="icon"
            icon="close"
            feature="CLOSE_HIGHLIGHT"
            action={this.props.close}
          />
        </div>
        <div className="popin__content">{this.props.children}</div>
        <div className="popin__actions">
          {this.props.actions.secondary != undefined ? (
            <Button
              type="secondary"
              label={this.props.actions.secondary.label}
              feature="SECONDARY_ACTION"
              action={this.props.actions.secondary.action}
            />
          ) : null}
          <Button
            type="primary"
            label={this.props.actions.primary.label}
            feature="PRIMARY_ACTION"
            action={this.props.actions.primary.action}
          />
        </div>
      </div>
    )
  }
}
