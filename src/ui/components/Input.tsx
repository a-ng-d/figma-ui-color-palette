import * as React from 'react';

interface Props {
  type: string;
  id: string;
  icon: any;
  value: string;
  min: string;
  max: string;
  onChange: any
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
        <input id={this.props.id} type='color' value={this.props.value} onChange={this.props.onChange} onBlur={this.props.onChange} />
        <input id={this.props.id} type='input' className='input__field' value={this.props.value.toUpperCase().substr(1, 6)} onChange={this.props.onChange} readOnly />
      </div>
    )
  }

  Number = () => {
    return (
      <div className={`input ${this.props.icon.type === 'none' ? '' : 'input--with-icon'}`}>
        <div className={`icon ${this.props.icon.type === 'icon' ? `icon--${this.props.icon.value}` : ''}`}>{this.props.icon.type === 'letter' ? this.props.icon.value : ''}</div>
        <input id={this.props.id} type='number' className='input__field' value={this.props.value} min={this.props.min} max={this.props.max} step='1' onKeyDown={this.onNudge} onChange={this.props.onChange} onBlur={this.props.onChange} />
      </div>
    )
  }

  Text = () => {
    return (
      <div className={`input${this.props.icon.type === 'none' ? '' : ' input--with-icon'}`}>
        <div className={`icon${this.props.icon.type === 'icon' ? ` icon--${this.props.icon.value}` : ''}`}>{this.props.icon.type === 'letter' ? this.props.icon.value : ''}</div>
        <input id={this.props.id} type='text' className='input__field' value={this.props.value} onKeyPress={this.props.onChange} onChange={this.props.onChange} onBlur={this.props.onChange} />
      </div>
    )
  }

  render() {
    return (
      <>
      {this.props.type === 'number' ? <this.Number /> : null}
      {this.props.type === 'color' ? <this.Color /> : null}
      </>
    )
  }

}
