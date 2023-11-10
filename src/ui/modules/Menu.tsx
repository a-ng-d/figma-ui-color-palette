import * as React from 'react'
import type { DropdownAction } from '../../utils/types'
import Button from '../components/Button'

interface Props {
  icon: string
  actions: Array<DropdownAction>
  alignment?: 'TOP_RIGHT' | 'TOP_LEFT' | 'BOTTOM_RIGHT' | 'BOTTOM_LEFT'
}

export default class Menu extends React.Component<Props, any> {
  static defaultProps = {
    actions: [],
    alignment: 'BOTTOM_LEFT',
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      isMenuOpen: false,
    }
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  componentDidMount = () =>
    document.addEventListener('mousedown', this.handleClickOutside)

  componentWillUnmount = () =>
    document.removeEventListener('mousedown', this.handleClickOutside)

  handleClickOutside = (e: Event) => {
    if ((e.target as HTMLElement).closest('.menu'))
      this.setState({
        isMenuOpen: true,
      })
    else
      this.setState({
        isMenuOpen: false,
      })
  }

  // Templates
  Menu = (props: { actions: Array<DropdownAction> }) => {
    return (
      <ul className="select-menu__menu select-menu__menu--active">
        {props.actions?.map((action, index) => {
          if (!action.isSeparator && action.isActive)
            return (
              <li
                key={'action-' + index}
                className={[
                  'select-menu__item',
                  action.isBlocked ? 'select-menu__item--blocked' : null,
                ]
                  .filter((n) => n)
                  .join(' ')}
                data-is-blocked={action.isBlocked}
                onMouseDown={() => {
                  action.action()
                  this.setState({
                    isMenuOpen: false,
                  })
                }}
              >
                <span className="select-menu__item-icon"></span>
                <span className="select-menu__item-label">{action.label}</span>
              </li>
            )
          else if (action.isActive) return <hr key={'action-' + index} />
          else return null
        })}
      </ul>
    )
  }

  render() {
    return (
      <div
        className={[
          'menu',
          'menu--' +
            this.props.alignment?.toLocaleLowerCase().replace('_', '-'),
        ]
          .filter((n) => n)
          .join(' ')}
      >
        <Button
          type="icon"
          icon={this.props.icon}
          state={this.state['isMenuOpen'] ? 'selected' : ''}
          action={() =>
            this.setState({
              isMenuOpen: !this.state['isMenuOpen'],
            })
          }
        />
        {this.state['isMenuOpen'] ? (
          <this.Menu actions={this.props.actions} />
        ) : null}
      </div>
    )
  }
}
