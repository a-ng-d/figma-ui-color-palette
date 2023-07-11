import * as React from 'react'
import chroma from 'chroma-js'
import JSZip from 'JSZip'
import FileSaver from 'file-saver'
import type {
  ColorsMessage,
  PresetConfiguration,
  TextColorsThemeHexModel,
  ColorConfiguration,
  ThemeConfiguration,
  ExportConfiguration,
  HoveredColor,
  SelectedColor,
  DispatchProcess,
  ActionsList,
  ScaleConfiguration,
  ThemesMessage,
} from '../../utils/types'
import Dispatcher from '../modules/Dispatcher'
import Tabs from '../components/Tabs'
import Scale from '../modules/Scale'
import Colors from '../modules/Colors'
import Themes from '../modules/Themes'
import Export from '../modules/Export'
import Settings from '../modules/Settings'
import About from '../modules/About'
import { palette } from '../../utils/palettePackage'
import features from '../../utils/features'
import { locals } from '../../content/locals'
import { v4 as uuidv4 } from 'uuid'

interface Props {
  name: string
  preset: PresetConfiguration
  scale: ScaleConfiguration
  colors: Array<ColorConfiguration>
  colorSpace: string
  themes: Array<ThemeConfiguration>
  view: string
  textColorsTheme: TextColorsThemeHexModel
  algorithmVersion: string
  export: ExportConfiguration
  editorType: string
  planStatus: string
  lang: string
  onChangeScale: () => void
  onChangeStop: () => void
  onChangeColor: (colors: Array<ColorConfiguration>) => void
  onChangeTheme: (themes: Array<ThemeConfiguration>) => void
  onChangeView: (view: string) => void
  onChangeSettings: React.ChangeEventHandler
}

const colorsMessage: ColorsMessage = {
  type: 'UPDATE_COLORS',
  data: [],
  isEditedInRealTime: false,
},
themeMessage: ThemesMessage = {
  type: 'UPDATE_THEMES',
  data: [],
  isEditedInRealTime: false,
}

export default class EditPalette extends React.Component<Props> {
  dispatch: { [key: string]: DispatchProcess }

