import * as React from 'react'

interface Props {
  id?: string
  type: string
  icon: { type: string; value: string }
  placeholder?: string
  value: string
  charactersLimit?: number
  min?: string
  max?: string
  isBlocked?: boolean
  feature: string
  onChange: React.FocusEventHandler<HTMLInputElement>
  onFocus: React.FocusEventHandler<HTMLInputElement>
  onConfirm?: React.KeyboardEventHandler<HTMLInputElement>
}

export default class Input extends React.Component<Props> {
  static defaultProps = {
    isBlocked: false,
  }

  // Direct actions
  onNudge = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.shiftKey && e.key === 'ArrowUp')
      (e.target as HTMLInputElement).value = (
        parseFloat((e.target as HTMLInputElement).value) + 9
      ).toString()
    else if (e.shiftKey && e.key === 'ArrowDown')
      (e.target as HTMLInputElement).value = (
        parseFloat((e.target as HTMLInputElement).value) - 9
      ).toString()
  }

  // Templates
  Color = () => {
    return (
      <div
        className={`input ${
          this.props.isBlocked ? 'input--blocked' : ''
        } input input--with-icon`}
      >
        <input
          id={this.props.id}
          data-feature={this.props.feature}
          type="color"
          className="input__color"
          value={this.props.value}
          onChange={this.props.onChange}
          onBlur={this.props.onChange}
          onFocus={this.props.onFocus}
        />
        <input
          id={this.props.id}
          data-feature={this.props.feature}
          type="input"
          className="input__field"
          value={this.props.value.toUpperCase().substr(1, 6)}
          onChange={this.props.onChange}
          onBlur={this.props.onChange}
          onFocus={this.props.onFocus}
        />
      </div>
    )
  }

  Number = () => {
    return (
      <div
        className={`input ${this.props.isBlocked ? 'input--blocked' : ''} ${
          this.props.icon.type === 'none' ? '' : 'input--with-icon'
        }`}
      >
        {this.props.icon.type != 'none' ? (
          <div
            className={`icon${
              this.props.icon.type === 'icon'
                ? ` icon--${this.props.icon.value}`
                : ''
            }`}
          >
            {this.props.icon.type === 'letter' ? this.props.icon.value : ''}
          </div>
        ) : null}
        <input
          id={this.props.id}
          data-feature={this.props.feature}
          type="number"
          className="input__field"
          value={this.props.value}
          min={this.props.min}
          max={this.props.max}
          step="1"
          onKeyDown={this.onNudge}
          onChange={this.props.onChange}
          onFocus={this.props.onFocus}
        />
      </div>
    )
  }

  Text = () => {
    return (
      <div
        className={`input ${this.props.isBlocked ? 'input--blocked' : ''} ${
          this.props.icon.type === 'none' ? '' : ' input--with-icon'
        }`}
      >
        {this.props.icon.type != 'none' ? (
          <div
            className={`icon${
              this.props.icon.type === 'icon'
                ? ` icon--${this.props.icon.value}`
                : ''
            }`}
          >
            {this.props.icon.type === 'letter' ? this.props.icon.value : ''}
          </div>
        ) : null}
        <input
          id={this.props.id}
          data-feature={this.props.feature}
          type="text"
          className="input__field"
          placeholder={this.props.placeholder}
          value={this.props.value}
          maxLength={this.props.charactersLimit}
          onKeyPress={this.props.onConfirm}
          onChange={this.props.onChange}
          onBlur={this.props.onChange}
          onFocus={this.props.onFocus}
        />
      </div>
    )
  }

  // Render
  render() {
    return (
      <>
        {this.props.type === 'number' ? <this.Number /> : null}
        {this.props.type === 'color' ? <this.Color /> : null}
        {this.props.type === 'text' ? <this.Text /> : null}
      </>
    )
  }
}
