import * as React from 'react'
import type { Language, TrialStatus } from '../../utils/types'
import Feature from '../components/Feature'
import Bar from '../components/Bar'
import Button from '../components/Button'
import features from '../../utils/config'
import { locals } from '../../content/locals'

interface Props {
  planStatus: 'UNPAID' | 'PAID'
  trialStatus: TrialStatus
  trialRemainingTime: number
  lang: Language
  onReOpenHighlight: () => void
  onReOpenAbout: () => void
  onGetProPlan: () => void
}

export default class Shortcuts extends React.Component<Props> {
  render() {
    return (
      <Bar
        rightPart={
          <div className="shortcuts">
            <Button
              type="tertiary"
              isLink={true}
              url="https://uicp.link/feedback"
              label={locals[this.props.lang].shortcuts.feedback}
              action={() => null}
            />
            <Feature
              isActive={
                features.find((feature) => feature.name === 'HIGHLIGHT')
                  ?.isActive
              }
            >
              <span>﹒</span>
              <Button
                type="tertiary"
                label={locals[this.props.lang].shortcuts.news}
                action={this.props.onReOpenHighlight}
              />
            </Feature>
            <Feature
              isActive={
                features.find((feature) => feature.name === 'ABOUT')?.isActive
              }
            >
              <span>﹒</span>
              <Button
                type="tertiary"
                label={locals[this.props.lang].contexts.about}
                action={this.props.onReOpenAbout}
              />
            </Feature>
            <span>﹒</span>
            <Button
              type="icon"
              icon="library"
              action={() => window.open('https://uicp.link/docs', '_blank')}
            />
            <Button
              type="icon"
              icon="repository"
              action={() =>
                window.open('https://uicp.link/repository', '_blank')
              }
            />
          </div>
        }
        leftPart={
          <Feature
            isActive={
              features.find((feature) => feature.name === 'GET_PRO_PLAN')
                ?.isActive
            }
          >
            <div className="pro-zone">
              {this.props.planStatus === 'UNPAID' && this.props.trialStatus != 'PENDING' ? (
                <button
                  className="get-pro-button"
                  onMouseDown={this.props.onGetProPlan}
                >
                  <div className="icon icon--lock-off"></div>
                  <div className="type">
                    {this.props.trialStatus === 'UNUSED'
                      ? locals[this.props.lang].plan.tryPro
                      : locals[this.props.lang].plan.getPro
                    }
                  </div>
                </button>
              ) : null}
              {this.props.trialStatus === 'PENDING' ? (
                <div className="label">
                  <div className="type--bold">{this.props.trialRemainingTime}</div>
                  <div>{this.props.trialRemainingTime <= 1 ? 'hour' : 'hours'} trial left</div>
                </div>
              ) : this.props.trialStatus === 'EXPIRED' && this.props.planStatus != 'PAID' ? (
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
