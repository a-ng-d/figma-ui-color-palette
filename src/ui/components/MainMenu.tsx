import * as React from 'react'

interface Props {
  rightPart?: React.ReactElement
  leftPart?: React.ReactElement
}

export default class MainMenu extends React.Component<Props> {
  render() {
    return (
      <div className="main-menu">
        <div className="main-menu__left">
          {this.props.leftPart}
        </div>
        <div className="main-menu__right">
          {this.props.rightPart}
        </div>
      </div>
    )
  }
}
