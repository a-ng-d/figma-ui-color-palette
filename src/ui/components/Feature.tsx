import * as React from 'react'

interface Props {
  isActive: boolean
  children: React.ReactNode
}

export default class Feature extends React.Component<Props> {
  static defaultProps = {
    isActive: false,
    isPro: false,
  }

  // Render
  render() {
    return <>{this.props.isActive ? this.props.children : null}</>
  }
}
