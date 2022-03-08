import * as React from 'react';

interface Props {
  type: string;
  icon: any;
  value: string;
  min: string;
  max: string;
  action: any
};

export default class Input extends React.Component<Props> {

  Color = () => {
    return (
      <div className='input input--with-icon'>
        <div className='icon'><input type='color' value={this.props.value} /></div>
        <input type='input' className='input__field' value={this.props.value.toUpperCase().substr(1, 6)} />
      </div>
    )
  }

  Number = () => {
    return (
      <div className={`input ${this.props.icon.type === 'none' ? '' : 'input--with-icon'}`}>
        <div className={`icon ${this.props.icon.type === 'icon' ? `icon--${this.props.icon.value}` : ''}`}>{this.props.icon.type === 'letter' ? this.props.icon.value : ''}</div>
        <input type='number' className='input__field' value={this.props.value} min={this.props.min} max={this.props.max} />
      </div>
    )
  }

  render() {
    console.log(this.props.icon)
    return (
      <>
      {this.props.type === 'number' ? <this.Number /> : null}
      {this.props.type === 'color' ? <this.Color /> : null}
      </>
    )
  }

}
