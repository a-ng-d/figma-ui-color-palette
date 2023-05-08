import * as React from 'react'
import type { Shortcut } from '../../utils/types'
import Button from '../components/Button'

interface Props {
  actions: Array<Shortcut>
}

export default class Shortcuts extends React.Component<Props> {
  render() {
    return (
      <div className="help-bar">
        {this.props.actions.map((action, index) =>
          index === this.props.actions.length - 1 ? (
            <React.Fragment key={action.label}>
              <Button
                type="tertiary"
                isLink={action.isLink}
                url={action.url}
                label={action.label}
                action={action.action}
              />
            </React.Fragment>
          ) : (
            <React.Fragment key={action.label}>
              <Button
                type="tertiary"
                isLink={action.isLink}
                url={action.url}
                label={action.label}
                action={action.action}
              />
              <span>﹒</span>
            </React.Fragment>
          )
        )}
      </div>
    )
  }
}
