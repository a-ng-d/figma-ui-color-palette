import * as React from 'react'
import Icon from './Icon'
import package_json from './../../../package.json'

export default class About extends React.Component {
  render() {
    return (
      <div className="about controls__control">
        <div>
          <Icon size={32} />
          <div>
            <div className="type type--xlarge">UI Color Palette</div>
            <div className="type">{`Version ${
              package_json.version.slice(0, 1) +
              package_json.version.slice(2, 3)
            }`}</div>
          </div>
          <div>
            <p className="type">
              Created and maintained by{' '}
              <a href="https://an.gd" target="_blank" rel="noreferrer">
                Aurélien Grimaud
              </a>
            </p>
            <p className="type">
              <a href="https://github.com/inVoltag/figma-ui-color-palette" target="_blank" rel="noreferrer">
                Source code
              </a>
              {' '}is under{' '}
              <a href="https://creativecommons.org/licenses/by/4.0" target="_blank" rel="noreferrer">
                CC BY 4.0
              </a>
              {' '}license
            </p>
          </div>
        </div>
        <div>
          <div>
            <div className="type type--bold">Get help</div>
            <div className="about__links">
              <button className="button button--tertiary">
                <a
                  href="https://docs.ui-color-palette.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  Read the documentation
                </a>
              </button>
              <span>﹒</span>
              <button className="button button--tertiary">
                <a
                  href="mailto:hello@ui-color-palette.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  Send an email
                </a>
              </button>
            </div>
          </div>
          <div>
            <div className="type type--bold">Be involved</div>
            <div className="about__links">
              <button className="button button--tertiary">
                <a
                  href="https://github.com/inVoltag/figma-ui-color-palette/issues/new"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open an issue
                </a>
              </button>
              <span>﹒</span>
              <button className="button button--tertiary">
                <a
                  href="https://kutt.it/voice-of-uicp-users"
                  target="_blank"
                  rel="noreferrer"
                >
                  Give your feedback
                </a>
              </button>
            </div>
          </div>
          <div>
            <div className="type type--bold">Give support</div>
            <div className="about__links">
              <button className="button button--tertiary">
                <a
                  href="https://twitter.com/a_ng_d"
                  target="_blank"
                  rel="noreferrer"
                >
                  Follow my activity
                </a>
              </button>
              <span>﹒</span>
              <button className="button button--tertiary">
                <a
                  href="https://www.buymeacoffee.com/a_ng_d"
                  target="_blank"
                  rel="noreferrer"
                >
                  Buy me a coffee
                </a>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
