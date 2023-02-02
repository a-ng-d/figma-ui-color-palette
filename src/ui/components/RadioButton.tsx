import * as React from 'react';

interface Props {
  id: string;
  label: string;
  isChecked: boolean;
  isDisabled: boolean;
  feature: string;
  group: string;
  onChange: any
}

export default class RadioButton extends React.Component<Props> {

  render() {
    return(
      <div className='radio'>
        <input
          data-feature={this.props.feature}
          id={this.props.id}
          className='radio__button'
          type='radio'
          checked={this.props.isChecked}
          disabled={this.props.isDisabled}
          onChange={this.props.onChange}
          name={this.props.group}
        />
        <label className='radio__label' htmlFor={this.props.id}>{this.props.label}</label>
      </div>
    )
  }

}