  constructor(props) {
    super(props)
    this.dispatch = {
      scale: new Dispatcher(
        () =>
          parent.postMessage(
            {
              pluginMessage: {
                type: 'UPDATE_SCALE',
                data: palette,
                isEditedInRealTime: true,
              },
            },
            '*'
          ),
        500
      ),
      colors: new Dispatcher(
        () => parent.postMessage({ pluginMessage: colorsMessage }, '*'),
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
      context:
        features.filter(
          (feature) =>
            feature.type === 'CONTEXT' &&
            feature.service.includes('EDIT') &&
            feature.isActive
        )[0] != undefined
          ? features.filter(
              (feature) =>
                feature.type === 'CONTEXT' &&
                feature.service.includes('EDIT') &&
                feature.isActive
            )[0].name
          : '',
    }
  }

  // Handlers
  slideHandler = (state: string) => {
    const onReleaseStop = () => {
      this.dispatch.scale.on.status = false
      parent.postMessage(
        {
          pluginMessage: {
            type: 'UPDATE_SCALE',
            data: palette,
            isEditedInRealTime: false,
          },
        },
        '*'
      )
      this.props.onChangeScale()
    }

    const onChangeStop = () => {
      parent.postMessage(
        {
          pluginMessage: {
            type: 'UPDATE_SCALE',
            data: palette,
            isEditedInRealTime: false,
          },
        },
        '*'
      )
      this.props.onChangeStop()
    }

    const onTypeStopValue = () => {
      parent.postMessage(
        {
          pluginMessage: {
            type: 'UPDATE_SCALE',
            data: palette,
            isEditedInRealTime: false,
          },
        },
        '*'
      )
      this.props.onChangeStop()
    }

    const actions: ActionsList = {
      RELEASED: () => onReleaseStop(),
      SHIFTED: () => onChangeStop(),
      TYPED: () => onTypeStopValue(),
      UPDATING: () => (this.dispatch.scale.on.status = true),
    }

    return actions[state]?.()
  }

  colorHandler = (e) => {
    let id: string
    const element: HTMLElement | null = e.target.closest('.list__item')

    element != null ? (id = element.getAttribute('data-id')) : null

    colorsMessage.isEditedInRealTime = false

    const updateHexCode = () => {
      const code: string =
        e.target.value.indexOf('#') == -1
          ? '#' + e.target.value
          : e.target.value
      if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(code)) {
        colorsMessage.data = this.props.colors.map((item) => {
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
        this.props.onChangeColor(colorsMessage.data)
      }
      if (e._reactName === 'onBlur') {
        this.dispatch.colors.on.status = false
        parent.postMessage({ pluginMessage: colorsMessage }, '*')
      } else {
        colorsMessage.isEditedInRealTime = true
        this.dispatch.colors.on.status = true
      }
    }

    const updateLightnessProp = () => {
      colorsMessage.data = this.props.colors.map((item) => {
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
      this.props.onChangeColor(colorsMessage.data)
      parent.postMessage({ pluginMessage: colorsMessage }, '*')
    }

    const updateChromaProp = () => {
      colorsMessage.data = this.props.colors.map((item) => {
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
      this.props.onChangeColor(colorsMessage.data)
      parent.postMessage({ pluginMessage: colorsMessage }, '*')
    }

    const updateHueProp = () => {
      colorsMessage.data = this.props.colors.map((item) => {
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
      this.props.onChangeColor(colorsMessage.data)
      parent.postMessage({ pluginMessage: colorsMessage }, '*')
    }

    const addColor = () => {
      colorsMessage.data = this.props.colors
      const hasAlreadyNewUIColor = colorsMessage.data.filter((color) =>
        color.name.includes('New UI Color')
      )
      colorsMessage.data.push({
        name: `New UI Color ${hasAlreadyNewUIColor.length + 1}`,
        description: '',
        rgb: {
          r: 0.53,
          g: 0.92,
          b: 0.97,
        },
        id: uuidv4(),
        oklch: false,
        hueShifting: 0,
      })
      this.props.onChangeColor(colorsMessage.data)
      parent.postMessage({ pluginMessage: colorsMessage }, '*')
    }

    const removeColor = () => {
      colorsMessage.data = this.props.colors.filter((item) => item.id != id)
      this.props.onChangeColor(colorsMessage.data)
      parent.postMessage({ pluginMessage: colorsMessage }, '*')
    }

    const renameColor = () => {
      const hasSameName = this.props.colors.filter(
        (color) => color.name === e.target.value
      )
      colorsMessage.data = this.props.colors.map((item) => {
        if (item.id === id)
          item.name =
            hasSameName.length > 1 ? e.target.value + ' 2' : e.target.value
        return item
      })
      this.props.onChangeColor(colorsMessage.data)
      if (e._reactName === 'onBlur')
        parent.postMessage({ pluginMessage: colorsMessage }, '*')
      if (e.key === 'Enter')
        parent.postMessage({ pluginMessage: colorsMessage }, '*')
    }

    const setHueShifting = () => {
      colorsMessage.data = this.props.colors.map((item) => {
        if (item.id === id) item.hueShifting = parseFloat(e.target.value)
        return item
      })
      this.props.onChangeColor(colorsMessage.data)
      parent.postMessage({ pluginMessage: colorsMessage }, '*')
    }

    const updateColorDescription = () => {
      colorsMessage.data = this.props.colors.map((item) => {
        if (item.id === id) item.description = e.target.value
        return item
      })
      this.props.onChangeColor(colorsMessage.data)
      if (e._reactName === 'onBlur')
        parent.postMessage({ pluginMessage: colorsMessage }, '*')
      if (e.key === 'Enter')
        parent.postMessage({ pluginMessage: colorsMessage }, '*')
    }

    const actions: ActionsList = {
      UPDATE_HEX: () => updateHexCode(),
      UPDATE_LIGHTNESS: () => updateLightnessProp(),
      UPDATE_CHROMA: () => updateChromaProp(),
      UPDATE_HUE: () => updateHueProp(),
      ADD_COLOR: () => addColor(),
      REMOVE_COLOR: () => removeColor(),
      RENAME_COLOR: () => renameColor(),
      SHIFT_HUE: () => setHueShifting(),
      UPDATE_DESCRIPTION: () => updateColorDescription(),
    }

    return actions[e.target.dataset.feature]?.()
  }

  themeHandler = (e) => {
    const addTheme = () => {
      themeMessage.data = this.props.themes
      const hasAlreadyNewUITheme = themeMessage.data.filter((color) =>
        color.name.includes('New UI Theme')
      )
      themeMessage.data.push({
        name: `New UI Theme ${hasAlreadyNewUITheme.length + 1}`,
        description: '',
        paletteBackground: '#FFFFFF',
        isEnabled: this.props.themes.length == 0 ? true : false,
        scale: this.props.scale,
        id: uuidv4(),
      })
      this.props.onChangeTheme(themeMessage.data)
      parent.postMessage({ pluginMessage: themeMessage }, '*')
    }

    const actions: ActionsList = {
      ADD_THEME: () => addTheme(),
    }

    return actions[e.target.dataset.feature]?.()  
  }

  orderHandler = () => {
    const source: SelectedColor = this.state['selectedElement'],
      target: HoveredColor = this.state['hoveredElement'],
      colors = this.props.colors.map((el) => el)

    let position: number

    const colorsWithoutSource = colors.splice(source.position, 1)[0]

    if (target.hasGuideAbove && target.position > source.position)
      position = target.position - 1
    else if (target.hasGuideBelow && target.position > source.position)
      position = target.position
    else if (target.hasGuideAbove && target.position < source.position)
      position = target.position
    else if (target.hasGuideBelow && target.position < source.position)
      position = target.position + 1
    else position = target.position

    colors.splice(position, 0, colorsWithoutSource)
    this.props.onChangeColor(colors)
    parent.postMessage(
      {
        pluginMessage: {
          type: 'UPDATE_COLORS',
          data: colors,
          isEditedInRealTime: false,
        },
      },
      '*'
    )
  }

  selectionHandler = (e) => {
    const target = e.currentTarget
    if (target !== e.target) return
    this.setState({
      selectedElement: {
        id: target.dataset.id,
        position: target.dataset.position,
      },
    })
  }

  unSelectColor = (e) => {
    e.target.closest('li.list__item') == null
      ? this.setState({
          selectedElement: {
            id: '',
            position: null,
          },
        })
      : null
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

  dropOutsideHandler = (e) => {
    const target = e.target,
      parent: ParentNode = target.parentNode,
      scrollY: number = (parent.parentNode.parentNode as HTMLElement).scrollTop,
      parentRefTop: number = (parent as HTMLElement).offsetTop,
      parentRefBottom: number =
        parentRefTop + (parent as HTMLElement).clientHeight

    if (e.pageY + scrollY < parentRefTop) this.orderHandler()
    else if (e.pageY + scrollY > parentRefBottom) this.orderHandler()
  }

  settingsHandler = (e) => this.props.onChangeSettings(e)

  navHandler = (e: React.SyntheticEvent) =>
    this.setState({
      context: (e.target as HTMLElement).dataset.feature,
    })

  viewHandler = (e) => {
    if (e.target.dataset.isBlocked === 'false') {
      this.props.onChangeView(e.target.dataset.value)
      palette.view = e.target.dataset.value
      parent.postMessage(
        { pluginMessage: { type: 'UPDATE_VIEW', data: palette } },
        '*'
      )
      this.setState({
        selectedElement: {
          id: '',
          position: null,
        },
      })
    }
  }

  // Direct actions
  onCreateStyles = () => {
    parent.postMessage({ pluginMessage: { type: 'CREATE_LOCAL_STYLES' } }, '*')
    this.setState({
      selectedElement: {
        id: '',
        position: null,
      },
    })
  }

  onUpdateStyles = () => {
    parent.postMessage({ pluginMessage: { type: 'UPDATE_LOCAL_STYLES' } }, '*')
    this.setState({
      selectedElement: {
        id: '',
        position: null,
      },
    })
  }

  onCreateVariables = () => {
    parent.postMessage(
      { pluginMessage: { type: 'CREATE_LOCAL_VARIABLES' } },
      '*'
    )
    this.setState({
      selectedElement: {
        id: '',
        position: null,
      },
    })
  }

  onUpdateVariables = () => {
    parent.postMessage(
      { pluginMessage: { type: 'UPDATE_LOCAL_VARIABLES' } },
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
    if (this.props.export.format === 'CSV') {
      const zip = new JSZip()
      this.props.export.data.forEach((item) =>
        zip.file(
          `${item.name.toLowerCase().replace(' ', '_').replace('/', '-')}.csv`,
          item.csv
        )
      )
      zip
        .generateAsync({ type: 'blob' })
        .then((content) =>
          FileSaver.saveAs(
            content,
            `${
              this.props.name === ''
                ? locals[this.props.lang].name
                    .toLowerCase()
                    .split(' ')
                    .join('_')
                : this.props.name.toLowerCase().split(' ').join('_')
            }-colors`
          )
        )
        .catch((error) => console.error(error))
    } else {
      const blob = new Blob([this.props.export.data], {
        type: this.props.export.mimeType,
      })
      FileSaver.saveAs(
        blob,
        `${
          this.props.name === ''
            ? locals[this.props.lang].name.toLowerCase().split(' ').join('_')
            : this.props.name.toLowerCase().split(' ').join('_')
        }-colors${this.props.export.format === 'SWIFT' ? '.swift' : ''}`
      )
    }
  }

  setPrimaryContexts = () => {
    const contexts: Array<{
      label: string
      id: string
    }> = []
    if (features.find((feature) => feature.name === 'SCALE').isActive)
      contexts.push({
        label: locals[this.props.lang].contexts.scale,
        id: 'SCALE',
      })
    if (features.find((feature) => feature.name === 'COLORS').isActive)
      contexts.push({
        label: locals[this.props.lang].contexts.colors,
        id: 'COLORS',
      })
    if (features.find((feature) => feature.name === 'THEMES').isActive)
      contexts.push({
        label: locals[this.props.lang].contexts.themes,
        id: 'THEMES',
      })
    if (features.find((feature) => feature.name === 'EXPORT').isActive)
      contexts.push({
        label: locals[this.props.lang].contexts.export,
        id: 'EXPORT',
      })
    if (features.find((feature) => feature.name === 'SETTINGS').isActive)
      contexts.push({
        label: locals[this.props.lang].contexts.settings,
        id: 'SETTINGS',
      })
    return contexts
  }

  setSecondaryContexts = () => {
    const contexts: Array<{
      label: string
      id: string
    }> = []
    if (features.find((feature) => feature.name === 'ABOUT').isActive)
      contexts.push({
        label: locals[this.props.lang].contexts.about,
        id: 'ABOUT',
      })
    return contexts
  }

  // Render
  render() {
    let controls

    switch (this.state['context']) {
      case 'SCALE': {
        controls = (
          <Scale
            hasPreset={false}
            preset={this.props.preset}
            scale={this.props.scale}
            view={this.props.view}
            planStatus={this.props.planStatus}
            editorType={this.props.editorType}
            lang={this.props.lang}
            onChangeScale={this.slideHandler}
            onCreateLocalStyles={this.onCreateStyles}
            onUpdateLocalStyles={this.onUpdateStyles}
            onCreateLocalVariables={this.onCreateVariables}
            onUpdateLocalVariables={this.onUpdateVariables}
          />
        )
        break
      }
      case 'COLORS': {
        controls = (
          <Colors
            colors={this.props.colors}
            selectedElement={this.state['selectedElement']}
            hoveredElement={this.state['hoveredElement']}
            view={this.props.view}
            planStatus={this.props.planStatus}
            editorType={this.props.editorType}
            lang={this.props.lang}
            onChangeColor={this.colorHandler}
            onAddColor={this.colorHandler}
            onChangeSelection={this.selectionHandler}
            onDragChange={this.dragHandler}
            onDropOutside={this.dropOutsideHandler}
            onChangeOrder={this.orderHandler}
            onCreateLocalStyles={this.onCreateStyles}
            onUpdateLocalStyles={this.onUpdateStyles}
            onCreateLocalVariables={this.onCreateVariables}
            onUpdateLocalVariables={this.onUpdateVariables}
          />
        )
        break
      }
      case 'THEMES': {
        controls = (
          <Themes
            themes={this.props.themes}
            selectedElement={this.state['selectedElement']}
            hoveredElement={this.state['hoveredElement']}
            view={this.props.view}
            planStatus={this.props.planStatus}
            editorType={this.props.editorType}
            lang={this.props.lang}
            onChangeTheme={this.themeHandler}
            onAddTheme={this.themeHandler}
            onChangeSelection={this.selectionHandler}
            onDragChange={this.dragHandler}
            onDropOutside={this.dropOutsideHandler}
            onChangeOrder={this.orderHandler}
            onCreateLocalStyles={this.onCreateStyles}
            onUpdateLocalStyles={this.onUpdateStyles}
            onCreateLocalVariables={this.onCreateVariables}
            onUpdateLocalVariables={this.onUpdateVariables}
          />
        )
        break
      }
      case 'EXPORT': {
        controls = (
          <Export
            exportPreview={
              this.props.export.format === 'CSV'
                ? this.props.export.data[0].csv
                : this.props.export.data
            }
            planStatus={this.props.planStatus}
            exportType={this.props.export.format}
            lang={this.props.lang}
            onExportPalette={this.onExport}
          />
        )
        break
      }
      case 'SETTINGS': {
        controls = (
          <Settings
            context="LOCAL_STYLES"
            name={this.props.name}
            colorSpace={this.props.colorSpace}
            isNewAlgorithm={this.props.algorithmVersion == 'v2' ? true : false}
            textColorsTheme={this.props.textColorsTheme}
            view={this.props.view}
            planStatus={this.props.planStatus}
            editorType={this.props.editorType}
            lang={this.props.lang}
            onChangeSettings={this.settingsHandler}
            onCreateLocalStyles={this.onCreateStyles}
            onUpdateLocalStyles={this.onUpdateStyles}
            onCreateLocalVariables={this.onCreateVariables}
            onUpdateLocalVariables={this.onUpdateVariables}
            onChangeView={this.viewHandler}
          />
        )
        break
      }
      case 'ABOUT': {
        controls = (
          <About
            planStatus={this.props.planStatus}
            lang={this.props.lang}
          />
        )
      }
    }
    return (
      <>
        <Tabs
          primaryTabs={this.setPrimaryContexts()}
          secondaryTabs={this.setSecondaryContexts()}
          active={this.state['context']}
          action={this.navHandler}
        />
        <section className="controller" onMouseDown={this.unSelectColor}>
          <div className="controls">{controls}</div>
        </section>
      </>
    )
  }
}
