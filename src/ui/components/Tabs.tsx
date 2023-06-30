import * as React from 'react'

interface Props {
  primaryTabs: Array<{
    label: string
    id: string
  }>
  secondaryTabs: Array<{
    label: string
    id: string
  }>
  active: string
  action: React.MouseEventHandler
}

export default class Tabs extends React.Component<Props> {
  render = () => {
    return (
      <div className="tabs">
        <div className="tabs__primary">
          {this.props.primaryTabs.map((tab) => (
            <div
              key={tab.label.toLowerCase()}
              className={`tabs__tab type${
                this.props.active === tab.id ? ' tabs__tab--active' : ''
              }`}
              data-feature={tab.id}
              onMouseDown={this.props.action}
            >
              {tab.label}
            </div>
          ))}
        </div>
        {this.props.secondaryTabs != null ? (
          <div className="tabs__secondary">
            {this.props.secondaryTabs.map((tab) => (
              <div
                key={tab.label.toLowerCase()}
                className={`tabs__tab type${
                  this.props.active === tab.id ? ' tabs__tab--active' : ''
                }`}
                data-feature={tab.id}
                onMouseDown={this.props.action}
              >
                {tab.label}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    )
  }
}
