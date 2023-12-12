import * as React from 'react'
import JSZip from 'jszip'
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
  EditorType,
} from '../../utils/types'
import type {
  DropdownOption
} from '@a-ng-d/figmug.modules.types'
import Feature from '../components/Feature'
import { Bar } from '@a-ng-d/figmug.layouts.bar'
import { Tabs } from '@a-ng-d/figmug.actions.tabs'
import Scale from '../modules/Scale'
import Colors from '../modules/Colors'
import Themes from '../modules/Themes'
import Export from '../modules/Export'
import Settings from '../modules/Settings'
import { FormItem } from '@a-ng-d/figmug.layouts.form-item'
import { Dropdown } from '@a-ng-d/figmug.inputs.dropdown'
import features from '../../utils/config'
import { locals } from '../../content/locals'
import isBlocked from '../../utils/isBlocked'
import { doSnakeCase } from '@a-ng-d/figmug.modules.do-snake-case'

interface Props {
  name: string
  description: string
  preset: PresetConfiguration
  scale: ScaleConfiguration
  colors: Array<ColorConfiguration>
  colorSpace: string
  themes: Array<ThemeConfiguration>
  view: string
  textColorsTheme: TextColorsThemeHexModel
  algorithmVersion: string
  export: ExportConfiguration
  planStatus: 'UNPAID' | 'PAID'
  editorType: EditorType
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
        this.setContexts()[0] != undefined ? this.setContexts()[0].id : '',
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

  switchThemeHandler = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent> | React.KeyboardEvent
  ) => {
    themesMessage.data = this.props.themes.map((theme) => {
      if ((e.target as HTMLElement).dataset.value === theme.id)
        theme.isEnabled = true
      else theme.isEnabled = false

      return theme
    })
    parent.postMessage({ pluginMessage: themesMessage }, '*')
    this.props.onChangeThemes(themesMessage.data)
  }

  // Direct actions
  onSyncStyles = () => {
    parent.postMessage({ pluginMessage: { type: 'SYNC_LOCAL_STYLES' } }, '*')
    this.setState({
      selectedElement: {
        id: '',
        position: null,
      },
    })
  }

  onSyncVariables = () => {
    parent.postMessage({ pluginMessage: { type: 'SYNC_LOCAL_VARIABLES' } }, '*')
    this.setState({
      selectedElement: {
        id: '',
        position: null,
      },
    })
  }

  onExport = () => {
    const blob = new Blob([this.props.export.data], {
      type: this.props.export.mimeType,
    })
    if (this.props.export.format === 'CSV') {
      const zip = new JSZip()
      this.props.export.data.forEach(
        (theme: {
          name: string
          type: string
          colors: Array<{ name: string; csv: string }>
        }) => {
          if (theme.type != 'default theme') {
            const folder = zip.folder(theme.name) ?? zip
            theme.colors.forEach((color) => {
              folder.file(`${doSnakeCase(color.name)}.csv`, color.csv)
            })
          } else
            theme.colors.forEach((color) => {
              zip.file(`${doSnakeCase(color.name)}.csv`, color.csv)
            })
        }
      )
      zip
        .generateAsync({ type: 'blob' })
        .then((content: any) =>
          FileSaver.saveAs(
            content,
            this.props.name === ''
              ? doSnakeCase(locals[this.props.lang].name)
              : doSnakeCase(this.props.name)
          )
        )
        .catch((error: any) => console.error(error))
    } else if (this.props.export.format === 'TAILWIND') {
      FileSaver.saveAs(blob, 'tailwind.config.js')
    } else if (this.props.export.format === 'SWIFT') {
      FileSaver.saveAs(
        blob,
        `${
          this.props.name === ''
            ? doSnakeCase(locals[this.props.lang].name)
            : doSnakeCase(this.props.name)
        }.swift`
      )
    } else {
      FileSaver.saveAs(
        blob,
        this.props.name === ''
          ? doSnakeCase(locals[this.props.lang].name)
          : doSnakeCase(this.props.name)
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

  setThemes = (): Array<DropdownOption> => {
    const themes = 
      this.workingThemes().map((theme, index) => {
        return {
          label: theme.name,
          value: theme.id,
          feature: 'SWITCH_THEME',
          position: index,
          type: 'OPTION',
          isActive: true,
          isBlocked: false,
          children: [],
          action: (e: any) => this.switchThemeHandler(e)
        } as DropdownOption
      })
    const actions: Array<DropdownOption> = [
      {
        label: null,
        value: null,
        feature: null,
        position: themes.length,
        type: 'SEPARATOR',
        isActive: true,
        isBlocked: false,
        children: [],
        action: () => null,
      },
      {
        label: 'Create a color theme',
        value: null,
        feature: 'ADD_THEME',
        position: themes.length + 1,
        type: 'OPTION',
        isActive: features.find((feature) => feature.name === 'THEMES')?.isActive,
        isBlocked: isBlocked('THEMES', this.props.planStatus),
        children: [],
        action: () => {
          this.setState({ context: 'THEMES' })
          setTimeout(() => this.themesRef.current.onAddTheme(), 1)
        },
      },
    ]

    return themes.concat(actions)

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
            onSyncLocalStyles={this.onSyncStyles}
            onSyncLocalVariables={this.onSyncVariables}
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
            onSyncLocalStyles={this.onSyncStyles}
            onSyncLocalVariables={this.onSyncVariables}
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
            onSyncLocalStyles={this.onSyncStyles}
            onSyncLocalVariables={this.onSyncVariables}
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
            description={this.props.description}
            colorSpace={this.props.colorSpace}
            textColorsTheme={this.props.textColorsTheme}
            view={this.props.view}
            isNewAlgorithm={this.props.algorithmVersion == 'v2' ? true : false}
            actions={this.state['deploymentAction']}
            planStatus={this.props.planStatus}
            editorType={this.props.editorType}
            lang={this.props.lang}
            onChangeSettings={this.props.onChangeSettings}
            onSyncLocalStyles={this.onSyncStyles}
            onSyncLocalVariables={this.onSyncVariables}
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
                  id="switch-theme"
                  options={this.setThemes()}
                  selected={
                    this.props.themes.find((theme) => theme.isEnabled)?.id ??
                    'NULL'
                  }
                  parentClassName="ui"
                  alignment="RIGHT"
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
