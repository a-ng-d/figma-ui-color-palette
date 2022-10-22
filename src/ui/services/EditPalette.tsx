import * as React from 'react';
import Dispatcher from '../modules/Dispatcher';
import Slider from '../components/Slider';
import Switch from '../components/Switch';
import Button from '../components/Button';
import Message from '../components/Message';
import ColorItem from '../components/ColorItem';
import Tabs from '../components/Tabs';
import chroma from 'chroma-js';
import { palette } from '../../palette-package';

interface Props {
  scale: any;
  hasCaptions: boolean;
  colors: any;
  context: string;
  preset: any;
  onScaleChange: any;
  onCaptionsChange: any;
  onColorChange: any;
  onContextChange: any;
  onOrderChange: any
};

export default class EditPalette extends React.Component<Props> {

  dispatch: any;

  constructor(props) {
    super(props);
    this.dispatch = {
      scale: new Dispatcher(
        () => parent.postMessage({ pluginMessage: { type: 'update-scale', palette } }, '*'),
        500
      )
    };
    this.state = {
      selectedElement: {
        id: '',
        position: null
      },
      hoveredElement: {
        id: '',
        hasGuideAbove: false,
        hasGuideBelow: false,
        position: null
      }
    }
  }

  // Events
  slideHandler = (e: string) => {
    if (e === 'released') {
      this.dispatch.scale.on.status = false
      this.props.onScaleChange(palette)
    }
    else
      this.dispatch.scale.on.status = true
  }

  checkHandler = (e: any) => {
    this.props.onCaptionsChange(e.target.checked);
    palette.captions = e.target.checked;
    parent.postMessage({ pluginMessage: { type: 'update-captions', palette } }, '*')
    this.setState({
      selectedElement: {
        id: '',
        position: null
      }
    })
  }

  colorHandler = (e: any) => {
    this.props.onColorChange(e)
    this.setState({
      selectedElement: {
        id: '',
        position: null
      }
    })
  }

  navHandler = (e: any) => {
    this.props.onContextChange(e)
    this.setState({
      selectedElement: {
        id: '',
        position: null
      }
    })
  }

  selectionHandler = (e: any) => {
    const target: HTMLElement = e.currentTarget,
          neighbours: Array<Element> = Array.from(target.parentElement.children)
    if (target !== e.target) return;
    this.setState({
      selectedElement: {
        id: target.dataset.id,
        position: target.dataset.position
      }
    })
  }

  dragHandler = (id: string, hasGuideAbove: boolean, hasGuideBelow: boolean, position: number) => {
    this.setState({
      hoveredElement: {
        id: id,
        hasGuideAbove: hasGuideAbove,
        hasGuideBelow: hasGuideBelow,
        position: position
      }
    })
  }

  dropOutsideHandler = (e: any) => {
    const target: any = e.target,
          parent: any = target.parentNode,
          scrollY: any = parent.parentNode.parentNode.scrollTop,
          parentRefTop: number = parent.offsetTop,
          parentRefBottom: number = parentRefTop + parent.clientHeight;

    if (e.pageY + scrollY < parentRefTop)
      this.props.onOrderChange(this.state['selectedElement'], this.state['hoveredElement'])
    else if (e.pageY + scrollY > parentRefBottom)
      this.props.onOrderChange(this.state['selectedElement'], this.state['hoveredElement'])
  }

  dropHandler = (e: any) => {
    this.props.onOrderChange(this.state['selectedElement'], this.state['hoveredElement'])
  }

  unSelectColor = (e: any) => {
    e.target.closest('li.colors__item') == null ? this.setState({
      selectedElement: {
        id: '',
        position: null
      }
    }) : null
  }

  onCreate = () => {
    parent.postMessage({ pluginMessage: { type: 'create-local-styles', palette } }, '*')
    this.setState({
      selectedElement: {
        id: '',
        position: null
      }
    })
  }

  onUpdate = () => {
    parent.postMessage({ pluginMessage: { type: 'update-local-styles', palette } }, '*')
    this.setState({
      selectedElement: {
        id: '',
        position: null
      }
    })
  }

  // Templates
  Scale = () => {
    palette.scale = {};
    return (
      <div className='lightness-scale'>
      <div className='section-controls'>
        <div className='section-title'>Lightness scale</div>
        <div className='label'>{this.props.preset.name}</div>
      </div>
        <Slider
          type='CUSTOM'
          knobs={this.props.preset.scale}
          min=''
          max=''
          scale={this.props.scale}
          onChange={this.slideHandler}
        />
        <Message
          icon='library'
          messages= {[
            'Hold Shift ⇧ while dragging the first or the last knob to distribute knobs\' horizontal spacing',
            'Hold Ctrl ⌃ or Cmd ⌘ while dragging a knob to move them all'
          ]}
        />
      </div>
    )
  }

  Colors = () => {
    return (
      <div className='starting-colors'>
        <div className='section-controls'>
          <div className='section-title'>Starting colors</div>
          <Button
            id='add'
            icon='plus'
            type='icon'
            label={null}
            state=''
            action={this.colorHandler}
          />
        </div>
        <ul className='colors'>
          {this.props.colors.map((color, index) =>
            <ColorItem
              key={color.id}
              name={color.name}
              index={index}
              hex={chroma(color.rgb.r * 255, color.rgb.g * 255, color.rgb.b * 255).hex()}
              uuid={color.id}
              selected={this.state['selectedElement']['id'] === color.id ? true : false}
              guideAbove={this.state['hoveredElement']['id'] === color.id ? this.state['hoveredElement']['hasGuideAbove'] : false}
              guideBelow={this.state['hoveredElement']['id'] === color.id ? this.state['hoveredElement']['hasGuideBelow'] : false}
              onColorChange={this.colorHandler}
              onSelectionChange={this.selectionHandler}
              onDragChange={this.dragHandler}
              onDropOutside={this.dropOutsideHandler}
              onOrderChange={this.dropHandler}
            />
          )}
        </ul>
      </div>
    )
  }

  Actions = () => {
    return (
      <div className='actions'>
        <div className='buttons'>
          <Button
            id={null}
            icon={null}
            type='secondary'
            label='Update the local styles'
            state=''
            action={this.onUpdate}
          />
          <Button
            id={null}
            icon={null}
            type='primary'
            label='Create local styles'
            state=''
            action={this.onCreate}
          />
        </div>
        <Switch
          id='showCaptions'
          label='Show captions'
          isChecked={this.props.hasCaptions}
          onChange={this.checkHandler}
        />
      </div>
    )
  }

  Controls = () => {
    return (
      <>
      <div className='controls'>
        {this.props.context === 'Scale' ? <this.Scale /> : null}
        {this.props.context === 'Colors' ? <this.Colors /> : null}
      </div>
      <this.Actions />
      </>
    )
  }

  render() {
    palette.captions = this.props.hasCaptions;
    return (
      <>
        <Tabs
          tabs={['Scale', 'Colors']}
          active={this.props.context}
          onClick={this.navHandler}
        />
        <section
          onClick={this.unSelectColor}
        >
          <this.Controls />
        </section>
      </>
    )
  }

}
