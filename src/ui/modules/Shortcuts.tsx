import * as React from 'react'
import type { Shortcut } from '../../utils/types'
import Feature from '../components/Feature'
import Bar from '../components/Bar'
import Button from '../components/Button'
import features from '../../utils/features'
import { locals } from '../../content/locals'

interface Props {
  planStatus: string
  lang: string
  onReOpenHighlight: (action: string) => void
}

export default class Shortcuts extends React.Component<Props> {
  constructor(props) {
    super(props)
    this.state = {
     actions: [
        {
          label: locals[this.props.lang].shortcuts.documentation,
          isLink: true,
          url: 'https://docs.ui-color-palette.com',
          action: null,
        },
        {
          label: locals[this.props.lang].shortcuts.feedback,
          isLink: true,
          url: 'https://uicp.link/feedback',
          action: null,
        },
        {
          label: locals[this.props.lang].shortcuts.news,
          isLink: false,
          url: '',
          action: this.props.onReOpenHighlight('OPEN'),
        },
      ]
    }
  }
  // Direct actions
  onGetProPlan = () =>
    parent.postMessage({ pluginMessage: { type: 'GET_PRO_PLAN' } }, '*')

  render() {
    return (
      <Bar
        rightPart={
          <div className="shortcuts">
            {this.state['actions'].map((action, index) =>
              index === this.state['actions'].length - 1 ? (
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
        }
        leftPart={
          <Feature
            isActive={
              features.find((feature) => feature.name === 'GET_PRO_PLAN')
                .isActive
            }
          >
            {this.props.planStatus === 'UNPAID' ? (
              <button
                className="get-pro-button"
                onMouseDown={this.onGetProPlan}
              >
                <div className="icon icon--lock-off"></div>
                <div className="type">
                  {locals[this.props.lang].plan.getPro}
                </div>
              </button>
            ) : null}
          </Feature>
        }
        border={['TOP']}
      />
    )
  }
}
