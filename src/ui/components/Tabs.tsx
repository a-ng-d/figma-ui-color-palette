import * as React from 'react';

interface Props {
  primaryTabs: Array<string>;
  secondaryTabs: Array<string>;
  active: string;
  onClick: any
};

export default class Tabs extends React.Component<Props> {

  render() {
    return(
      <div className='tabs'>
        <div className='tabs__primary'>
          {this.props.primaryTabs.map(tab =>
            <div
              key={tab.toLowerCase()}
              className={`tabs__tab type${this.props.active === tab ? ' tabs__tab--active' : ''}`}
              onClick={this.props.onClick}>{tab}
            </div>
          )}
        </div>
        {this.props.secondaryTabs != null ?
          <div className='tabs__secondary'>
            {this.props.secondaryTabs.map(tab =>
              <div
                key={tab.toLowerCase()}
                className={`tabs__tab type${this.props.active === tab ? ' tabs__tab--active' : ''}`}
                onClick={this.props.onClick}>{tab}
              </div>
            )}
          </div>
        : null}
      </div>
    )
  }

}
