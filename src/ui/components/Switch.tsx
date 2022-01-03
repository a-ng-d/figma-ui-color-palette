import * as React from 'react';

interface Props {
  id: string;
  label: string;
  isChecked: boolean;
  onChange: any
};

export default class Switch extends React.Component<Props> {

  render() {
    return(
      <div className="switch">
          <input className="switch__toggle" type="checkbox" id={this.props.id} defaultChecked={this.props.isChecked} onChange={this.props.onChange} />
          <label className="switch__label" htmlFor={this.props.id}>{this.props.label}</label>
      </div>
    )
  }

}
