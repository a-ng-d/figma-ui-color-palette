import { Chip, Thumbnail, texts } from '@a_ng_d/figmug-ui'
import React from 'react'

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
  user?: {
    avatar?: string
    name: string
  }
  children?: React.ReactNode
  isInteractive?: boolean
  action?: React.MouseEventHandler<HTMLLIElement> &
    React.KeyboardEventHandler<HTMLLIElement>
}

interface PaletteItemStates {
  backgroundStyle: string
}

export default class PaletteItem extends React.Component<
  PaletteItemProps,
  PaletteItemStates
> {
  static defaultProps: Partial<PaletteItemProps> = {
    isInteractive: false,
  }

  render() {
    return (
      <li
        className={[
          'rich-list__item',
          this.props.isInteractive ? 'rich-list__item--interactive' : null,
        ]
          .filter((n) => n)
          .join(' ')}
        data-id={this.props.id}
        tabIndex={this.props.isInteractive ? 0 : -1}
        onMouseDown={this.props.isInteractive ? this.props.action : undefined}
        onKeyDown={(e) => {
          if ((e.key === ' ' || e.key === 'Enter') && this.props.isInteractive)
            this.props.action?.(e)
          if (e.key === 'Escape' && this.props.isInteractive)
            (e.target as HTMLElement).blur()
        }}
      >
        <div className="rich-list__item__asset">
          <Thumbnail src={this.props.src} />
        </div>
        <div className="rich-list__item__content">
          <div className="palette-info">
            <div className={`${texts.type} type--large`}>
              {this.props.title}
              {this.props.indicator !== undefined && (
                <Chip state={this.props.indicator.status}>
                  {this.props.indicator.label}
                </Chip>
              )}
            </div>
            <div className={`${texts.type} type`}>{this.props.subtitle}</div>
            <div
              className={`${texts.type} ${texts['type--secondary']} type`}
              style={{
                marginTop: '2px',
              }}
            >
              {this.props.info}
            </div>
          </div>
          {this.props.user !== undefined && (
            <div className="user">
              {this.props.user.avatar !== undefined && (
                <div className="user__avatar">
                  <img src={this.props.user.avatar} />
                </div>
              )}
              <div className={`${texts.type} ${texts['type--secondary']} type`}>
                {this.props.user.name}
              </div>
            </div>
          )}
        </div>
        {this.props.children !== undefined && this.props.children}
      </li>
    )
  }
}
