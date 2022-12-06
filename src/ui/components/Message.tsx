import * as React from 'react';

interface Props {
  icon: string;
  messages: Array<string>;
};

export default class Message extends React.Component<Props> {

  SingleMessage = () => {
    return (
      <div className='onboarding-tip'>
        <div className={`icon icon--${this.props.icon}`}></div>
        <div className='onboarding-tip__msg'>{this.props.messages[0]}</div>
      </div>
    )
  }

  MultipleMessages = () => {
    return (
      <div className='callout'>
        <div>
          <div className='onboarding-tip'>
            <div className={`icon icon--${this.props.icon}`}></div>
            <div className='onboarding-tip__slider'>
              <div className='onboarding-tip__slides'>
                {this.props.messages.map((message, index) => {
                  return <div className='onboarding-tip__msg' key={`message-${index}`}>{message}</div>
                })}
              </div>
              <div className='onboarding-tip__slides'>
                {this.props.messages.map((message, index) => {
                  return <div className='onboarding-tip__msg' key={`message-${index}`}>{message}</div>
                })}
              </div>
          </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <>
      {this.props.messages.length > 1 ? <this.MultipleMessages /> : <this.SingleMessage />}
      </>
    )
  }

}
