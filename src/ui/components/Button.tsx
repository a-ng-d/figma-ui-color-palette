import * as React from 'react';

interface Props {
  id: string;
  icon: string;
  type: string;
  label: string;
  state: string;
  action: any
};

export default class Button extends React.Component<Props> {

  Button = () => {
    return (
      <button
        className={`button button--${this.props.type}`}
        onClick={this.props.action}>{this.props.label}
      </button>
    )
  }

  Icon = () => {
    return (
      <div id={this.props.id} className={`icon-button${this.props.state != '' ? ` icon-button--${this.props.state}` : ''}`} onClick={this.props.action}>
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
