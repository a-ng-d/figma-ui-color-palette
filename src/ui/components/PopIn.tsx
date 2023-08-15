import * as React from 'react'
import Button from './Button'

interface Props {
  title: string
  actions: {
    primary?: {
      label: string
      action: React.MouseEventHandler
    }
    secondary?: {
      label: string
      action: React.MouseEventHandler
    }
  }
  indicator?: string
  children: React.ReactNode
  OnClose: React.MouseEventHandler
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
            action={this.props.OnClose}
          />
        </div>
        <div className="popin__content">{this.props.children}</div>
        {Object.keys(this.props.actions).length > 0 ||
        this.props.indicator != undefined ? (
          <div className="popin__footer">
            <div className="popin__indicator">
              {this.props.indicator != undefined ? (
                <p className="label">{this.props.indicator}</p>
              ) : null}
            </div>
            <div className="popin__actions">
              {this.props.actions.secondary != undefined ? (
                <Button
                  type="secondary"
                  label={this.props.actions.secondary.label}
                  feature="SECONDARY_ACTION"
                  action={this.props.actions.secondary.action}
                />
              ) : null}
              {this.props.actions.primary != undefined ? (
                <Button
                  type="primary"
                  label={this.props.actions.primary.label}
                  feature="PRIMARY_ACTION"
                  action={this.props.actions.primary.action}
                />
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    )
  }
}
