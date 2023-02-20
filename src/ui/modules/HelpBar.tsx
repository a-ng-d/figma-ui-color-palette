import * as React from 'react'
interface Props {
  links: any
}

export default class HelpbBar extends React.Component<Props> {
  render() {
    return (
      <div className="help-bar">
        {this.props.links.map((links, index) => (
          index === this.props.links.length - 1 ?
          <button className="button button--tertiary">
            <a
              href={links.url}
              target="_blank"
              rel="noreferrer"
            >
              {links.label}
            </a>
          </button>
          :
          <>
            <button className="button button--tertiary">
              <a
                href={links.url}
                target="_blank"
                rel="noreferrer"
              >
                {links.label}
              </a>
            </button>
            <span>﹒</span>
          </>
        ))}
      </div>
    )
  }
}
