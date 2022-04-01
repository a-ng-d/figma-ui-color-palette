import * as React from 'react';
import { selectMenu } from 'figma-plugin-ds';

interface Props {
  id: string;
  options: Array<string>;
  onChange: any;
};

export default class Dropdown extends React.Component<Props> {

  componentDidMount = () => {
    selectMenu.init();
    document.getElementById('presets').onchange = (e) => this.props.onChange(e)
  }

  render() {
    return(
      <select id={this.props.id} className='select-menu'>
        {this.props.options.map((option, index) => <option key={index} value={option}>{option}</option>)}
      </select>
    )
  }

}
