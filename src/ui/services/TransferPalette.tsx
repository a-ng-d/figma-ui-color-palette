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
  ExtractOfPaletteConfiguration,
  Service,
} from '../../utils/types'
import Export from '../modules/Export'
import { locals } from '../../content/locals'
import { doSnakeCase } from '@a-ng-d/figmug.modules.do-snake-case'
import PalettesList from '../modules/PalettesList'

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
  palettesList: Array<ExtractOfPaletteConfiguration>
  service: Service
  planStatus: PlanStatus
  editorType: EditorType
  lang: Language
}

export default class TransferPalette extends React.Component<Props> {
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

  // Render
  render() {
    return (
      <>
        <section className="controller">
          <div className="controls">
            {this.props.service === 'CREATE' &&
            this.props.editorType === 'dev' ? (
              <PalettesList
                paletteLists={this.props.palettesList}
                lang={this.props.lang}
              />
            ) : (
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
            )}
          </div>
        </section>
      </>
    )
  }
}
