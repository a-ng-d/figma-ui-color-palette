import * as React from 'react'
import Button from './Button'

interface Props {
  title: string
  actions: {
    primary: {
      label: string
      action: React.MouseEventHandler
    }
    secondary: {
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
            icon="close"
            type="icon"
            feature="close"
            action={this.props.close}
          />
        </div>
        <div className="popin__content">{this.props.children}</div>
        <div className="popin__actions">
          <Button
            type="secondary"
            label={this.props.actions.secondary.label}
            feature="secondary-action"
            action={this.props.actions.secondary.action}
          />
          <Button
            type="primary"
            label={this.props.actions.primary.label}
            feature="primary-action"
            action={this.props.actions.primary.action}
          />
        </div>
      </div>
    )
  }
}
