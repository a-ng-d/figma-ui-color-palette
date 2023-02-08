import * as React from 'react'

interface Props {
  id: string
  scale: any
  state: string
  number: any
  action: any
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
          {this.props.scale === '100.0' ? '100' : this.props.scale}
        </div>
        <div className="type slider__label">{this.props.number}</div>
        <div className="slider__graduation"></div>
      </div>
    )
  }
}
