import * as React from 'react'

interface Props {
  id: string
  label: string
  isBlocked?: boolean
  children: React.ReactNode
}

export default class FormItem extends React.Component<Props> {
  static defaultProps = {
    isBlocked: false,
  }

  render = () => {
    return (
      <div
        className={`form-item${
          this.props.isBlocked ? ' form-item--blocked' : ''
        }`}
      >
        <label
          className="type"
          htmlFor={this.props.id}
        >
          {this.props.label}
        </label>
        {this.props.children}
      </div>
    )
  }
}
