import * as React from 'react'

interface Props {
  icon: string
  messages: Array<string>
  isBlocked?: boolean
}

export default class Message extends React.Component<Props> {
  static defaultProps = {
    isBlocked: false,
  }

  // Templates
  SingleMessage = () => {
    return (
      <div
        className={[
          'onboarding-tip',
          this.props.isBlocked ? 'onboarding-tip--blocked' : null,
        ]
          .filter((n) => n)
          .join(' ')}
      >
        <div
          className={['icon', 'icon--' + this.props.icon]
            .filter((n) => n)
            .join(' ')}
        ></div>
        <div className="onboarding-tip__msg">{this.props.messages[0]}</div>
      </div>
    )
  }

  MultipleMessages = () => {
    return (
      <div className="callout">
        <div>
          <div className="onboarding-tip">
            <div
              className={['icon', 'icon--' + this.props.icon]
                .filter((n) => n)
                .join(' ')}
            ></div>
            <div className="onboarding-tip__ticker">
              <div
                className="onboarding-tip__tips"
                style={{
                  animation: `ticker ${
                    this.props.messages.length * 5000
                  }ms 0ms linear infinite`,
                }}
              >
                {this.props.messages.map((message, index) => {
                  return (
                    <React.Fragment key={`message-${index}`}>
                      <div className="onboarding-tip__msg">{message}</div>
                      <div className="type">﹒</div>
                    </React.Fragment>
                  )
                })}
              </div>
              <div
                className="onboarding-tip__tips"
                style={{
                  animation: `ticker ${
                    this.props.messages.length * 5000
                  }ms 0ms linear infinite`,
                }}
              >
                {this.props.messages.map((message, index) => {
                  return (
                    <React.Fragment key={`message-${index}`}>
                      <div className="onboarding-tip__msg">{message}</div>
                      <div className="type">﹒</div>
                    </React.Fragment>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render
  render() {
    return (
      <>
        {this.props.messages.length > 1 ? (
          <this.MultipleMessages />
        ) : (
          <this.SingleMessage />
        )}
      </>
    )
  }
}
