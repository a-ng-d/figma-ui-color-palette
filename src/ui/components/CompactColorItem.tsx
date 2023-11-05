import * as React from 'react'
import type { HexModel, Language } from '../../utils/types'
import Button from './Button'

interface Props {
  name: string
  hex: HexModel
  uuid: string
  canBeRemoved: boolean
  lang: Language
  onRemoveColor?: React.ReactEventHandler
}

export default class CompactColorItem extends React.Component<Props, any> {
  static defaultProps = {
    canBeRemoved: false
  }

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
        {this.props.canBeRemoved ? (
          <div className="list__item__buttons list__item__buttons--compact">
            <Button
              type="icon"
              icon="minus"
              feature="REMOVE_COLOR"
              action={this.props.onRemoveColor}
            />
          </div>
        ) : null}
      </li>
    )
  }
}
