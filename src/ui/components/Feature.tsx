import React from 'react'

interface FeatureProps {
  isActive: boolean
  children: React.ReactNode
}

export default class Feature extends React.Component<FeatureProps> {
  static defaultProps = {
    isActive: false,
    isPro: false,
  }

  // Render
  render() {
    return <>{this.props.isActive ? this.props.children : null}</>
  }
}
