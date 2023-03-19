import * as React from 'react'
import Button from '../components/Button'

interface Props {
  links: any
}

export default class HelpbBar extends React.Component<Props> {
  render() {
    return (
      <div className="help-bar">
        {this.props.links.map((links, index) =>
          index === this.props.links.length - 1 ? (
            <Button
              type="tertiary"
              isLink={true}
              url={links.url}
              label={links.label}
            />
          ) : (
            <>
              <Button
                type="tertiary"
                isLink={true}
                url={links.url}
                label={links.label}
              />
              <span>﹒</span>
            </>
          )
        )}
      </div>
    )
  }
}
