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
  ThemesMessage,
  Language,
} from '../../utils/types'
import Feature from '../components/Feature'
import Bar from '../components/Bar'
import Tabs from '../components/Tabs'
import Scale from '../modules/Scale'
import Colors from '../modules/Colors'
import Themes from '../modules/Themes'
import Export from '../modules/Export'
import Settings from '../modules/Settings'
import FormItem from '../components/FormItem'
import Dropdown from '../components/Dropdown'
import features from '../../utils/features'
import { locals } from '../../content/locals'
import isBlocked from '../../utils/isBlocked'
import doSnakeCase from '../../utils/doSnakeCase'

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
  editorType: 'figma' | 'figjam'
  planStatus: 'UNPAID' | 'PAID'
  lang: Language
  onChangeScale: () => void
  onChangeStop?: () => void
  onChangeColors: (colors: Array<ColorConfiguration>) => void
  onChangeThemes: (themes: Array<ThemeConfiguration>) => void
  onChangeSettings: React.ChangeEventHandler
}

const themesMessage: ThemesMessage = {
  type: 'UPDATE_THEMES',
  data: [],
  isEditedInRealTime: false,
}

export default class EditPalette extends React.Component<Props, any> {
  themesRef: React.MutableRefObject<any>

  constructor(props: Props) {
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
      deploymentAction: features.find(
        (feature) => feature.name === 'LOCAL_STYLES'
      )?.isActive
        ? 'LOCAL_STYLES'
        : 'LOCAL_VARIABLES',
    }
    this.themesRef = React.createRef()
  }

  // Handlers
  navHandler = (e: React.SyntheticEvent) =>
    this.setState({
      context: (e.target as HTMLElement).dataset.feature,
    })

  switchThemeHandler = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    themesMessage.data = this.props.themes.map((theme) => {
      if ((e.target as HTMLElement).dataset.value === theme.id) theme.isEnabled = true
      else theme.isEnabled = false

      return theme
    })
    parent.postMessage({ pluginMessage: themesMessage }, '*')
    this.props.onChangeThemes(themesMessage.data)
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
      this.props.export.data.forEach((theme: { name: string, type: string, colors: Array<{ name: string, csv: string }> }) => {
        const folder =
          theme.type != 'default theme' ? zip.folder(theme.name) : null
        theme.colors.forEach((color) => {
          theme.type != 'default theme'
            ? folder!.file(`${doSnakeCase(color.name)}.csv`, color.csv)
            : zip.file(`${doSnakeCase(color.name)}.csv`, color.csv)
        })
      })
      zip
        .generateAsync({ type: 'blob' })
        .then((content) =>
          FileSaver.saveAs(
            content,
            `${
              this.props.name === ''
                ? doSnakeCase(locals[this.props.lang].name)
                : doSnakeCase(this.props.name)
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
            ? doSnakeCase(locals[this.props.lang].name)
            : doSnakeCase(this.props.name)
        }-colors${this.props.export.format === 'SWIFT' ? '.swift' : ''}`
      )
    }
  }

  setContexts = () => {
    const contexts: Array<{
      label: string
      id: string
    }> = []
    if (features.find((feature) => feature.name === 'SCALE')?.isActive)
      contexts.push({
        label: locals[this.props.lang].contexts.scale,
        id: 'SCALE',
      })
    if (features.find((feature) => feature.name === 'COLORS')?.isActive)
      contexts.push({
        label: locals[this.props.lang].contexts.colors,
        id: 'COLORS',
      })
    if (features.find((feature) => feature.name === 'THEMES')?.isActive)
      contexts.push({
        label: locals[this.props.lang].contexts.themes,
        id: 'THEMES',
      })
    if (features.find((feature) => feature.name === 'EXPORT')?.isActive)
      contexts.push({
        label: locals[this.props.lang].contexts.export,
        id: 'EXPORT',
      })
    if (features.find((feature) => feature.name === 'SETTINGS')?.isActive)
      contexts.push({
        label: locals[this.props.lang].contexts.settings,
        id: 'SETTINGS',
      })
    return contexts
  }

  workingThemes = () => {
    if (this.props.themes.length > 1)
      return this.props.themes.filter((theme) => theme.type === 'custom theme')
    else
      return this.props.themes.filter((theme) => theme.type === 'default theme')
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
            actions={this.state['deploymentAction']}
            planStatus={this.props.planStatus}
            editorType={this.props.editorType}
            lang={this.props.lang}
            onChangeScale={this.props.onChangeScale}
            onChangeStop={this.props.onChangeStop}
            onCreateLocalStyles={this.onCreateStyles}
            onUpdateLocalStyles={this.onUpdateStyles}
            onCreateLocalVariables={this.onCreateVariables}
            onUpdateLocalVariables={this.onUpdateVariables}
            onChangeActions={(value) =>
              this.setState({
                deploymentAction: value,
              })
            }
          />
        )
        break
      }
      case 'COLORS': {
        controls = (
          <Colors
            colors={this.props.colors}
            actions={this.state['deploymentAction']}
            planStatus={this.props.planStatus}
            editorType={this.props.editorType}
            lang={this.props.lang}
            onChangeColors={this.props.onChangeColors}
            onCreateLocalStyles={this.onCreateStyles}
            onUpdateLocalStyles={this.onUpdateStyles}
            onCreateLocalVariables={this.onCreateVariables}
            onUpdateLocalVariables={this.onUpdateVariables}
            onChangeActions={(value) =>
              this.setState({
                deploymentAction: value,
              })
            }
          />
        )
        break
      }
      case 'THEMES': {
        controls = (
          <Themes
            ref={this.themesRef}
            preset={this.props.preset}
            scale={this.props.scale}
            themes={this.props.themes}
            actions={this.state['deploymentAction']}
            planStatus={this.props.planStatus}
            editorType={this.props.editorType}
            lang={this.props.lang}
            onChangeThemes={this.props.onChangeThemes}
            onCreateLocalStyles={this.onCreateStyles}
            onUpdateLocalStyles={this.onUpdateStyles}
            onCreateLocalVariables={this.onCreateVariables}
            onUpdateLocalVariables={this.onUpdateVariables}
            onChangeActions={(value) =>
              this.setState({
                deploymentAction: value,
              })
            }
          />
        )
        break
      }
      case 'EXPORT': {
        controls = (
          <Export
            exportPreview={
              this.props.export.format === 'CSV'
                ? this.props.export.data[0].colors[0].csv
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
            textColorsTheme={this.props.textColorsTheme}
            view={this.props.view}
            isNewAlgorithm={this.props.algorithmVersion == 'v2' ? true : false}
            actions={this.state['deploymentAction']}
            planStatus={this.props.planStatus}
            editorType={this.props.editorType}
            lang={this.props.lang}
            onChangeSettings={this.props.onChangeSettings}
            onCreateLocalStyles={this.onCreateStyles}
            onUpdateLocalStyles={this.onUpdateStyles}
            onCreateLocalVariables={this.onCreateVariables}
            onUpdateLocalVariables={this.onUpdateVariables}
            onChangeActions={(value) =>
              this.setState({
                deploymentAction: value,
              })
            }
          />
        )
        break
      }
    }
    return (
      <>
        <Bar
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
                features.find((feature) => feature.name === 'THEMES')?.isActive
              }
            >
              <FormItem
                id="switch-theme"
                label={locals[this.props.lang].themes.switchTheme.label}
                shouldFill={false}
              >
                <Dropdown
                  id="presets"
                  options={this.workingThemes().map((theme, index) => {
                    return {
                      label: theme.name,
                      value: theme.id,
                      position: index,
                      isActive: true,
                      isBlocked: false,
                    }
                  })}
                  selected={
                    this.props.themes.find((theme) => theme.isEnabled)?.id ?? 'NULL'
                  }
                  actions={[
                    {
                      label: 'Create a color theme',
                      isBlocked: isBlocked('THEMES', this.props.planStatus),
                      feature: 'ADD_THEME',
                      action: () => {
                        this.setState({ context: 'THEMES' })
                        setTimeout(() => this.themesRef.current.onAddTheme(), 1)
                      },
                    },
                  ]}
                  feature="SWITCH_THEME"
                  parentClassName="ui"
                  onChange={(e) => this.switchThemeHandler(e)}
                />
              </FormItem>
            </Feature>
          }
          border={['BOTTOM']}
          isOnlyText={true}
        />
        <section className="controller">
          <div className="controls">{controls}</div>
        </section>
      </>
    )
  }
}
