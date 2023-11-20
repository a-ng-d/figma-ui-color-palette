import * as React from 'react'

interface Props {
  id?: string
  type: 'NUMBER' | 'COLOR' | 'TEXT' | 'LONG_TEXT'
  icon?: { type: 'NONE' | 'LETTER' | 'ICON'; value: string }
  state: 'DEFAULT' | 'ERROR'
  placeholder?: string
  value: string
  charactersLimit?: number
  isMonospaceFont?: boolean
  rows?: number
  min?: string
  max?: string
  step?: string
  feature?: string
  isReadOnly?: boolean
  isBlocked?: boolean
  isAutoFocus?: boolean
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  onFocus: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  onBlur: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  onConfirm?: React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>
}

export default class Input extends React.Component<Props> {
  static defaultProps = {
    icon: {
      type: 'NONE',
      value: null,
    },
    state: 'DEFAULT',
    step: '1',
    isMonospaceFont: false,
    isBlocked: false,
    isAutoFocus: false,
  }

  // Direct actions
  onKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.shiftKey && e.key === 'ArrowUp')
      (e.target as HTMLInputElement).value = (
        parseFloat((e.target as HTMLInputElement).value) +
        9 * parseFloat(this.props.step == undefined ? '1' : this.props.step)
      ).toString()
    else if (e.shiftKey && e.key === 'ArrowDown')
      (e.target as HTMLInputElement).value = (
        parseFloat((e.target as HTMLInputElement).value) -
        9 * parseFloat(this.props.step == undefined ? '1' : this.props.step)
      ).toString()
    else if (e.key === 'Enter') this.props.onConfirm?.(e)
    else if (e.key === 'Escape') (e.target as HTMLElement).blur()
  }

  // Templates
  Color = () => {
    return (
      <div
        className={[
          'input',
          'input--with-icon',
          this.props.isBlocked ? 'input--blocked' : null,
        ]
          .filter((n) => n)
          .join(' ')}
      >
        <input
          id={this.props.id}
          data-feature={this.props.feature}
          type="color"
          className="input__color"
          value={this.props.value}
          autoFocus={this.props.isAutoFocus}
          onChange={this.props.onChange}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
        />
        <input
          id={this.props.id}
          data-feature={this.props.feature}
          type="input"
          className="input__field"
          value={this.props.value.toUpperCase().substr(1, 6)}
          autoFocus={this.props.isAutoFocus}
          onChange={this.props.onChange}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
        />
      </div>
    )
  }

  Number = () => {
    return (
      <div
        className={[
          'input',
          this.props.icon?.type === 'NONE' ? null : 'input--with-icon',
          this.props.isBlocked ? 'input--blocked' : null,
        ]
          .filter((n) => n)
          .join(' ')}
      >
        {this.props.icon?.type != 'NONE' ? (
          <div
            className={[
              'icon',
              this.props.icon?.type === 'ICON'
                ? 'icon--' + this.props.icon.value
                : null,
            ]
              .filter((n) => n)
              .join(' ')}
          >
            {this.props.icon?.type === 'LETTER' ? this.props.icon.value : ''}
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
          step={this.props.step}
          autoFocus={this.props.isAutoFocus}
          onKeyDown={this.onKeyDown}
          onChange={this.props.onChange}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
        />
      </div>
    )
  }

  Text = () => {
    return (
      <div
        className={[
          'input',
          this.props.icon?.type === 'NONE' ? null : 'input--with-icon',
          this.props.isBlocked ? 'input--blocked' : null,
        ]
          .filter((n) => n)
          .join(' ')}
      >
        {this.props.icon?.type != 'NONE' ? (
          <div
            className={[
              'icon',
              this.props.icon?.type === 'ICON'
                ? 'icon--' + this.props.icon.value
                : null,
            ]
              .filter((n) => n)
              .join(' ')}
          >
            {this.props.icon?.type === 'LETTER' ? this.props.icon?.value : ''}
          </div>
        ) : null}
        <input
          id={this.props.id}
          data-feature={this.props.feature}
          type="text"
          className={[
            'input__field',
            this.props.state === 'ERROR' ? 'input__field--error' : null,
          ]
            .filter((n) => n)
            .join(' ')}
          placeholder={this.props.placeholder}
          value={this.props.value}
          maxLength={this.props.charactersLimit}
          autoFocus={this.props.isAutoFocus}
          onKeyDown={this.onKeyDown}
          onChange={this.props.onChange}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
        />
      </div>
    )
  }

  LongText = () => {
    return (
      <div
        className={['input', this.props.isBlocked ? 'input--blocked' : null]
          .filter((n) => n)
          .join(' ')}
      >
        <textarea
          id={this.props.id}
          data-feature={this.props.feature}
          className={[
            'textarea',
            'input__field',
            this.props.isMonospaceFont ? 'textarea--monospace' : null,
          ]
            .filter((n) => n)
            .join(' ')}
          placeholder={this.props.placeholder}
          value={this.props.value}
          autoFocus={this.props.isAutoFocus}
          onKeyDown={this.onKeyDown}
          onChange={this.props.onChange}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
          readOnly={this.props.isReadOnly}
        ></textarea>
      </div>
    )
  }

  // Render
  render() {
    return (
      <>
        {this.props.type === 'NUMBER' ? <this.Number /> : null}
        {this.props.type === 'COLOR' ? <this.Color /> : null}
        {this.props.type === 'TEXT' ? <this.Text /> : null}
        {this.props.type === 'LONG_TEXT' ? <this.LongText /> : null}
      </>
    )
  }
}
