import * as React from 'react'
import Feature from '../components/Feature'
import Icon from './Icon'
import Button from '../components/Button'
import features from '../../utils/features'
import package_json from './../../../package.json'

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
            <p className="type type--xlarge">UI Color Palette</p>
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
                    <p className="type">Free Plan</p>
                  </>
                ) : (
                  <>
                    <span>﹒</span>
                    <p className="type">Pro Plan</p>
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
            <div className="type type--bold">Get help</div>
            <div className="about__links">
              <Button
                type="tertiary"
                isLink={true}
                url="https://docs.ui-color-palette.com"
                label="Read the documentation"
              />
              <span>﹒</span>
              <Button
                type="tertiary"
                isLink={true}
                url="mailto:hello@ui-color-palette.com"
                label="Send an email"
              />
            </div>
          </div>
          <div>
            <div className="type type--bold">Be involved</div>
            <div className="about__links">
              <Button
                type="tertiary"
                isLink={true}
                url="https://github.com/inVoltag/figma-ui-color-palette/issues/new"
                label="Open an issue"
              />
              <span>﹒</span>
              <Button
                type="tertiary"
                isLink={true}
                url="https://uicp.link/feedback"
                label="Give feedback"
              />
            </div>
          </div>
          <div>
            <div className="type type--bold">Give support</div>
            <div className="about__links">
              <Button
                type="tertiary"
                isLink={true}
                url="https://www.linkedin.com/in/augrimaud"
                label="Follow my activity"
              />
              <span>﹒</span>
              <Button
                type="tertiary"
                isLink={true}
                url="https://www.buymeacoffee.com/a_ng_d"
                label="Buy me a coffee"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
