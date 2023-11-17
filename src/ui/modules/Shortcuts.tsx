import * as React from 'react'
import type { Language, TrialStatus } from '../../utils/types'
import Feature from '../components/Feature'
import Bar from '../components/Bar'
import Button from '../components/Button'
import Menu from './Menu'
import features from '../../utils/config'
import { locals } from '../../content/locals'
import isBlocked from '../../utils/isBlocked'

interface Props {
  planStatus: 'UNPAID' | 'PAID'
  trialStatus: TrialStatus
  trialRemainingTime: number
  lang: Language
  onReOpenFeedback: () => void
  onReOpenHighlight: () => void
  onReOpenAbout: () => void
  onGetProPlan: () => void
}

export default class Shortcuts extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props)
    this.state = {
      canBeResized: false
    }
  }

  onHold = (e: React.MouseEvent<HTMLDivElement>) => {
    this.setState({
      canBeResized: true
    })
  }

  onResize = (e: React.MouseEvent<HTMLDivElement>) => {
    if (this.state['canBeResized']) {
      parent.postMessage({ pluginMessage: {
        type: 'RESIZE_UI',
        origin: {
          x: e.nativeEvent.screenX - e.nativeEvent.clientX,
          y: e.nativeEvent.screenY - e.nativeEvent.clientY
        },
        shift: {
          x: (e as any).nativeEvent.layerX,
          y: (e as any).nativeEvent.layerY
        },
        cursor: {
          x: e.nativeEvent.screenX,
          y: e.nativeEvent.screenY
        },
        movement: {
          x: e.nativeEvent.movementX,
          y: e.nativeEvent.movementY
        }
      } }, '*')
    }
  }

  onReleased = (e: React.MouseEvent<HTMLDivElement>) => {
    this.setState({
      canBeResized: false
    })
    e.target.removeEventListener('mouseleave', () => this.onResize)
    e.target.removeEventListener('mouseup', () => this.onResize)
  }

  render() {
    return (
      <Bar
        rightPart={
          <>
          <div className="shortcuts">
            <Button
              type="icon"
              icon="repository"
              action={() =>
                window.open('https://uicp.link/repository', '_blank')
              }
            />
            <Menu
              icon="info"
              actions={[
                {
                  label: locals[this.props.lang].shortcuts.news,
                  isActive:
                    features.find(
                      (feature) => feature.name === 'SHORTCUTS_HIGHTLIGHT'
                    )?.isActive ?? true,
                  isBlocked: isBlocked(
                    'SHORTCUTS_HIGHLIGHT',
                    this.props.planStatus
                  ),
                  isSeparator: false,
                  action: () => this.props.onReOpenHighlight(),
                },
                {
                  label: locals[this.props.lang].about.getHelp.documentation,
                  isActive: features.find(
                    (feature) => feature.name === 'SHORTCUTS_DOCUMENTATION'
                  )?.isActive,
                  isBlocked: isBlocked(
                    'SHORTCUTS_DOCUMENTATION',
                    this.props.planStatus
                  ),
                  isSeparator: false,
                  action: () => window.open('https://uicp.link/docs', '_blank'),
                },
                {
                  label: locals[this.props.lang].about.getHelp.email,
                  isActive: features.find(
                    (feature) => feature.name === 'SHORTCUTS_EMAIL'
                  )?.isActive,
                  isBlocked: isBlocked(
                    'SHORTCUTS_EMAIL',
                    this.props.planStatus
                  ),
                  isSeparator: false,
                  action: () =>
                    window.open('https://uicp.link/send-message', '_blank'),
                },
                {
                  label: '',
                  isActive: true,
                  isBlocked: false,
                  isSeparator: true,
                  action: () => null,
                },
                {
                  label: locals[this.props.lang].shortcuts.feedback,
                  isActive: features.find(
                    (feature) => feature.name === 'SHORTCUTS_FEEDBACK'
                  )?.isActive,
                  isBlocked: isBlocked(
                    'SHORTCUTS_FEEDBACK',
                    this.props.planStatus
                  ),
                  isSeparator: false,
                  action: () => this.props.onReOpenFeedback(),
                },
                {
                  label: locals[this.props.lang].about.beInvolved.issue,
                  isActive: features.find(
                    (feature) => feature.name === 'SHORTCUTS_REPORTING'
                  )?.isActive,
                  isBlocked: isBlocked(
                    'SHORTCUTS_REPORTING',
                    this.props.planStatus
                  ),
                  isSeparator: false,
                  action: () =>
                    window.open('https://uicp.link/report', '_blank'),
                },
                {
                  label: locals[this.props.lang].about.beInvolved.discuss,
                  isActive: features.find(
                    (feature) => feature.name === 'SHORTCUTS_DISCUSSION'
                  )?.isActive,
                  isBlocked: isBlocked(
                    'SHORTCUTS_DISCUSSION',
                    this.props.planStatus
                  ),
                  isSeparator: false,
                  action: () =>
                    window.open('https://uicp.link/discuss', '_blank'),
                },
                {
                  label: '',
                  isActive: true,
                  isBlocked: false,
                  isSeparator: true,
                  action: () => null,
                },
                {
                  label: locals[this.props.lang].about.title,
                  isActive: features.find(
                    (feature) => feature.name === 'SHORTCUTS_ABOUT'
                  )?.isActive,
                  isBlocked: isBlocked(
                    'SHORTCUTS_ABOUT',
                    this.props.planStatus
                  ),
                  isSeparator: false,
                  action: this.props.onReOpenAbout,
                },
                {
                  label: locals[this.props.lang].about.giveSupport.follow,
                  isActive: features.find(
                    (feature) => feature.name === 'SHORTCUTS_NETWORKING'
                  )?.isActive,
                  isBlocked: isBlocked(
                    'SHORTCUTS_NETWORKING',
                    this.props.planStatus
                  ),
                  isSeparator: false,
                  action: () =>
                    window.open('https://uicp.link/network', '_blank'),
                },
              ]}
              alignment="TOP_RIGHT"
            />
          </div>
          <div
            className="box-resizer-grip icon--resize-grip"
            onMouseDown={this.onHold.bind(this)}
            onMouseMove={this.onResize.bind(this)}
            onMouseUp={this.onReleased.bind(this)}
            onMouseLeave={this.onReleased.bind(this)}
          ></div>
          </>
        }
        leftPart={
          <Feature
            isActive={
              features.find((feature) => feature.name === 'GET_PRO_PLAN')
                ?.isActive
            }
          >
            <div className="pro-zone">
              {this.props.planStatus === 'UNPAID' &&
              this.props.trialStatus != 'PENDING' ? (
                <button
                  className="get-pro-button"
                  onMouseDown={this.props.onGetProPlan}
                >
                  <div className="icon icon--lock-off"></div>
                  <div className="type">
                    {this.props.trialStatus === 'UNUSED'
                      ? locals[this.props.lang].plan.tryPro
                      : locals[this.props.lang].plan.getPro}
                  </div>
                </button>
              ) : null}
              {this.props.trialStatus === 'PENDING' ? (
                <div className="label">
                  <div className="type--bold">
                    {this.props.trialRemainingTime}
                  </div>
                  <div>
                    {this.props.trialRemainingTime <= 1 ? 'hour' : 'hours'} left
                    in this trial
                  </div>
                </div>
              ) : this.props.trialStatus === 'EXPIRED' &&
                this.props.planStatus != 'PAID' ? (
                <div className="label">
                  {locals[this.props.lang].plan.trialEnded}
                </div>
              ) : null}
            </div>
          </Feature>
        }
        border={['TOP']}
      />
    )
  }
}
