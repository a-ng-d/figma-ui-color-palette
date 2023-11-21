import * as React from 'react'
import Button from './Button'

interface Props {
  label: string
  indicator: number
  itemHandler: 'ADD' | 'REMOVE'
  isExpanded: boolean
  isBlocked: boolean
  children: React.ReactNode
  onAdd: React.MouseEventHandler<Element> & React.KeyboardEventHandler<Element>
  onEmpty: React.MouseEventHandler<Element> & React.KeyboardEventHandler<Element>
}

export default class Accordion extends React.Component<Props> {
  // Render
  render() {
    return (
      <div
        className={[
          'accordion',
          this.props.isExpanded ? 'accordion--expanded' : null,
          this.props.isBlocked ? 'accordion--blocked' : null,
        ]
          .filter((n) => n)
          .join(' ')}
        onMouseDown={(e) => {
          if (
            (e.target as HTMLElement).dataset.feature != 'ADD_ITEM' &&
            !this.props.isExpanded &&
            !this.props.isBlocked
          )
            this.props.onAdd(e as React.MouseEvent<HTMLDivElement, MouseEvent>)
        }}
      >
        <div className="section-controls">
          <div className="section-controls__left-part">
            <div className="section-title">
              {this.props.label}
            </div>
            <div className="type">{`(${
              this.props.indicator
            })`}</div>
          </div>
          <div className="section-controls__right-part">
            {this.props.itemHandler === 'REMOVE' ? (
              <Button
                type="icon"
                icon="minus"
                state={this.props.isBlocked ? 'disabled' : 'default'}
                feature="EMPTY_ITEM"
                action={this.props.onEmpty}
              />
            ) : (
              <Button
                type="icon"
                icon="plus"
                state={this.props.isBlocked ? 'disabled' : 'default'}
                feature="ADD_ITEM"
                action={(e) => {
                  !this.props.isBlocked ? this.props.onAdd(e as React.MouseEvent<HTMLDivElement, MouseEvent>) : null
                }}
              />
            )}
          </div>
        </div>
        {this.props.isExpanded ? (
          <div>
            {this.props.children}
          </div>
          ) : null
        }
      </div>
    )
  }
}
