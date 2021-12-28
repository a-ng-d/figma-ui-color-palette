import * as React from 'react';

interface Props {
  id: string;
  label: string;
  onChange: any;
  isChecked: boolean
};

export default class Switch extends React.Component<Props> {

  render() {
    return(
      <div className="switch">
          <input className="switch__toggle" type="checkbox" id={this.props.id} onChange={this.props.onChange} checked={this.props.isChecked} />
          <label className="switch__label" htmlFor={this.props.id}>{this.props.label}</label>
      </div>
    )
  }

}
