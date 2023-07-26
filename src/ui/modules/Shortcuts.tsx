import * as React from 'react'
import type { Language } from '../../utils/types'
import Feature from '../components/Feature'
import Bar from '../components/Bar'
import Button from '../components/Button'
import features from '../../utils/features'
import { locals } from '../../content/locals'

interface Props {
  planStatus: 'UNPAID' | 'PAID'
  lang: Language
  onReOpenHighlight: () => void
  onReOpenAbout: () => void
}

export default class Shortcuts extends React.Component<Props> {
  // Direct actions
  onGetProPlan = () =>
    parent.postMessage({ pluginMessage: { type: 'GET_PRO_PLAN' } }, '*')

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
              action={() =>
                window.open('https://uicp.link/docs', '_blank')
              }
            />
            <Button
              type="icon"
              icon="repository"
              action={() =>
                window.open(
                  'https://uicp.link/repository',
                  '_blank'
                )
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
