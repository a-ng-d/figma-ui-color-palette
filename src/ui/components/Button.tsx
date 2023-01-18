import * as React from 'react';

interface Props {
  icon?: string;
  type: string;
  label?: string;
  state?: string;
  feature: string;
  action: any
};

export default class Button extends React.Component<Props> {

  Button = () => {
    return (
      <button
        className={`button button--${this.props.type}`}
        onMouseDown={this.props.action}
      >
        {this.props.label}
      </button>
    )
  }

  Icon = () => {
    return (
      <div
        data-feature={this.props.feature}
        className={`icon-button${this.props.state != undefined ? ` icon-button--${this.props.state}` : ''}`}
        onMouseDown={this.props.action}
      >
        <div className={`icon icon--${this.props.icon}`}></div>
      </div>
    )
  }

  render() {
    return (
      <>
      {this.props.type === 'primary' ? <this.Button /> : null}
      {this.props.type === 'secondary' ? <this.Button /> : null}
      {this.props.type === 'icon' ? <this.Icon /> : null}
      </>
    )
  }

}
