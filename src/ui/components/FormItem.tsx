import * as React from 'react'
import Message from './Message'

interface Props {
  id: string
  label: string
  helper?: {
    type: 'INFO' | 'ERROR'
    message: string
  }
  shouldFill?: boolean
  isBlocked?: boolean
  children: React.ReactNode
}

export default class FormItem extends React.Component<Props> {
  static defaultProps = {
    shouldFill: true,
    isBlocked: false,
  }

  render() {
    return (
      <>
        <div
          className={[
            'form-item',
            this.props.shouldFill ? 'form-item--fill' : null,
            this.props.isBlocked ? 'form-item--blocked' : null,
          ].filter(n => n).join(' ')}
        >
          <label
            className="type"
            htmlFor={this.props.id}
          >
            {this.props.label}
          </label>
          {this.props.children}        
        </div>
        {this.props.helper != undefined ? (
          <div className="form-item__helper">
            <Message
              icon={this.props.helper.type === 'INFO' ? 'key' : 'warning'}
              messages={[this.props.helper.message]}
            />
          </div>
          ) : null
        }
      </>
    )
  }
}
