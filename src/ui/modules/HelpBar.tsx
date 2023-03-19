import * as React from 'react'
import Button from '../components/Button'

interface Props {
  actions: any
}

export default class HelpbBar extends React.Component<Props> {
  render() {
    return (
      <div className="help-bar">
        {this.props.actions.map((action, index) =>
          index === this.props.actions.length - 1 ? (
            <Button
              type="tertiary"
              isLink={action.isLink}
              url={action.url}
              label={action.label}
              action={action.action}
            />
          ) : (
            <>
              <Button
                type="tertiary"
                isLink={action.isLink}
                url={action.url}
                label={action.label}
                action={action.action}
              />
              <span>﹒</span>
            </>
          )
        )}
      </div>
    )
  }
}
