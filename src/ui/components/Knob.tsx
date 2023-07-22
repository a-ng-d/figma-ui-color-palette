import * as React from 'react'
import Input from './Input'

interface Props {
  id: string
  shortId: string
  value: string | number
  stopInputValue?: number
  state?: 'SELECTED' | 'EDITING' | 'NORMAL'
  min?: string
  max?: string
  onMouseDown: React.MouseEventHandler
  onClick?: React.MouseEventHandler
  onChangeStopValue?: React.FocusEventHandler<HTMLInputElement>
  onValidStopValue?: (
    stopId: string,
    e:
      | React.FocusEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => void
}

export default class Knob extends React.Component<Props> {
  transformStopValue = (value: string | number) =>
    typeof value === 'string'
      ? value == '100.0'
        ? '100'
        : value
      : value === 100
      ? '100'
      : value.toFixed(1)

  render() {
    return (
      <div
        className={`slider__knob ${this.props.id}${
          this.props.state === 'SELECTED'
            ? ' slider__knob--selected'
            : this.props.state === 'EDITING'
            ? ' slider__knob--editing'
            : ''
        }`}
        style={{ left: `${this.props.value}%` }}
        onMouseDown={this.props.onMouseDown}
        onClick={this.props.onClick}
      >
        <div className="type type--inverse slider__tooltip">
          {this.transformStopValue(this.props.value)}
        </div>
        {this.props.state === 'EDITING' ? (
          <div className="slider__input">
            <Input
              type="NUMBER"
              value={this.props.stopInputValue?.toString() ?? '0'}
              min={this.props.min}
              max={this.props.max}
              step="0.1"
              feature="TYPE_STOP_VALUE"
              isAutoFocus={true}
              onChange={this.props.onChangeStopValue}
              onFocus={(e: React.FocusEvent<HTMLInputElement>) =>
                this.props.onValidStopValue?.(this.props.shortId, e)
              }
              onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                this.props.onValidStopValue?.(this.props.shortId, e)
              }
              onConfirm={(e: React.KeyboardEvent<HTMLInputElement>) =>
                this.props.onValidStopValue?.(this.props.shortId, e)
              }
            />
          </div>
        ) : null}
        <div className="type slider__label">{this.props.shortId}</div>
        <div className="slider__graduation"></div>
      </div>
    )
  }
}
