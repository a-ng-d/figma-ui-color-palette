import * as React from 'react';
import chroma from 'chroma-js';
import Input from './Input';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  name: string;
  hex: string;
  uuid: string;
  onColorChange: any
};

export default class ColorItem extends React.Component<Props> {

  inputHandler = (e: any) => this.props.onColorChange(e)

  render() {
    return(
      <li id={this.props.name} data-id={this.props.uuid} className='colors__item'>
        <label className='label'>{this.props.name}</label>
        <div className='colors__parameters'>
          <Input
            type='color'
            id='hex'
            icon={{type: 'none', value: null}}
            value={this.props.hex}
            min=''
            max=''
            onChange={this.inputHandler}
          />
          <Input
            type='number'
            id='lightness'
            icon={{type: 'letter', value: 'L'}}
            value={chroma(this.props.hex).lch()[0].toFixed(0)}
            min='0'
            max='100'
            onChange={this.inputHandler}
          />
          <Input
            type='number'
            id='chroma'
            icon={{type: 'letter', value: 'C'}}
            value={chroma(this.props.hex).lch()[1].toFixed(0)}
            min='0'
            max='100'
            onChange={this.inputHandler}
          />
          <Input
            type='number'
            id='hue'
            icon={{type: 'letter', value: 'H'}}
            value={chroma(this.props.hex).lch()[2].toFixed(0)}
            min='0'
            max='360'
            onChange={this.inputHandler}
          />
        </div>
        <div id='remove' className='icon-button' onClick={this.inputHandler}>
          <div className='icon icon--minus'></div>
        </div>
      </li>
    )
  }

}
