import { Dialog, texts } from '@a_ng_d/figmug-ui'
import React from 'react'

import package_json from '../../../package.json'
import { signIn } from '../../bridges/publication/authentication'
import cp from '../../content/images/choose_plan.webp'
import pp from '../../content/images/pro_plan.webp'
import t from '../../content/images/trial.webp'
import { locals } from '../../content/locals'
import features from '../../utils/config'
import type {
  Language,
  PlanStatus,
  PriorityContext,
  TrialStatus,
  UserSession,
} from '../../utils/types'
import type { AppStates } from '../App'
import Feature from '../components/Feature'
import About from './About'
import Highlight from './Highlight'
import Publication from './Publication'

interface PriorityContainerProps {
  context: PriorityContext
  rawData: AppStates
  planStatus: PlanStatus
  trialStatus: TrialStatus
  userSession: UserSession
  lang: Language
  onChangePublication: React.Dispatch<Partial<AppStates>>
  onClose: React.ChangeEventHandler & (() => void)
}

interface PriorityContainerStates {
  isPrimaryActionLoading: boolean
  isSecondaryActionLoading: boolean
}

export default class PriorityContainer extends React.Component<
  PriorityContainerProps,
  PriorityContainerStates
> {
  counter: number

  constructor(props: PriorityContainerProps) {
    super(props)
    this.counter = 0
    this.state = {
      isPrimaryActionLoading: false,
      isSecondaryActionLoading: false,
    }
  }

  // Templates
  TryPro = () => {
    return (
      <Feature
        isActive={
          features.find((feature) => feature.name === 'GET_PRO_PLAN')?.isActive
        }
      >
        <Dialog
          title={locals[this.props.lang].proPlan.trial.title}
          actions={{
            primary: {
              label: locals[this.props.lang].proPlan.trial.cta,
              action: () =>
                parent.postMessage(
                  { pluginMessage: { type: 'ENABLE_TRIAL' } },
                  '*'
                ),
            },
            secondary: {
              label: locals[this.props.lang].proPlan.trial.option,
              action: () =>
                parent.postMessage(
                  { pluginMessage: { type: 'GET_PRO_PLAN' } },
                  '*'
                ),
            },
          }}
          onClose={this.props.onClose}
        >
          <div className="dialog__cover">
            <img
              src={cp}
              style={{
                width: '100%',
              }}
            />
          </div>
          <div className="dialog__text">
            <p className={`type ${texts.type}`}>
              {locals[this.props.lang].proPlan.trial.message}
            </p>
          </div>
        </Dialog>
      </Feature>
    )
  }

  WelcomeToTrial = () => {
    return (
      <Feature
        isActive={
          features.find((feature) => feature.name === 'GET_PRO_PLAN')?.isActive
        }
      >
        <Dialog
          title={locals[this.props.lang].proPlan.welcome.title}
          actions={{
            primary: {
              label: locals[this.props.lang].proPlan.welcome.cta,
              action: this.props.onClose,
            },
          }}
          onClose={this.props.onClose}
        >
          <div className="dialog__cover">
            <img
              src={t}
              style={{
                width: '100%',
              }}
            />
          </div>
          <div className="dialog__text">
            <p className={`type ${texts.type}`}>
              {locals[this.props.lang].proPlan.welcome.trial}
            </p>
          </div>
        </Dialog>
      </Feature>
    )
  }

  Feedback = () => {
    return (
      <Feature
        isActive={
          features.find((feature) => feature.name === 'SHORTCUTS_FEEDBACK')
            ?.isActive
        }
      >
        <Dialog
          title={locals[this.props.lang].shortcuts.feedback}
          actions={{}}
          onClose={this.props.onClose}
        >
          <iframe
            style={{
              border: 'none',
              width: '100%',
              height: '100%',
            }}
            title="Voice of the UI Color Palette Users"
            loading="lazy"
            src="https://tally.so/embed/w7KBNL?hideTitle=1"
          ></iframe>
        </Dialog>
      </Feature>
    )
  }

  TrialFeedback = () => {
    return (
      <Feature
        isActive={
          features.find((feature) => feature.name === 'SHORTCUTS_FEEDBACK')
            ?.isActive
        }
      >
        <Dialog
          title={locals[this.props.lang].shortcuts.trialFeedback}
          actions={{}}
          onClose={this.props.onClose}
        >
          <iframe
            style={{
              border: 'none',
              width: '100%',
              height: '100%',
            }}
            title="Voice of the UI Color Palette Users"
            loading="lazy"
            src="https://tally.so/embed/w2Krvp?hideTitle=1"
          ></iframe>
        </Dialog>
      </Feature>
    )
  }

  WelcomeToPro = () => {
    return (
      <Feature
        isActive={
          features.find((feature) => feature.name === 'GET_PRO_PLAN')?.isActive
        }
      >
        <Dialog
          title={locals[this.props.lang].proPlan.welcome.title}
          actions={{
            primary: {
              label: locals[this.props.lang].proPlan.welcome.cta,
              action: this.props.onClose,
            },
          }}
          onClose={this.props.onClose}
        >
          <div className="dialog__cover">
            <img
              src={pp}
              style={{
                width: '100%',
              }}
            />
          </div>
          <div className="dialog__text">
            <p className={`type ${texts.type}`}>
              {locals[this.props.lang].proPlan.welcome.message}
            </p>
          </div>
        </Dialog>
      </Feature>
    )
  }

  Highlight = () => {
    return (
      <Feature
        isActive={
          features.find((feature) => feature.name === 'SHORTCUTS_HIGHLIGHT')
            ?.isActive
        }
      >
        <Highlight
          lang={this.props.lang}
          onCloseHighlight={() => {
            parent.postMessage(
              {
                pluginMessage: {
                  type: 'CLOSE_HIGHLIGHT',
                  data: {
                    version: package_json.version,
                    isRead: true,
                  },
                },
              },
              '*'
            )
            this.props.onClose()
          }}
        />
      </Feature>
    )
  }

  About = () => {
    return (
      <Feature
        isActive={
          features.find((feature) => feature.name === 'SHORTCUTS_ABOUT')
            ?.isActive
        }
      >
        <Dialog
          title={locals[this.props.lang].about.title}
          actions={{}}
          onClose={this.props.onClose}
        >
          <About
            planStatus={this.props.planStatus}
            trialStatus={this.props.trialStatus}
            lang={this.props.lang}
          />
        </Dialog>
      </Feature>
    )
  }

  Publication = () => {
    return (
      <Feature
        isActive={
          features.find((feature) => feature.name === 'PUBLICATION')?.isActive
        }
      >
        {this.props.rawData.userSession.connectionStatus === 'UNCONNECTED' ? (
          <Dialog
            title={locals[this.props.lang].publication.titleSignIn}
            actions={{
              primary: {
                label: locals[this.props.lang].publication.signIn,
                state: this.state['isPrimaryActionLoading']
                  ? 'LOADING'
                  : 'DEFAULT',
                action: async () => {
                  this.setState({ isPrimaryActionLoading: true })
                  signIn()
                    .finally(() => {
                      this.setState({ isPrimaryActionLoading: false })
                    })
                    .catch((error) => {
                      parent.postMessage(
                        {
                          pluginMessage: {
                            type: 'SEND_MESSAGE',
                            message:
                              error.message === 'Authentication timeout'
                                ? locals[this.props.lang].error.timeout
                                : locals[this.props.lang].error.authentication,
                          },
                        },
                        '*'
                      )
                    })
                },
              },
            }}
            onClose={this.props.onClose}
          >
            <div className="dialog__cover">
              <img
                src={pp}
                style={{
                  width: '100%',
                }}
              />
            </div>
            <div className="dialog__text">
              <p className={`type ${texts.type}`}>
                {locals[this.props.lang].publication.message}
              </p>
            </div>
          </Dialog>
        ) : (
          <Publication
            rawData={this.props.rawData}
            isPrimaryActionLoading={this.state['isPrimaryActionLoading']}
            isSecondaryActionLoading={this.state['isSecondaryActionLoading']}
            lang={this.props.lang}
            onLoadPrimaryAction={(e) =>
              this.setState({ isPrimaryActionLoading: e })
            }
            onLoadSecondaryAction={(e) =>
              this.setState({ isSecondaryActionLoading: e })
            }
            onChangePublication={this.props.onChangePublication}
            onClosePublication={this.props.onClose}
          />
        )}
      </Feature>
    )
  }

  // Render
  render() {
    return (
      <>
        {this.props.context === 'TRY' ? <this.TryPro /> : null}
        {this.props.context === 'WELCOME_TO_TRIAL' ? (
          <this.WelcomeToTrial />
        ) : null}
        {this.props.context === 'WELCOME_TO_PRO' ? <this.WelcomeToPro /> : null}
        {this.props.context === 'FEEDBACK' ? <this.Feedback /> : null}
        {this.props.context === 'TRIAL_FEEDBACK' ? (
          <this.TrialFeedback />
        ) : null}
        {this.props.context === 'HIGHLIGHT' ? <this.Highlight /> : null}
        {this.props.context === 'ABOUT' ? <this.About /> : null}
        {this.props.context === 'PUBLICATION' ? <this.Publication /> : null}
      </>
    )
  }
}
