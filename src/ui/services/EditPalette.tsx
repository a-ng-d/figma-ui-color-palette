import * as React from 'react'
import Dispatcher from '../modules/Dispatcher'
import Tabs from '../components/Tabs'
import Scale from '../modules/Scale'
import Colors from '../modules/Colors'
import Export from '../modules/Export'
import Settings from '../modules/Settings'
import About from '../modules/About'
import Actions from '../modules/Actions'
import HelpbBar from '../modules/HelpBar'
import chroma from 'chroma-js'
import { palette } from '../../utils/palettePackage'
import { v4 as uuidv4 } from 'uuid'

interface Props {
  scale: any
  hasCaptions: boolean
  colors: any
  preset: any
  export: any
  paletteName: string
  onHighlightReopen: any
  onScaleChange: any
  onChangeStop: any
  onColorChange: any
  onCaptionsChange: any
  onSettingsChange: any
}

let colors
export default class EditPalette extends React.Component<Props> {
  dispatch: any

  constructor(props) {
    super(props)
    this.dispatch = {
      scale: new Dispatcher(
        () =>
          parent.postMessage(
            {
              pluginMessage: {
                type: 'update-scale',
                data: palette,
                isEditedInRealTime: true,
              },
            },
            '*'
          ),
        500
      ),
      colors: new Dispatcher(
        () =>
          parent.postMessage(
            {
              pluginMessage: {
                type: 'update-colors',
                data: colors,
                isEditedInRealTime: true,
              },
            },
            '*'
          ),
        500
      ),
    }
    this.state = {
      selectedElement: {
        id: '',
        position: null,
      },
      hoveredElement: {
        id: '',
        hasGuideAbove: false,
        hasGuideBelow: false,
        position: null,
      },
      context: 'Scale',
    }
  }

  // Handlers
  slideHandler = (e: string) => {
    if (e === 'released') {
      this.dispatch.scale.on.status = false
      parent.postMessage(
        {
          pluginMessage: {
            type: 'update-scale',
            data: palette,
            isEditedInRealTime: false,
          },
        },
        '*'
      )
      this.props.onScaleChange()
    } else if (e === 'customized') {
      parent.postMessage(
        {
          pluginMessage: {
            type: 'update-scale',
            data: palette,
            isEditedInRealTime: false,
          },
        },
        '*'
      )
      this.props.onChangeStop()
    } else this.dispatch.scale.on.status = true
  }

  checkHandler = (e: any) => {
    this.props.onCaptionsChange(e.target.checked)
    palette.captions = e.target.checked
    parent.postMessage(
      { pluginMessage: { type: 'update-captions', data: palette } },
      '*'
    )
    this.setState({
      selectedElement: {
        id: '',
        position: null,
      },
    })
  }

