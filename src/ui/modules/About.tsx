import * as React from 'react'
import Feature from '../components/Feature'
import Icon from './Icon'
import Button from '../components/Button'
import features from '../../utils/features'
import package_json from './../../../package.json'
import { locals } from '../../content/locals'

interface Props {
  planStatus: string
}

export default class About extends React.Component<Props> {
  render() {
    return (
      <div className="about controls__control">
        <div>
          <Icon size={32} />
          <div>
            <p className="type type--xlarge">{locals.en.name}</p>
            <div className="about__info">
              <p className="type">{`Version ${
                package_json.version.slice(0, 1) +
                package_json.version.slice(2, 3)
              }`}</p>
              <Feature
                isActive={
                  features.find((feature) => feature.name === 'GET_PRO_PLAN')
                    .isActive
                }
              >
                {this.props.planStatus === 'UNPAID' ? (
                  <>
                    <span>﹒</span>
                    <p className="type">{locals.en.plan.free}</p>
                  </>
                ) : (
                  <>
                    <span>﹒</span>
                    <p className="type">{locals.en.plan.pro}</p>
                  </>
                )}
              </Feature>
            </div>
          </div>
          <div>
            <p className="type">
              Created and maintained by{' '}
              <a
                href="https://an.gd"
                target="_blank"
                rel="noreferrer"
              >
                Aurélien Grimaud
              </a>
            </p>
            <p className="type">
              <a
                href="https://github.com/inVoltag/figma-ui-color-palette"
                target="_blank"
                rel="noreferrer"
              >
                Source code
              </a>{' '}
              is under{' '}
              <a
                href="https://creativecommons.org/licenses/by/4.0"
                target="_blank"
                rel="noreferrer"
              >
                CC BY 4.0
              </a>{' '}
              license
            </p>
          </div>
        </div>
        <div>
          <div>
            <div className="type type--bold">{locals.en.about.getHelp.title}</div>
            <div className="about__links">
              <Button
                type="tertiary"
                isLink={true}
                url="https://docs.ui-color-palette.com"
                label={locals.en.about.getHelp.documentation}
              />
              <span>﹒</span>
              <Button
                type="tertiary"
                isLink={true}
                url="mailto:hello@ui-color-palette.com"
                label={locals.en.about.getHelp.email}
              />
            </div>
          </div>
          <div>
            <div className="type type--bold">{locals.en.about.beInvolved.title}</div>
            <div className="about__links">
              <Button
                type="tertiary"
                isLink={true}
                url="https://github.com/inVoltag/figma-ui-color-palette/issues/new"
                label={locals.en.about.beInvolved.issue}
              />
              <span>﹒</span>
              <Button
                type="tertiary"
                isLink={true}
                url="https://uicp.link/feedback"
                label={locals.en.about.beInvolved.feedback}
              />
            </div>
          </div>
          <div>
            <div className="type type--bold">{locals.en.about.giveSupport.title}</div>
            <div className="about__links">
              <Button
                type="tertiary"
                isLink={true}
                url="https://www.linkedin.com/in/augrimaud"
                label={locals.en.about.giveSupport.follow}
              />
              <span>﹒</span>
              <Button
                type="tertiary"
                isLink={true}
                url="https://www.buymeacoffee.com/a_ng_d"
                label={locals.en.about.giveSupport.coffee}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
