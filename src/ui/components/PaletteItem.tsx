import React from "react"
import { Chip, Thumbnail, texts } from "@a_ng_d/figmug-ui"

interface PaletteItemProps {
  id: string
  src: string
  title: string
  indicator?: {
    label: string
    status: 'ACTIVE' | 'INACTIVE'
  }
  subtitle: string
  info: string
  action: React.MouseEventHandler<HTMLLIElement> & React.KeyboardEventHandler<HTMLLIElement>
}

export default class PaletteItem extends React.Component<PaletteItemProps> {
  render() {
    return (
      <li
        className="rich-list__item"
        data-id={this.props.id}
        tabIndex={0}
        onMouseDown={this.props.action}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') this.props.action(e)
          if (e.key === 'Escape') (e.target as HTMLElement).blur()
        }}
      >
        <div className="rich-list__item__asset">
          <Thumbnail src={this.props.src} />
        </div>
        <div className="rich-list__item__content">
          <div className={`${texts.type} type--large`}>
            {this.props.title}
            {this.props.indicator !== undefined
            && <Chip state={this.props.indicator.status}>
              {this.props.indicator.label}
            </Chip>}
          </div>
          <div className={`${texts.type} type`}>{this.props.subtitle}</div>
          <div
            className={`${texts.type} ${texts['type--secondary']} type`}
          >
            {this.props.info}
          </div>
        </div>
      </li>
    )
  }
}