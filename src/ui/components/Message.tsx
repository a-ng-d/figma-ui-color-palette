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
        {this.props.messages.map((message, index) => {
          if (index > 0) {
            return(
              <React.Fragment key={`message-${index}`}>
                <div className="onboarding-tip__separator"></div>
                <div className='onboarding-tip__msg'>{message}</div>
              </React.Fragment>
            )
          } else {
            return <div className='onboarding-tip__msg' key={`message-${index}`}>{message}</div>
          }
        })}
      </div>
    )
  }

}
