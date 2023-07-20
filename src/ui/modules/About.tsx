import * as React from 'react'
import Feature from '../components/Feature'
import Icon from './Icon'
import Button from '../components/Button'
import features from '../../utils/features'
import package_json from './../../../package.json'
import { locals } from '../../content/locals'

interface Props {
  planStatus: string
  lang: string
}

export default class About extends React.Component<Props> {
  render() {
    return (
      <div className="about controls__control">
        <div>
          <div className="about__basic">
            <Icon size={32} />
            <div>
              <p className="type type--xlarge">{locals[this.props.lang].name}</p>
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
                      <p className="type">{locals[this.props.lang].plan.free}</p>
                    </>
                  ) : (
                    <>
                      <span>﹒</span>
                      <p className="type">{locals[this.props.lang].plan.pro}</p>
                    </>
                  )}
                </Feature>
              </div>
            </div>
          </div>
          <div >
            <p className="type">
              Created and maintained by{' '}
              <a
                href="https://uicp.link/author"
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
                href="https://uicp.link/license"
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
            <div className="type type--bold">
              {locals[this.props.lang].about.getHelp.title}
            </div>
            <div className="about__links">
              <Button
                type="tertiary"
                isLink={true}
                url="https://docs.ui-color-palette.com"
                label={locals[this.props.lang].about.getHelp.documentation}
              />
              <span>﹒</span>
              <Button
                type="tertiary"
                isLink={true}
                url="mailto:hello@ui-color-palette.com"
                label={locals[this.props.lang].about.getHelp.email}
              />
            </div>
          </div>
          <div>
            <div className="type type--bold">
              {locals[this.props.lang].about.beInvolved.title}
            </div>
            <div className="about__links">
              <Button
                type="tertiary"
                isLink={true}
                url="https://github.com/inVoltag/figma-ui-color-palette/issues/new/choose"
                label={locals[this.props.lang].about.beInvolved.issue}
              />
              <span>﹒</span>
              <Button
                type="tertiary"
                isLink={true}
                url="https://uicp.link/feedback"
                label={locals[this.props.lang].about.beInvolved.feedback}
              />
            </div>
          </div>
          <div>
            <div className="type type--bold">
              {locals[this.props.lang].about.giveSupport.title}
            </div>
            <div className="about__links">
              <Button
                type="tertiary"
                isLink={true}
                url="https://www.linkedin.com/in/augrimaud"
                label={locals[this.props.lang].about.giveSupport.follow}
              />
              {this.props.planStatus === 'UNPAID' ? (
                <>
                  <span>﹒</span>
                  <Button
                    type="tertiary"
                    isLink={true}
                    url="https://www.buymeacoffee.com/a_ng_d"
                    label={locals[this.props.lang].about.giveSupport.coffee}
                  />
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
