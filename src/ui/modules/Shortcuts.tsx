import * as React from 'react'
import type { Shortcut } from '../../utils/types'
import Button from '../components/Button'

interface Props {
  actions: Array<Shortcut>
  planStatus: string
}

export default class Shortcuts extends React.Component<Props> {
  // Direct actions
  onGetProPlan = () =>
    parent.postMessage(
    { pluginMessage: { type: 'get-pro-plan' } },
      '*'
    )

  render() {
    return (
      <div className="shortcuts">
        <div className="shortcuts__get-pro">
          {this.props.planStatus === 'UNPAID' ?
            <button className="get-pro-button" onMouseDown={this.onGetProPlan}>
              <div className="icon icon--lock-off"></div>
              <div className="type">Get Pro</div>
            </button>
          : null }
        </div>
        <div className="shortcuts__links">
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
      </div>
    )
  }
}
