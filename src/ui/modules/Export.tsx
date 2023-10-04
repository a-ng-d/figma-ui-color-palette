import * as React from 'react'
import type { ActionsList, Language } from '../../utils/types'
import Feature from '../components/Feature'
import RadioButton from './../components/RadioButton'
import Input from '../components/Input'
import Actions from './Actions'
import features from '../../utils/config'
import isBlocked from '../../utils/isBlocked'
import { locals } from '../../content/locals'
import Dropdown from '../components/Dropdown'

interface Props {
  exportPreview: string
  planStatus: 'UNPAID' | 'PAID'
  exportType: string
  lang: Language
  onExportPalette: () => void
}

export default class Export extends React.Component<Props, any> {
  counter: number

  static defaultProps = {
    exportPreview: '',
  }

  constructor(props: Props) {
    super(props)
    this.counter = 0
    this.state = {
      format: 'EXPORT_TO_JSON'
    }
  }

  // Handlers
  exportHandler = (e: React.SyntheticEvent) => {
    const actions: ActionsList = {
      EXPORT_TO_JSON: () => {
        this.setState({
          format: 'EXPORT_TO_JSON',
        })
        parent.postMessage(
          { pluginMessage: { type: 'EXPORT_PALETTE', export: 'JSON' } },
          '*'
        )
      },
      EXPORT_TO_JSON_AMZN_STYLE_DICTIONARY: () => {
        this.setState({
          format: 'EXPORT_TO_JSON_AMZN_STYLE_DICTIONARY',
        })
        parent.postMessage(
          {
            pluginMessage: {
              type: 'EXPORT_PALETTE',
              export: 'JSON_AMZN_STYLE_DICTIONARY',
            },
          },
          '*'
        )
      },
      EXPORT_TO_JSON_TOKENS_STUDIO: () => {
        this.setState({
          format: 'EXPORT_TO_JSON_TOKENS_STUDIO',
        })
        parent.postMessage(
          {
            pluginMessage: {
              type: 'EXPORT_PALETTE',
              export: 'JSON_TOKENS_STUDIO',
            },
          },
          '*'
        )
      },
      EXPORT_TO_CSS: () => {
        this.setState({
          format: 'EXPORT_TO_CSS',
        })
        parent.postMessage(
          { pluginMessage: { type: 'EXPORT_PALETTE', export: 'CSS' } },
          '*'
        )
      },
      EXPORT_TO_SWIFT: () => {
        this.setState({
          format: 'EXPORT_TO_SWIFT',
        })
        parent.postMessage(
          { pluginMessage: { type: 'EXPORT_PALETTE', export: 'SWIFT' } },
          '*'
        )
      },
      EXPORT_TO_XML: () => {
        this.setState({
          format: 'EXPORT_TO_XML',
        })
        parent.postMessage(
          { pluginMessage: { type: 'EXPORT_PALETTE', export: 'XML' } },
          '*'
        )
      },
      EXPORT_TO_CSV: () => {
        this.setState({
          format: 'EXPORT_TO_CSV',
        })
        parent.postMessage(
          { pluginMessage: { type: 'EXPORT_PALETTE', export: 'CSV' } },
          '*'
        )
      },
      NULL: () => null,
    }

    return actions[(e.target as HTMLElement).dataset.value ?? 'NULL']?.()
  }

  // Direct actions
  setFirstPreview = () => {
    this.counter == 0
      ? parent.postMessage(
          {
            pluginMessage: {
              type: 'EXPORT_PALETTE',
              export: this.state['format'].replace('EXPORT_TO_', ''),
            },
          },
          '*'
        )
      : null
    this.counter = 1
  }

  selectPreview = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => e.target.select()

  deSelectPreview = () => window.getSelection()?.removeAllRanges()

  // Render
  render() {
    this.setFirstPreview()
    return (
      <>
        <div className="export-palette controls__control">
          <div className="section-controls">
            <div className="section-controls__left-part">
              <div className="section-title">
                {locals[this.props.lang].export.format}
                <div className="type">(7)</div>
              </div>
            </div>
            <div className="section-controls__right-part">
            <Dropdown
                id="exports-list"
                options={[
                  {
                    label: 'Tokens',
                    value: 'TOKENS_GROUP',
                    position: 0,
                    isActive: true,
                    isBlocked: false,
                    children: [
                      {
                        label: locals[this.props.lang].export.json,
                        value: 'EXPORT_TO_JSON',
                        position: 0,
                        isActive: true,
                        isBlocked: false,
                        children: [],
                      },
                      {
                        label: locals[this.props.lang].export.amznStyleDictionary,
                        value: 'EXPORT_TO_JSON_AMZN_STYLE_DICTIONARY',
                        position: 0,
                        isActive: true,
                        isBlocked: false,
                        children: [],
                      },
                      {
                        label: locals[this.props.lang].export.tokensStudio,
                        value: 'EXPORT_TO_JSON_TOKENS_STUDIO',
                        position: 0,
                        isActive: true,
                        isBlocked: false,
                        children: [],
                      },
                    ]
                  },
                  {
                    label: locals[this.props.lang].export.css,
                    value: 'EXPORT_TO_CSS',
                    position: 1,
                    isActive: true,
                    isBlocked: false,
                    children: [],
                  },
                  {
                    label: locals[this.props.lang].export.swift,
                    value: 'EXPORT_TO_SWIFT',
                    position: 2,
                    isActive: true,
                    isBlocked: false,
                    children: [],
                  },
                  {
                    label: locals[this.props.lang].export.xml,
                    value: 'EXPORT_TO_XML',
                    position: 3,
                    isActive: true,
                    isBlocked: false,
                    children: [],
                  },
                  {
                    label: locals[this.props.lang].export.csv,
                    value: 'EXPORT_TO_CSV',
                    position: 4,
                    isActive: true,
                    isBlocked: false,
                    children: [],
                  },
                ]}
                selected={this.state['format'] ?? ''}
                feature="SELECT_EXPORT_FILE"
                parentClassName="controls"
                alignment="RIGHT"
                onChange={this.exportHandler}
              />
            </div>
          </div>
          <div className="export-palette__preview">
            <Input
              type="LONG_TEXT"
              value={this.props.exportPreview}
              isReadOnly={true}
              onBlur={this.deSelectPreview}
              onFocus={(e) => this.selectPreview(e)}
            />
          </div>
        </div>
        <Actions
          context="EXPORT"
          exportType={this.props.exportType}
          lang={this.props.lang}
          onExportPalette={this.props.onExportPalette}
        />
      </>
    )
  }
}
