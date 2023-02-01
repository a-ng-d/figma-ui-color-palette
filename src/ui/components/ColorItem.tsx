import * as React from 'react';
import chroma from 'chroma-js';
import Input from './Input';
import Button from './Button';
import Switch from './Switch';
import { doMap } from './../../utils/doMap';

interface Props {
  name: string;
  hex: string;
  oklch: boolean;
  shift: number;
  uuid: string;
  index: number;
  selected: boolean;
  guideAbove: boolean;
  guideBelow: boolean;
  onColorChange: any;
  onSelectionChange: any;
  onSelectionCancellation: any;
  onDragChange: any;
  onDropOutside: any
  onOrderChange: any
}

export default class ColorItem extends React.Component<Props> {

  constructor(props) {
    super(props);
    this.state = {
      isDragged: false,
      hasMoreOptions: false
    }
  }

  // Events
  inputHandler = (e: any) => this.props.onColorChange(e)

  optionsHandler = (e: any) => {
    this.props.onSelectionCancellation(e)
    this.setState({ hasMoreOptions: !this.state['hasMoreOptions'] })
  }

  selectionHandler = (e: any) => this.props.onSelectionCancellation(e)

  onMouseDown = (e: any) => this.props.onSelectionChange(e)

  onDragStart = (e: any) => {
    this.setState({ isDragged: true })
    const clone = e.currentTarget.cloneNode(true)
    clone.style.opacity = 0;
    clone.id = 'ghost';
    document.body.appendChild(clone);
    e.dataTransfer.setDragImage(clone, 0, 0);
    e.dataTransfer.effectAllowed = 'move';
    document.querySelector('#react-page').classList.add('dragged-ghost')
  }

  onDragEnd = (e: any) => {
    this.setState({ isDragged: false });
    this.props.onDragChange('', false, false, undefined);
    this.props.onDropOutside(e);
    document.querySelector('#react-page').classList.remove('dragged-ghost')
    document.querySelector('#ghost').remove()
  }

  onDragOver = (e: any) => {
    e.preventDefault();
    const target: any = e.currentTarget,
          height: number = target.clientHeight,
          parentY: number = target.parentNode.offsetTop,
          scrollY: number = target.parentNode.parentNode.parentNode.scrollTop,
          refTop: number = target.offsetTop - parentY,
          refBottom: number = refTop + height,
          y: number = e.pageY - parentY + scrollY,
          refY: number = doMap(y, refTop, refBottom, 0, height);

    if (refY >= -1 && refY <= height / 2)
      this.props.onDragChange(target.dataset.id, true, false, target.dataset.position)
    else if (refY > height / 2 && refY <= height)
      this.props.onDragChange(target.dataset.id, false, true, target.dataset.position)
  }

  onDrop = (e: any) => {
    e.preventDefault();
    this.props.onOrderChange(e)
  }

  render() {
    return(
      <li
        id={this.props.name.split(' ').join('-').toLowerCase()}
        data-id={this.props.uuid}
        data-color={this.props.name.split(' ').join('-').toLowerCase()}
        data-position={this.props.index}
        className={`colors__item${this.state['isDragged'] ? ' colors__item--dragged' : ''}${this.props.guideAbove ? ' colors__item--above' : ''}${this.props.guideBelow ? ' colors__item--below' : ''}${this.state['hasMoreOptions'] ? ' colors__item--emphasis' : ''}`}
        draggable={this.props.selected}
        onMouseDown={this.onMouseDown}
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
        onDragOver={this.onDragOver}
        onDrop={this.onDrop}
      >
        <div className='colors__name'>
          <Input
            type='text'
            icon={{type: 'none', value: null}}
            value={this.props.name}
            feature='rename'
            onChange={this.inputHandler}
            onFocus={this.selectionHandler}
            onConfirm={this.inputHandler}
          />
        </div>
        <div className='colors__parameters'>
          <Input
            type='color'
            icon={{type: 'none', value: null}}
            value={this.props.hex}
            feature='hex'
            onChange={this.inputHandler}
            onFocus={this.selectionHandler}
          />
          <div className='inputs'>
            <div className='label'>LCH</div>
            <div className='inputs__bar'>
              <Input
                type='number'
                icon={{type: 'none', value: null}}
                value={chroma(this.props.hex).lch()[0].toFixed(0)}
                min='0'
                max='100'
                feature='lightness'
                onChange={this.inputHandler}
                onFocus={this.selectionHandler}
              />
              <Input
                type='number'
                icon={{type: 'none', value: null}}
                value={chroma(this.props.hex).lch()[1].toFixed(0)}
                min='0'
                max='100'
                feature='chroma'
                onChange={this.inputHandler}
                onFocus={this.selectionHandler}
              />
              <Input
                type='number'
                icon={{type: 'none', value: null}}
                value={chroma(this.props.hex).lch()[2].toFixed(0) == 'NaN' ? 0 : chroma(this.props.hex).lch()[2].toFixed(0)}
                min='0'
                max='360'
                feature='hue'
                onChange={this.inputHandler}
                onFocus={this.selectionHandler}
              />
            </div>
          </div>
        </div>
        <div className='colors__buttons'>
          <Button
            icon='adjust'
            type='icon'
            state={this.state['hasMoreOptions'] ? 'selected' : ''}
            feature='more'
            action={this.optionsHandler}
          />
          <Button
            icon='minus'
            type='icon'
            feature='remove'
            action={this.inputHandler}
          />
        </div>
        {this.state['hasMoreOptions'] ?
        <div className='colors__space'>
          <Switch
            id={'oklch-' + this.props.uuid}
            label='Use OKLCH'
            isChecked={this.props.oklch}
            isDisabled={false}
            feature='oklch'
            onChange={this.inputHandler}
          />
        </div> : null}
        {this.state['hasMoreOptions'] ?
        <div className='colors__shift'>
          <Input
            type='number'
            icon={{type: 'icon', value: 'arrow-left-right'}}
            value={this.props.shift.toString()}
            min='-360'
            max='360'
            feature='shift-hue'
            onChange={this.inputHandler}
            onFocus={this.selectionHandler}
          />
        </div> : null }
      </li>
    )
  }

}
