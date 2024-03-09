import * as React from 'react'
import type { HexModel, Language } from '../../utils/types'
import { Button } from '@a-ng-d/figmug.actions.button'
import { texts } from '@a-ng-d/figmug.stylesheets.texts'

interface Props {
  name: string
  hex: HexModel
  uuid: string
  canBeRemoved: boolean
  lang: Language
  onRemoveColor?: React.ReactEventHandler
}

export default class CompactColorItem extends React.Component<Props> {
  static defaultProps = {
    canBeRemoved: false,
  }

  // Render
  render() {
    return (
      <li
        className="list__item"
        data-id={this.props.uuid}
      >
        <div className="list__item__primary">
          <div className="list__item__left-part">
            <div className="list__item__param inputs">
              <div className="color">
                <div
                  className="color__icon color__icon--circle"
                  style={{
                    backgroundColor: this.props.hex,
                  }}
                ></div>
              </div>
              <div className={`type ${texts.type} ${texts['type--truncated']}`}>
                {this.props.name}
              </div>
              <div className={`type ${texts.type} ${texts['type--secondary']}`}>
                {this.props.hex}
              </div>
            </div>
          </div>
          <div className="list_item_right-part">
            {this.props.canBeRemoved ? (
              <div className="list__item__param">
                <Button
                  type="icon"
                  icon="minus"
                  feature="REMOVE_COLOR"
                  action={this.props.onRemoveColor}
                />
              </div>
            ) : null}
          </div>
        </div>
      </li>
    )
  }
}
