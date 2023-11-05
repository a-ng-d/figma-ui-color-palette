import * as React from 'react'
import type { HexModel, Language } from '../../utils/types'

interface Props {
  name: string
  hex: HexModel
  uuid: string
  lang: Language
}

export default class CompactColorItem extends React.Component<Props, any> {
  // Render
  render() {
    return (
      <li
        className="list__item list__item--compact"
        data-id={this.props.uuid}
      >
        <div className="single-color">
          <div
            className="single-color__thumbnail"
            style={{
              backgroundColor: this.props.hex
            }}
          ></div>
          <div className="single-color__name">
            <div className="type">
              {this.props.name}
            </div>
            <div className="type type--secondary">
              {this.props.hex}
            </div>
          </div>
        </div>
      </li>
    )
  }
}
