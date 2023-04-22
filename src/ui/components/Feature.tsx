import * as React from 'react'

interface Props {
  name: string
  isActive: boolean
  isPro: boolean
  children: any
}

export default class Feature extends React.Component<Props> {
  static defaultProps = {
    isActive: false,
    isPro: false
  }

  // Render
  render() {
    return (
      <>
        {this.props.isActive ? this.props.children : null}
      </>
    )
  }
}
