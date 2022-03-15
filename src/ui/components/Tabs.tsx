import * as React from 'react';

interface Props {
  tabs: string;
  active: string;
  onClick: any
};

export default class Tabs extends React.Component<Props> {

  render() {
    return(
      <div className='tabs'>
        {this.props.tabs.split(' ').map(tab =>
          <div key={tab.toLowerCase()} className={`tabs__tab type${this.props.active === tab ? ' tabs__tab--active' : ''}`} onClick={this.props.onClick}>{tab}</div>
        )}
      </div>
    )
  }

}
