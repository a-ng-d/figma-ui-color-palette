import * as React from 'react';

interface Props {
  icon: string;
  messages: Array<string>;
};

export default class Message extends React.Component<Props> {

  render() {
    return(
      <div className='onboarding-tip'>
        <div className={`icon icon--${this.props.icon}`}></div>
        {this.props.messages.map((message, index) => <div className='onboarding-tip__msg' key={`message-${index}`}>{message}</div>)}
      </div>
    )
  }

}
