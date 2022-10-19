import * as React from 'react';
import chroma from 'chroma-js';
import Input from './Input';
import Button from './Button';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  name: string;
  hex: string;
  uuid: string;
  index: number;
  selected: boolean;
  onColorChange: any;
  onSelectionChange: any;
};

export default class ColorItem extends React.Component<Props> {

  constructor(props) {
    super(props);
    this.state = {
      isDragged: false
    }
  }

  // Events
  inputHandler = (e: any) => this.props.onColorChange(e)

  onMouseDown = (e: any) => this.props.onSelection(e)

  onDragStart = (e: any) => {
    this.setState({ isDragged: true })
    var img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
    e.dataTransfer.setDragImage(img, 0, 0);
    console.log(e.currentTarget.dataset)
  }

  onDragEnd = (e: any) => this.setState({ isDragged: false, isAbove: false, isBelow: false })

  render() {
    return(
      <li
        id={this.props.name.split(' ').join('-').toLowerCase()}
        data-id={this.props.uuid}
        data-color={this.props.name.split(' ').join('-').toLowerCase()}
        data-position={this.props.index}
        className={`colors__item${this.state['isDragged'] ? ' colors__item--dragged' : ''}${this.state['isAbove'] ? ' colors__item--above' : ''}${this.state['isBelow'] ? ' colors__item--below' : ''}`}
        draggable={this.props.dragged}
        draggable={this.props.selected}
        onMouseDown={this.onMouseDown}
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
      >
        <div className="colors__left-options">
          <Input
            type='text'
            id='rename'
            icon={{type: 'none', value: null}}
            value={this.props.name}
            min=''
            max=''
            onChange={this.inputHandler}
          />
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
              value={chroma(this.props.hex).lch()[2].toFixed(0) == 'NaN' ? 0 : chroma(this.props.hex).lch()[2].toFixed(0)}
              min='0'
              max='360'
              onChange={this.inputHandler}
            />
          </div>
        </div>
        <div className="colors__right-options">
          <Button
            id='remove'
            icon='minus'
            type='icon'
            label={null}
            state=''
            action={this.inputHandler}
          />
        </div>
      </li>
    )
  }

}
