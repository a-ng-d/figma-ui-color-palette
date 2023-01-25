import * as React from 'react';
import { selectMenu } from 'figma-plugin-ds';

interface Props {
  id: string;
  options: Array<string>;
  selected: string;
  onChange: any;
}

export default class Dropdown extends React.Component<Props> {

  componentDidMount = () => {
    selectMenu.init();
    document.getElementById(this.props.id).onchange = (e) => this.props.onChange(e)
  }

  render() {
    return(
      <select id={this.props.id} className='select-menu' defaultValue={this.props.selected}>
        {this.props.options.map((option, index) => <option key={index} value={option}>{option}</option>)}
      </select>
    )
  }

}
