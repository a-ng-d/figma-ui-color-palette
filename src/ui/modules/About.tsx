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
                url="mailto:hello@ui-color-palette.com?subject=%5BFeature%20request%20%7C%20Bug%20report%20%7C%20Issue%5DWhy%20are%20you%20contacting%20UI%20Color%20Palette%3F&body=Before%20submitting%20any%20feature%20suggestions%2C%20bug%20reports%2C%20or%20issues%20you%20have%20encountered%2C%20please%20follow%20these%20steps%3A%0A%0A-%20Clearly%20describe%20the%20feature%20suggestion%2C%20bug%2C%20or%20issue%20in%20detail%0A-%20Provide%20any%20relevant%20information%2C%20such%20as%20error%20messages%20or%20steps%20to%20reproduce%20the%20issue.%0A-%20Offer%20to%20provide%20more%20information%20if%20needed%0A%0AOnce%20you%20have%20completed%20the%20checklist%2C%20you%20can%20submit%20your%20feature%20suggestion%20or%20bug%20report%20Thank%20you%20for%20helping%20us%20improve%20our%20product%21%0A%0ABest%20regards%2C%0A%0AUI%20Color%20Palette%20team"
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
