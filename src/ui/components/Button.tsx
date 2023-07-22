import * as React from 'react'

interface Props {
  type: 'primary' | 'secondary' | 'tertiary' | 'icon'
  icon?: string
  label?: string
  state?: 'disabled' | 'blocked' | 'selected' | '' | undefined
  isLink?: boolean
  url?: string
  feature?: string
  isBlocked?: boolean
  action?: React.MouseEventHandler
}

export default class Button extends React.Component<Props> {
  static defaultProps = {
    isLink: false,
    isBlocked: false,
  }

  // Templates
  Button = () => {
    return (
      <button
        className={`button button--${this.props.type}${
          this.props.isBlocked ? ' button--blocked' : ''
        }`}
        data-feature={this.props.feature}
        disabled={this.props.isBlocked}
        onMouseDown={this.props.action}
      >
        {this.props.label}
      </button>
    )
  }

  LinkButton = () => {
    return (
      <button
        className={`button button--${this.props.type}`}
        data-feature={this.props.feature}
      >
        <a
          href={this.props.url}
          target="_blank"
          rel="noreferrer"
        >
          {this.props.label}
        </a>
      </button>
    )
  }

  Icon = () => {
    return (
      <div
        data-feature={this.props.feature}
        className={`icon-button${
          this.props.state != undefined
            ? ` icon-button--${this.props.state}`
            : ''
        }`}
        onMouseDown={this.props.action}
      >
        <div className={`icon icon--${this.props.icon}`}></div>
      </div>
    )
  }

  // Render
  render() {
    return (
      <>
        {this.props.type != 'icon' ? (
          this.props.isLink ? (
            <this.LinkButton />
          ) : (
            <this.Button />
          )
        ) : (
          <this.Icon />
        )}
      </>
    )
  }
}
