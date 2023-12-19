import * as React from 'react'
import type { Language, TrialStatus } from '../../utils/types'
import Feature from '../components/Feature'
import Icon from './Icon'
import { texts } from '@a-ng-d/figmug.stylesheets.texts'
import features from '../../utils/config'
import package_json from './../../../package.json'
import { locals } from '../../content/locals'

interface Props {
  planStatus: 'UNPAID' | 'PAID'
  trialStatus: TrialStatus
  lang: Language
}

export default class About extends React.Component<Props> {
  render() {
    return (
      <div className="about controls__control">
        <div>
          <div className="about__basic">
            <Icon size={32} />
            <div>
              <p className={`type ${texts.type} type--xlarge`}>
                {locals[this.props.lang].name}
              </p>
              <div className="about__info">
                <p className={`type ${texts.type}`}>{`Version ${
                  package_json.version.slice(0, 1) +
                  package_json.version.slice(2, 3)
                }`}</p>
                <Feature
                  isActive={
                    features.find((feature) => feature.name === 'GET_PRO_PLAN')
                      ?.isActive
                  }
                >
                  <span>﹒</span>
                  <p className={`type ${texts.type}`}>
                    {this.props.planStatus === 'UNPAID'
                      ? locals[this.props.lang].plan.free
                      : this.props.planStatus === 'PAID' &&
                        this.props.trialStatus === 'PENDING'
                      ? locals[this.props.lang].plan.trial
                      : locals[this.props.lang].plan.pro}
                  </p>
                </Feature>
              </div>
            </div>
          </div>
          <div>
            <p className={`type ${texts.type}`}>
              Created and maintained by{' '}
              <a
                href="https://uicp.link/author"
                target="_blank"
                rel="noreferrer"
              >
                Aurélien Grimaud
              </a>
            </p>
            <p className={`type ${texts.type}`}>
              <a
                href="https://uicp.link/repository"
                target="_blank"
                rel="noreferrer"
              >
                Source code
              </a>{' '}
              is licensed under{' '}
              <a
                href="https://uicp.link/license"
                target="_blank"
                rel="noreferrer"
              >
                MIT
              </a>
            </p>
          </div>
        </div>
      </div>
    )
  }
}
