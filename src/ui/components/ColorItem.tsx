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
  guideAbove: boolean;
  guideBelow: boolean;
  onColorChange: any;
  onSelectionChange: any;
  onDragChange: any
};

export default class ColorItem extends React.Component<Props> {

  constructor(props) {
    super(props);
    this.state = {
      isDragged: false
    }
  }

  doMap = (value: number, oldMin: number, oldMax: number, newMin: number, newMax: number) => {
    const oldRange = oldMax - oldMin,
        newRange = newMax - newMin
    return ((value - oldMin) * newRange / oldRange) + newMin
  }

  // Events
  inputHandler = (e: any) => this.props.onColorChange(e)

  onMouseDown = (e: any) => this.props.onSelectionChange(e)

  onDragStart = (e: any) => {
    this.setState({ isDragged: true })
    var img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
    e.dataTransfer.setDragImage(img, 0, 0);
    console.log(e.currentTarget.dataset)
  }

  onDragEnd = (e: any) => {
    this.setState({ isDragged: false })
    this.props.onDragChange('', false, false)
  }

  onDragOver = (e: any) => {
    const target: any = e.target,
          height: number = target.clientHeight,
          parentY: number = target.parentNode.offsetTop,
          scrollY: number = target.parentNode.parentNode.parentNode.scrollTop,
          refTop: number = target.offsetTop - parentY,
          refBottom: number = refTop + height,
          breakpoint: number = refTop + (height / 2),
          y: number = e.pageY - parentY + scrollY;

    let refY: number;

    e.preventDefault()

    refY = this.doMap(y, refTop, refBottom, 0, height)

    if (refY >= -1 && refY <= height / 2)
      this.props.onDragChange(target.dataset.id, true, false)
    else if (refY > height / 2 && refY <= height)
      this.props.onDragChange(target.dataset.id, false, true)
  }

  render() {
    return(
      <li
        id={this.props.name.split(' ').join('-').toLowerCase()}
        data-id={this.props.uuid}
        data-color={this.props.name.split(' ').join('-').toLowerCase()}
        data-position={this.props.index}
        className={`colors__item${this.state['isDragged'] ? ' colors__item--dragged' : ''}${this.props.guideAbove ? ' colors__item--above' : ''}${this.props.guideBelow ? ' colors__item--below' : ''}`}
        draggable={this.props.selected}
        onMouseDown={this.onMouseDown}
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
        onDragOver={this.onDragOver}
      >
        <div className="colors__left-options">
          <div id="reorder" className="icon icon--list"></div>
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
