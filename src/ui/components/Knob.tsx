import * as React from 'react'

interface Props {
  id: string
  scale: string | number
  state: string
  number: string
  action: React.MouseEventHandler
}

export default class Knob extends React.Component<Props> {
  render() {
    return (
      <div
        className={`slider__knob ${this.props.id}${
          this.props.state === 'selected' ? ' slider__knob--selected' : ''
        }`}
        style={{ left: `${this.props.scale}%` }}
        onMouseDown={this.props.action}
      >
        <div className="type type--inverse slider__tooltip">
          {typeof this.props.scale === 'string'
            ? this.props.scale == '100.0'
              ? '100'
              : this.props.scale
            : this.props.scale === 100
            ? '100'
            : this.props.scale.toFixed(1)}
        </div>
        <div className="type slider__label">{this.props.number}</div>
        <div className="slider__graduation"></div>
      </div>
    )
  }
}
