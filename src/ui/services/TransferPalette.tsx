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
  Language,
  EditorType,
  visionSimulationModeConfiguration,
  PlanStatus,
} from '../../utils/types'
import Feature from '../components/Feature'
import { Bar } from '@a-ng-d/figmug.layouts.bar'
import { Tabs } from '@a-ng-d/figmug.actions.tabs'
import Export from '../modules/Export'
import features from '../../utils/config'
import { locals } from '../../content/locals'
import { doSnakeCase } from '@a-ng-d/figmug.modules.do-snake-case'

interface Props {
  name: string
  description: string
  preset: PresetConfiguration
  scale: ScaleConfiguration
  colors: Array<ColorConfiguration>
  colorSpace: string
  visionSimulationMode: visionSimulationModeConfiguration
  themes: Array<ThemeConfiguration>
  view: string
  textColorsTheme: TextColorsThemeHexModel
  algorithmVersion: string
  export: ExportConfiguration
  planStatus: PlanStatus
  editorType: EditorType
  lang: Language
}

interface State {
  context: string | undefined
}

export default class TransferPalette extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      context:
        this.setContexts()[0] != undefined ? this.setContexts()[0].id : '',
    }
  }

  // Handlers
  navHandler = (e: React.SyntheticEvent) =>
    this.setState({
      context: (e.target as HTMLElement).dataset.feature,
    })

  // Direct actions
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
        .then((content) =>
          FileSaver.saveAs(
            content,
            this.props.name === ''
              ? doSnakeCase(locals[this.props.lang].name)
              : doSnakeCase(this.props.name)
          )
        )
        .catch((error) => console.error(error))
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
    } else if (this.props.export.format === 'KT') {
      FileSaver.saveAs(
        blob,
        `${
          this.props.name === ''
            ? doSnakeCase(locals[this.props.lang].name)
            : doSnakeCase(this.props.name)
        }.kt`
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
      isUpdated: boolean
    }> = []
    if (features.find((feature) => feature.name === 'EXPORT')?.isActive)
      contexts.push({
        label: locals[this.props.lang].contexts.export,
        id: 'EXPORT',
        isUpdated:
          features.find((feature) => feature.name === 'EXPORT')?.isNew ?? false,
      })
    return contexts
  }

  // Render
  render() {
    let controls

    switch (this.state['context']) {
      case 'EXPORT': {
        controls = (
          <Export
            exportPreview={
              this.props.export.format === 'CSV'
                ? this.props.export.data[0].colors[0].csv
                : this.props.export.data
            }
            planStatus={this.props.planStatus}
            exportType={this.props.export.label}
            lang={this.props.lang}
            onExportPalette={this.onExport}
          />
        )
        break
      }
    }
    return (
      <>
        <Feature isActive={this.props.editorType != 'dev'}>
          <Bar
            leftPart={
              <Tabs
                tabs={this.setContexts()}
                active={this.state['context'] ?? ''}
                action={this.navHandler}
              />
            }
            border={['BOTTOM']}
            isOnlyText={true}
          />
        </Feature>
        <section className="controller">
          <div className="controls">{controls}</div>
        </section>
      </>
    )
  }
}
