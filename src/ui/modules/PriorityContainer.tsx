import React from 'react'
import type {
  Language,
  PlanStatus,
  PriorityContext,
  ThemeConfiguration,
  TrialStatus,
  UserSession,
} from '../../utils/types'
import Feature from '../components/Feature'
import { Dialog } from '@a-ng-d/figmug.dialogs.dialog'
import { Thumbnail } from '@a-ng-d/figmug.layouts.thumbnail'
import Highlight from './Highlight'
import About from './About'
import cp from '../../content/images/choose_plan.webp'
import pp from '../../content/images/pro_plan.webp'
import t from '../../content/images/trial.webp'
import { signIn } from '../../bridges/publication/authentication'
import publishPalette from '../../bridges/publication/publishPalette'
import { locals } from '../../content/locals'
import { texts } from '@a-ng-d/figmug.stylesheets.texts'
import features from '../../utils/config'
import package_json from '../../../package.json'

interface PriorityContainerProps {
  context: PriorityContext
  rawData: any
  planStatus: PlanStatus
  trialStatus: TrialStatus
  userSession: UserSession
  lang: Language
  onClose: React.ChangeEventHandler & (() => void)
}

interface PriorityContainerStates {
  isPaletteShared: boolean
  isPrimaryActionLoading: boolean
  isSecondaryLoading: boolean
}

export default class PriorityContainer extends React.Component<PriorityContainerProps, PriorityContainerStates> {
  counter: number

  constructor(props: PriorityContainerProps) {
    super(props)
    this.counter = 0
    this.state = {
      isPaletteShared: this.props.rawData.publicationStatus.isShared,
      isPrimaryActionLoading: false,
      isSecondaryLoading: false,
    }
  }

  // Direct actions
  getImageSrc = () => {
    const blob = new Blob([this.props.rawData.screenshot], { type: 'image/png' })
    return URL.createObjectURL(blob)
  }

  uploadPaletteScreenshot = () => {
    this.counter == 0
      ? parent.postMessage(
          {
            pluginMessage: {
              type: 'UPDATE_SCREENSHOT'
            },
          },
          '*'
        )
      : null
    this.counter = 1
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
    this.uploadPaletteScreenshot()
    return (
      <Feature
        isActive={
          features.find((feature) => feature.name === 'PUBLICATION')?.isActive
        }
      >
        <Dialog
          title={locals[this.props.lang].publication.title}
          actions={{
            primary: {
              label: (() =>
                this.props.userSession.connectionStatus === 'CONNECTED'
                  ? locals[this.props.lang].publication.ctaWhenSignedIn
                  : locals[this.props.lang].publication.ctaWhenSignedOut
              )(),
              status: this.state['isPrimaryActionLoading'] ? 'LOADING' : 'DEFAULT',
              action: async () =>
                this.props.userSession.connectionStatus === 'CONNECTED'
                ? await publishPalette(this.props.rawData)
                : (() => {
                  this.setState({ isPrimaryActionLoading: true })
                  signIn()
                    .finally(() => {
                      this.setState({ isPrimaryActionLoading: false });
                    });
              })()
            },
          }}
          select={{
            label: locals[this.props.lang].publication.selectToShare,
            status: false,
            action: () => this.setState({
              isPaletteShared: !this.state['isPaletteShared']
            })
          }}
          onClose={this.props.onClose}
        >
          <div className="dialog__cover dialog__cover--padding">
            <Thumbnail
              src={this.getImageSrc()}
            />
          </div>
          <div className={`dialog__text`}>
            <div>
              <div className={`${texts.type} type--large`}>
                {this.props.rawData.name === ''
                  ? locals[this.props.lang].name
                  : this.props.rawData.name}
              </div>
              <div className={`${texts.type} type`}>{this.props.rawData.preset.name}</div>
              <div
                className={`${texts.type} ${texts['type--secondary']} type`}
              >{`${this.props.rawData.colors.length} ${
                this.props.rawData.colors.length > 1
                  ? locals[this.props.lang].actions.sourceColorsNumber.several
                  : locals[this.props.lang].actions.sourceColorsNumber.single
              }, ${
                this.props.rawData.themes.filter((theme: ThemeConfiguration) => theme.type === 'custom theme')
                  .length
              } ${
                this.props.rawData.themes.filter((theme: ThemeConfiguration) => theme.type === 'custom theme')
                  .length > 1
                  ? locals[this.props.lang].actions.colorThemesNumber.several
                  : locals[this.props.lang].actions.colorThemesNumber.single
              }`}</div>
            </div>
            
            <div className={`type ${texts.type}`}>
              {locals[this.props.lang].publication.message}
            </div>
          </div>
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
