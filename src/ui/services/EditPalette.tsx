import * as React from 'react';
import Dispatcher from '../modules/Dispatcher';
import Tabs from '../components/Tabs';
import Actions from '../modules/Actions';
import Scale from '../modules/Scale';
import Colors from '../modules/Colors';
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

  colorHandler = (e: any) => this.props.onColorChange(e)

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

  dropHandler = (e: any) => this.props.onOrderChange(this.state['selectedElement'], this.state['hoveredElement'])

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

  render() {
    palette.captions = this.props.hasCaptions;
    return (
      <>
        <Tabs
          primaryTabs={['Scale', 'Colors']}
          secondaryTabs={['About']}
          active={this.props.context}
          onClick={this.navHandler}
        />
        <section
          onClick={this.unSelectColor}
        >
          <div className='controls'>
            {this.props.context === 'Scale' ?
            <Scale
              hasPreset={false}
              preset={this.props.preset}
              scale={this.props.scale}
              onChangePreset={null}
              onScaleChange={this.slideHandler}
              onAddScale={null}
              onRemoveScale={null}
              onGoingStep={null}
            /> : null}
            {this.props.context === 'Colors' ?
            <Colors
              colors={this.props.colors}
              selectedElement={this.state['selectedElement']}
              hoveredElement={this.state['hoveredElement']}
              onColorChange={this.colorHandler}
              onAddColor={this.colorHandler}
              onSelectionChange={this.selectionHandler}
              onDragChange={this.dragHandler}
              onDropOutside={this.dropOutsideHandler}
              onOrderChange={this.dropHandler}
            /> : null}
          </div>
          <Actions
            context='edit'
            hasCaptions={this.props.hasCaptions}
            onCreatePalette={null}
            onCreateLocalColors={this.onCreate}
            onUpdateLocalColors={this.onUpdate}
            onChangeCaptions={this.checkHandler}
          />
        </section>
      </>
    )
  }

}
