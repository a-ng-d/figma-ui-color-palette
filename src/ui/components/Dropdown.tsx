import * as React from 'react';

interface Props {
  id: string;
  options: Array<string>
};

export default class Dropdown extends React.Component<Props> {

  render() {
    return(
      <select id={this.props.id} className='select-menu'>
        {this.props.options.map((option, index) => <option key={option} value={index}>{option}</option>)}
      </select>
    )
  }

}
