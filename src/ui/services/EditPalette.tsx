import * as React from 'react'
import JSZip from 'JSZip'
import FileSaver from 'file-saver'
import type {
  PresetConfiguration,
  TextColorsThemeHexModel,
  ColorConfiguration,
  ThemeConfiguration,
  ExportConfiguration,
  ScaleConfiguration,
} from '../../utils/types'
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
  onChangeStop?: () => void
  onChangeColor: (colors: Array<ColorConfiguration>) => void
  onChangeTheme: (themes: Array<ThemeConfiguration>) => void
  onChangeView: (view: string) => void
  onChangeSettings: React.ChangeEventHandler
}

export default class EditPalette extends React.Component<Props> {
  constructor(props) {
    super(props)
    this.state = {
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
            onChangeScale={this.props.onChangeScale}
            onChangeStop={this.props.onChangeStop}
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
            view={this.props.view}
            planStatus={this.props.planStatus}
            editorType={this.props.editorType}
            lang={this.props.lang}
            onChangeColor={this.props.onChangeColor}
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
            scale={this.props.scale}
            themes={this.props.themes}
            view={this.props.view}
            planStatus={this.props.planStatus}
            editorType={this.props.editorType}
            lang={this.props.lang}
            onChangeTheme={this.props.onChangeTheme}
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
            onChangeSettings={this.props.onChangeSettings}
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
        <section className="controller">
          <div className="controls">{controls}</div>
        </section>
      </>
    )
  }
}
