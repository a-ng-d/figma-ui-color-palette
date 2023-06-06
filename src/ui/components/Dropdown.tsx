import * as React from 'react'
import { selectMenu } from 'figma-plugin-ds'

interface Props {
  id: string
  options: Array<{
    label: string
    value: string
    isActive?: boolean
    isBlocked?: boolean
  }>
  selected: string
  onChange: React.ChangeEventHandler
}

export default class Dropdown extends React.Component<Props> {
  componentDidMount = () => {
    selectMenu.init()
    setTimeout(() => {
      document.getElementById(this.props.id).onchange = (e: any) =>
        this.props.onChange(e)

      document.getElementById(this.props.id).nextSibling.nextSibling.childNodes.forEach((li: any) => {
        const option = this.props.options.find(option => option.value === li.dataset.value)
        if (option.isBlocked) {
          li.classList.add('select-menu__item--blocked')
        }
      })
      
    }, 500)
  }

  componentWillUnmount = () => {
    document.getElementById(this.props.id).onchange = null
  }

  render() {
    return (
      <select
        id={this.props.id}
        className="select-menu"
        defaultValue={this.props.selected}
      >
        {this.props.options.map((option, index) =>
          option.isActive ? (<option
            key={index}
            value={option.value}
            disabled={option.isBlocked}
            data-is-blocked={option.isBlocked}
          >
            {option.label}
          </option>) : null
        )}
      </select>
    )
  }
}