  colorHandler = (e: any) => {
    let id, element
    element = e.nativeEvent.path.filter((el) => {
      if (el.classList != undefined)
        return el.classList.contains('colors__item')
    })[0]

    element != undefined ? (id = element.getAttribute('data-id')) : null

    switch (e.target.dataset.feature) {
      case 'hex': {
        const code =
          e.target.value.indexOf('#') == -1
            ? '#' + e.target.value
            : e.target.value
        if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(code)) {
          colors = this.props.colors.map((item) => {
            const rgb = chroma(
              e.target.value.indexOf('#') == -1
                ? '#' + e.target.value
                : e.target.value
            )._rgb
            if (item.id === id)
              item.rgb = {
                r: rgb[0] / 255,
                g: rgb[1] / 255,
                b: rgb[2] / 255,
              }
            return item
          })
          this.props.onColorChange(colors)
        }
        if (e._reactName === 'onBlur') {
          this.dispatch.colors.on.status = false
          parent.postMessage(
            {
              pluginMessage: {
                type: 'update-colors',
                data: colors,
                isEditedInRealTime: false,
              },
            },
            '*'
          )
        } else this.dispatch.colors.on.status = true
        break
      }
      case 'lightness': {
        colors = this.props.colors.map((item) => {
          const rgb = chroma(
            item.rgb.r * 255,
            item.rgb.g * 255,
            item.rgb.b * 255
          ).set('lch.l', e.target.value)._rgb
          if (item.id === id)
            item.rgb = {
              r: rgb[0] / 255,
              g: rgb[1] / 255,
              b: rgb[2] / 255,
            }
          return item
        })
        this.props.onColorChange(colors)
        parent.postMessage(
          {
            pluginMessage: {
              type: 'update-colors',
              data: colors,
              isEditedInRealTime: false,
            },
          },
          '*'
        )
        break
      }
      case 'chroma': {
        colors = this.props.colors.map((item) => {
          const rgb = chroma(
            item.rgb.r * 255,
            item.rgb.g * 255,
            item.rgb.b * 255
          ).set('lch.c', e.target.value)._rgb
          if (item.id === id)
            item.rgb = {
              r: rgb[0] / 255,
              g: rgb[1] / 255,
              b: rgb[2] / 255,
            }
          return item
        })
        this.props.onColorChange(colors)
        parent.postMessage(
          {
            pluginMessage: {
              type: 'update-colors',
              data: colors,
              isEditedInRealTime: false,
            },
          },
          '*'
        )
        break
      }
      case 'hue': {
        colors = this.props.colors.map((item) => {
          const rgb = chroma(
            item.rgb.r * 255,
            item.rgb.g * 255,
            item.rgb.b * 255
          ).set('lch.h', e.target.value)._rgb
          if (item.id === id)
            item.rgb = {
              r: rgb[0] / 255,
              g: rgb[1] / 255,
              b: rgb[2] / 255,
            }
          return item
        })
        this.props.onColorChange(colors)
        parent.postMessage(
          {
            pluginMessage: {
              type: 'update-colors',
              data: colors,
              isEditedInRealTime: false,
            },
          },
          '*'
        )
        break
      }
      case 'remove': {
        colors = this.props.colors.filter((item) => item.id != id)
        this.props.onColorChange(colors)
        parent.postMessage(
          {
            pluginMessage: {
              type: 'update-colors',
              data: colors,
              isEditedInRealTime: false,
            },
          },
          '*'
        )
        break
      }
      case 'add': {
        colors = this.props.colors
        const hasAlreadyNewUIColor = colors.filter((color) =>
          color.name.includes('New UI Color')
        )
        colors.push({
          name: `New UI Color ${hasAlreadyNewUIColor.length + 1}`,
          rgb: {
            r: 0.53,
            g: 0.92,
            b: 0.97,
          },
          id: uuidv4(),
          oklch: false,
          hueShifting: 0,
        })
        this.props.onColorChange(colors)
        parent.postMessage(
          {
            pluginMessage: {
              type: 'update-colors',
              data: colors,
              isEditedInRealTime: false,
            },
          },
          '*'
        )
        break
      }
      case 'rename': {
        const hasSameName = this.props.colors.filter(
          (color) => color.name === e.target.value
        )
        colors = this.props.colors.map((item) => {
          if (item.id === id)
            item.name =
              hasSameName.length > 1 ? e.target.value + ' 2' : e.target.value
          return item
        })
        this.props.onColorChange(colors)
        e._reactName === 'onBlur'
          ? parent.postMessage(
              {
                pluginMessage: {
                  type: 'update-colors',
                  data: colors,
                  isEditedInRealTime: false,
                },
              },
              '*'
            )
          : null
        e.key === 'Enter'
          ? parent.postMessage(
              {
                pluginMessage: {
                  type: 'update-colors',
                  data: colors,
                  isEditedInRealTime: false,
                },
              },
              '*'
            )
          : null
        break
      }
      case 'oklch': {
        colors = this.props.colors.map((item) => {
          if (item.id === id) item.oklch = e.target.checked
          return item
        })
        this.props.onColorChange(colors)
        parent.postMessage(
          {
            pluginMessage: {
              type: 'update-colors',
              data: colors,
              isEditedInRealTime: false,
            },
          },
          '*'
        )
        break
      }
      case 'shift-hue': {
        colors = this.props.colors.map((item) => {
          if (item.id === id) item.hueShifting = parseFloat(e.target.value)
          return item
        })
        this.props.onColorChange(colors)
        parent.postMessage(
          {
            pluginMessage: {
              type: 'update-colors',
              data: colors,
              isEditedInRealTime: false,
            },
          },
          '*'
        )
      }
    }
  }

  orderHandler = () => {
    const source: any = this.state['selectedElement'],
      target: any = this.state['hoveredElement'],
      colors = this.props.colors.map((el) => el)

    let position

    const colorsWithoutSource = colors.splice(source.position, 1)[0]

    if (target.hasGuideAbove && target.position > source.position)
      position = parseFloat(target.position) - 1
    else if (target.hasGuideBelow && target.position > source.position)
      position = parseFloat(target.position)
    else if (target.hasGuideAbove && target.position < source.position)
      position = parseFloat(target.position)
    else if (target.hasGuideBelow && target.position < source.position)
      position = parseFloat(target.position) + 1
    else position = parseFloat(target.position)

    colors.splice(position, 0, colorsWithoutSource)
    this.setState({
      newColors: colors,
      onGoingStep: 'color changed',
    })
    this.props.onColorChange(colors)
    parent.postMessage(
      {
        pluginMessage: {
          type: 'update-colors',
          data: colors,
          isEditedInRealTime: false,
        },
      },
      '*'
    )
  }

  navHandler = (e: any) =>
    this.setState({
      context: e.target.innerText,
      onGoingStep: 'tab changed',
    })

  selectionHandler = (e: any) => {
    const target: HTMLElement = e.currentTarget
    if (target !== e.target) return
    this.setState({
      selectedElement: {
        id: target.dataset.id,
        position: target.dataset.position,
      },
    })
  }

  dragHandler = (
    id: string,
    hasGuideAbove: boolean,
    hasGuideBelow: boolean,
    position: number
  ) => {
    this.setState({
      hoveredElement: {
        id: id,
        hasGuideAbove: hasGuideAbove,
        hasGuideBelow: hasGuideBelow,
        position: position,
      },
    })
  }

  dropOutsideHandler = (e: any) => {
    const target: any = e.target,
      parent: any = target.parentNode,
      scrollY: any = parent.parentNode.parentNode.scrollTop,
      parentRefTop: number = parent.offsetTop,
      parentRefBottom: number = parentRefTop + parent.clientHeight

    if (e.pageY + scrollY < parentRefTop) this.orderHandler()
    else if (e.pageY + scrollY > parentRefBottom) this.orderHandler()
  }

  settingsHandler = (e: any) => this.props.onSettingsChange(e)

  unSelectColor = (e: any) => {
    e.target.closest('li.colors__item') == null
      ? this.setState({
          selectedElement: {
            id: '',
            position: null,
          },
        })
      : null
  }

  // Direct actions
  onCreate = () => {
    parent.postMessage(
      { pluginMessage: { type: 'create-local-styles', data: palette } },
      '*'
    )
    this.setState({
      selectedElement: {
        id: '',
        position: null,
      },
    })
  }

  onUpdate = () => {
    parent.postMessage(
      { pluginMessage: { type: 'update-local-styles', data: palette } },
      '*'
    )
    this.setState({
      selectedElement: {
        id: '',
        position: null,
      },
    })
  }

  onExport = () => {
    const a = document.createElement('a'),
      file = new Blob([this.props.export.data], {
        type: this.props.export.mimeType,
      })
    a.href = URL.createObjectURL(file)
    a.download = 'colors'
    a.click()
  }

  render() {
    palette.captions = this.props.hasCaptions
    let actions, controls, help

    if (this.state['context'] === 'Export') {
      actions = (
        <Actions
          context="export"
          exportType={this.props.export.format}
          onExportPalette={this.onExport}
        />
      )

      help = (
        <HelpbBar
          actions={[
            {
              label: 'Read the documentation',
              isLink: true,
              url: 'https://docs.ui-color-palette.com',
              action: null
            },
            {
              label: 'Give feedback',
              isLink: true,
              url: 'https://kutt.it/voice-of-uicp-users',
              action: null
            },
            {
              label: 'What\'s new',
              isLink: false,
              url: '',
              action: this.props.onHighlightReopen
            },
          ]}
        />
      )
    } else if (this.state['context'] === 'About') {
      actions = help = null
    } else {
      actions = (
        <Actions
          context="edit"
          hasCaptions={this.props.hasCaptions}
          onCreateLocalColors={this.onCreate}
          onUpdateLocalColors={this.onUpdate}
          onChangeCaptions={this.checkHandler}
        />
      )

      help = (
        <HelpbBar
          actions={[
            {
              label: 'Read the documentation',
              isLink: true,
              url: 'https://docs.ui-color-palette.com',
              action: null
            },
            {
              label: 'Give feedback',
              isLink: true,
              url: 'https://kutt.it/voice-of-uicp-users',
              action: null
            },
            {
              label: 'What\'s new',
              isLink: false,
              url: '',
              action: this.props.onHighlightReopen
            },
          ]}
        />
      )
    }

    switch (this.state['context']) {
      case 'Scale': {
        controls = (
          <Scale
            hasPreset={false}
            preset={this.props.preset}
            scale={this.props.scale}
            onScaleChange={this.slideHandler}
          />
        )
        break
      }
      case 'Colors': {
        controls = (
          <Colors
            colors={this.props.colors}
            selectedElement={this.state['selectedElement']}
            hoveredElement={this.state['hoveredElement']}
            onColorChange={this.colorHandler}
            onAddColor={this.colorHandler}
            onSelectionChange={this.selectionHandler}
            onDragChange={this.dragHandler}
            onDropOutside={this.dropOutsideHandler}
            onOrderChange={this.orderHandler}
          />
        )
        break
      }
      case 'Export': {
        controls = <Export exportPreview={this.props.export.data} />
        break
      }
      case 'Settings': {
        controls = (
          <Settings
            paletteName={this.props.paletteName}
            onSettingsChange={this.settingsHandler}
          />
        )
        break
      }
      case 'About': {
        controls = <About />
      }
    }

    return (
      <>
        <Tabs
          primaryTabs={['Scale', 'Colors', 'Export', 'Settings']}
          secondaryTabs={['About']}
          active={this.state['context']}
          onClick={this.navHandler}
        />
        <section
          onClick={this.unSelectColor}
          className={
            this.state['context'] === 'Colors' ? 'section--scrollable' : ''
          }
        >
          <div className="controls">{controls}</div>
          {actions}
        </section>
        {help}
      </>
    )
  }
}
