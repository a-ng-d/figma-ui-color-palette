import * as React from 'react'

interface Props {
  rightPart?: React.ReactElement
  leftPart?: React.ReactElement
  border: Array<'TOP' | 'LEFT' | 'BOTTOM' | 'RIGHT'>
  isCompact?: boolean
  isOnlyText?: boolean
}

export default class Bar extends React.Component<Props> {
  static defaultProps = {
    isCompact: false,
    isOnlyText: false,
  }

  setBorder = (orientation: Array<'TOP' | 'LEFT' | 'BOTTOM' | 'RIGHT'>) => {
    const property = '1px solid var(--figma-color-border)',
      styles: { [key: string]: React.CSSProperties } = {
        container: {},
      }

    orientation.forEach((entry) => {
      if (entry === 'TOP') styles.container['borderTop'] = property
      if (entry === 'LEFT') styles.container['borderLeft'] = property
      if (entry === 'BOTTOM') styles.container['borderBottom'] = property
      if (entry === 'RIGHT') styles.container['borderRight'] = property
    })
    return styles
  }

  render() {
    return (
      <div
        className={[
          'bar',
          this.props.isCompact ? 'bar--compact' : null,
          this.props.isOnlyText ? 'bar--text-only' : null
        ].filter(n => n).join(' ')}
        style={this.setBorder(this.props.border).container}
      >
        <div className="bar__left">{this.props.leftPart}</div>
        <div className="bar__right">{this.props.rightPart}</div>
      </div>
    )
  }
}
