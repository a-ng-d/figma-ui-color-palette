import * as React from 'react'
import type { Language, PriorityContext, TrialStatus } from '../../utils/types'
import Feature from '../components/Feature'
import Dialog from './Dialog'
import Highlight from './Highlight'
import About from './About'
import cp from '../../content/images/choose_plan.webp'
import pp from '../../content/images/pro_plan.webp'
import t from '../../content/images/trial.webp'
import { locals } from '../../content/locals'
import features from '../../utils/config'
import package_json from '../../../package.json'

interface Props {
  context: PriorityContext
  planStatus: 'PAID' | 'UNPAID'
  trialStatus: TrialStatus
  lang: Language
  onClose: React.ChangeEventHandler & (() => void)
}

export default class PriorityContainer extends React.Component<Props, any> {
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
          <img
            className="dialog__cover"
            src={cp}
          />
          <p className="dialog__text type">
            {locals[this.props.lang].proPlan.trial.message}
          </p>
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
          <img
            className="dialog__cover"
            src={t}
          />
          <p className="dialog__text type">
            {locals[this.props.lang].proPlan.welcome.trial}
          </p>
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
          <img
            className="dialog__cover"
            src={pp}
          />
          <p className="dialog__text type">
            {locals[this.props.lang].proPlan.welcome.message}
          </p>
        </Dialog>
      </Feature>
    )
  }

  Highlight = () => {
    return (
      <Feature
        isActive={
          features.find((feature) => feature.name === 'HIGHLIGHT')?.isActive
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
          features.find((feature) => feature.name === 'ABOUT')?.isActive
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

  render() {
    return (
      <>
        {this.props.context === 'TRY' ? <this.TryPro /> : null}
        {this.props.context === 'WELCOME_TO_TRIAL' ? (
          <this.WelcomeToTrial />
        ) : null}
        {this.props.context === 'WELCOME_TO_PRO' ? <this.WelcomeToPro /> : null}
        {this.props.context === 'HIGHLIGHT' ? <this.Highlight /> : null}
        {this.props.context === 'ABOUT' ? <this.About /> : null}
      </>
    )
  }
}
