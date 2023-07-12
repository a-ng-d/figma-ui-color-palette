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
import Feature from '../components/Feature'
import MainMenu from '../components/MainMenu'
import Tabs from '../components/Tabs'
import Scale from '../modules/Scale'
import Colors from '../modules/Colors'
import Themes from '../modules/Themes'
import Export from '../modules/Export'
import Settings from '../modules/Settings'
import About from '../modules/About'
import FormItem from '../components/FormItem'
import Dropdown from '../components/Dropdown'
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
  onChangeColors: (colors: Array<ColorConfiguration>) => void
  onChangeThemes: (themes: Array<ThemeConfiguration>) => void
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
  
  switchThemeHandler = () => {

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

  setContexts = () => {
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
            onChangeColors={this.props.onChangeColors}
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
            onChangeThemes={this.props.onChangeThemes}
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
    console.log(this.props.themes)
    return (
      <>
        <MainMenu
          leftPart={
            <Tabs
              tabs={this.setContexts()}
              active={this.state['context']}
              action={this.navHandler}
            />
          }
          rightPart={
            <Feature
              isActive={
                features.find((feature) => feature.name === 'THEMES')
                  .isActive
              }
            >
              <FormItem
                id="switch-theme"
                label={locals[this.props.lang].themes.switchTheme.label}
                shouldFill={false}
              >
                <Dropdown
                  id="presets"
                  options={Object.entries(this.props.themes).map((theme, index) => {
                    return {
                      label: theme[1].name,
                      value: theme[1].id,
                      position: index,
                      isActive: true,
                      isBlocked: false,
                    }
                  })}
                  selected={this.props.themes.find(theme => theme.isEnabled).id}
                  actions={[{
                    label: 'Create a color theme',
                    isBlocked: false,
                    action: () => this.setState({ context: 'THEMES' }),
                  }]}
                  feature="SWITCH_THEME"
                  onChange={this.switchThemeHandler}
                />
              </FormItem>
            </Feature>
          }
        />
        <section className="controller">
          <div className="controls">{controls}</div>
        </section>
      </>
    )
  }
}
