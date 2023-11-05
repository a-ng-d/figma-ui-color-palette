import * as React from 'react'

interface Props {
  tabs: Array<{
    label: string
    id: string
  }>
  active: string
  action: React.MouseEventHandler
}

export default class Tabs extends React.Component<Props> {
  render() {
    return (
      <div className="tabs">
        {this.props.tabs.map((tab) => (
          <div
            key={tab.label.toLowerCase()}
            className={[
              'tabs__tab',
              'type',
              this.props.active === tab.id ? 'tabs__tab--active' : null,
            ]
              .filter((n) => n)
              .join(' ')}
            data-feature={tab.id}
            onMouseDown={this.props.action}
          >
            {tab.label}
          </div>
        ))}
      </div>
    )
  }
}
