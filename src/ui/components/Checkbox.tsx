import * as React from 'react';

interface Props {
  id: string;
  label: string;
  isChecked: boolean;
  isDisabled: boolean;
  feature: string;
  onChange: any
};

export default class Checkbox extends React.Component<Props> {

  render() {
    return(
      <div className='checkbox'>
        <input
          data-feature={this.props.feature}
          id={this.props.id}
          className='checkbox__box'
          type='checkbox'
          checked={this.props.isChecked}
          disabled={this.props.isDisabled}
          onChange={this.props.onChange}
        />
        <label className='checkbox__label' htmlFor={this.props.id}>{this.props.label}</label>
      </div>
    )
  }

}
