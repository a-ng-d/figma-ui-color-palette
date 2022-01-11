import * as React from 'react';

interface Props {
  id: string;
  label: string;
  isChecked: boolean;
  onChange: any
};

export default class Checkbox extends React.Component<Props> {

  render() {
    return(
      <div className='checkbox'>
        <input className='checkbox__box' type='checkbox' id={this.props.id} checked={this.props.isChecked} onChange={this.props.onChange} />
        <label className='checkbox__label' htmlFor={this.props.id}>{this.props.label}</label>
      </div>
    )
  }

}
