import * as React from 'react';
import chroma from 'chroma-js';
import Input from './Input';

interface Props {
  name: string;
  hex: string
};

export default class ColorItem extends React.Component<Props> {

  render() {
    return(
      <li className='colors__item' key={this.props.name}>
        <label className='label'>{this.props.name}</label>
        <div className='colors__parameters'>
          <Input
            type='color'
            icon={{type: 'none', value: null}}
            value={this.props.hex}
            min=''
            max=''
            action=''
          />
          <Input
            type='number'
            icon={{type: 'letter', value: 'L'}}
            value={chroma(this.props.hex).lch()[0].toFixed(0)}
            min='0'
            max='100'
            action=''
          />
          <Input
            type='number'
            icon={{type: 'letter', value: 'C'}}
            value={chroma(this.props.hex).lch()[1].toFixed(0)}
            min='0'
            max='100'
            action=''
          />
          <Input
            type='number'
            icon={{type: 'letter', value: 'H'}}
            value={chroma(this.props.hex).lch()[2].toFixed(0)}
            min='0'
            max='360'
            action=''
          />
        </div>
        <div className='icon-button'>
          <div className='icon icon--minus'></div>
        </div>
      </li>
    )
  }

}
