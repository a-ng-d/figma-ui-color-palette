import * as React from 'react';

interface Props {
  type: string;
  icon: any;
  value: string;
  min: string;
  max: string;
  feature: string;
  onChange: any;
  onFocus: any
};

export default class Input extends React.Component<Props> {

  onNudge = (e: any) => {
    if (e.shiftKey && e.key === 'ArrowUp')
      e.target.value = parseFloat(e.target.value) + 9
    else if (e.shiftKey && e.key === 'ArrowDown')
      e.target.value = parseFloat(e.target.value) - 9
  }

  Color = () => {
    return (
      <div className='input input--with-icon'>
        <input
          data-feature={this.props.feature}
          type='color'
          value={this.props.value}
          onChange={this.props.onChange}
          onBlur={this.props.onChange}
          onFocus={this.props.onFocus}
        />
        <input
          data-feature={this.props.feature}
          type='input'
          className='input__field'
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
      <div className={`input${this.props.icon.type === 'none' ? '' : ' input--with-icon'}`}>
        {this.props.icon.type != 'none' ?
          <div className={`icon${this.props.icon.type === 'icon' ? ` icon--${this.props.icon.value}` : ''}`}>{this.props.icon.type === 'letter' ? this.props.icon.value : ''}</div>
        : null}
        <input
          data-feature={this.props.feature}
          type='number'
          className='input__field'
          value={this.props.value}
          min={this.props.min}
          max={this.props.max}
          step='1'
          onKeyDown={this.onNudge}
          onChange={this.props.onChange}
          onFocus={this.props.onFocus}
        />
      </div>
    )
  }

  Text = () => {
    return (
      <div className={`input${this.props.icon.type === 'none' ? '' : ' input--with-icon'}`}>
        {this.props.icon.type != 'none' ?
          <div className={`icon${this.props.icon.type === 'icon' ? ` icon--${this.props.icon.value}` : ''}`}>{this.props.icon.type === 'letter' ? this.props.icon.value : ''}</div>
        : null}
        <input
          id={this.props.feature}
          data-feature={this.props.feature}
          type='text'
          className='input__field'
          value={this.props.value}
          onKeyPress={this.props.onChange}
          onChange={this.props.onChange}
          onBlur={this.props.onChange}
          onFocus={this.props.onFocus}
        />
      </div>
    )
  }

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
