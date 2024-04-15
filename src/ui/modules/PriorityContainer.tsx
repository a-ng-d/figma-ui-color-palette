import * as React from 'react'
import type {
  Language,
  PlanStatus,
  PriorityContext,
  TrialStatus,
} from '../../utils/types'
import Feature from '../components/Feature'
import { Dialog } from '@a-ng-d/figmug.dialogs.dialog'
import Highlight from './Highlight'
import About from './About'
import cp from '../../content/images/choose_plan.webp'
import pp from '../../content/images/pro_plan.webp'
import t from '../../content/images/trial.webp'
import { locals } from '../../content/locals'
import { texts } from '@a-ng-d/figmug.stylesheets.texts'
import features from '../../utils/config'
import package_json from '../../../package.json'
import signIn from '../../bridges/signIn'

interface Props {
  context: PriorityContext
  planStatus: PlanStatus
  trialStatus: TrialStatus
  lang: Language
  onClose: React.ChangeEventHandler & (() => void)
}

export default class PriorityContainer extends React.Component<Props> {
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
          <p className={`dialog__text type ${texts.type}`}>
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
          <p className={`dialog__text type ${texts.type}`}>
            {locals[this.props.lang].proPlan.welcome.trial}
          </p>
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
          <img
            className="dialog__cover"
            src={pp}
          />
          <p className={`dialog__text type ${texts.type}`}>
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
        <Dialog
          title="Publish your palette"
          actions={{
            primary: {
              label: "Sign in",
              action: async () => {
                await signIn()
              },
            },
          }}
          onClose={this.props.onClose}
        >
          <img
            className="dialog__cover"
            src={pp}
          />
          <p className={`dialog__text type ${texts.type}`}>
            Publish your palette to reuse in others Figma document and share it with the community 
          </p>
        </Dialog>
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
