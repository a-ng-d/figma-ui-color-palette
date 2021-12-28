import * as React from 'react';

interface Props {
  type: string;
  label: string;
  action: any
};

export default class Button extends React.Component<Props> {

  render() {
    return(
      <button className={`button button--${this.props.type}`} onClick={this.props.action}>{this.props.label}</button>
    )
  }

}
