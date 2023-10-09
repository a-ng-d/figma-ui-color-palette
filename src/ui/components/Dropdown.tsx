import * as React from 'react'
import type { DropdownAction, DropdownOption } from '../../utils/types'

interface Props {
  id: string
  options: Array<DropdownOption>
  selected: string
  feature: string
  actions?: Array<DropdownAction>
  parentClassName?: string
  alignment?: 'RIGHT' | 'LEFT' | 'FILL'
  onChange: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void
}

export default class Dropdown extends React.Component<Props, any> {
  selectMenuRef: React.MutableRefObject<any>
  buttonRef: React.MutableRefObject<any>
  listRef: React.MutableRefObject<any>

  static defaultProps = {
    actions: [],
    alignment: 'LEFT',
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      isMenuOpen: false,
      position: 0,
    }
    this.selectMenuRef = React.createRef()
    this.buttonRef = React.createRef()
    this.listRef = React.createRef()
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  componentDidMount = () =>
    document.addEventListener('mousedown', this.handleClickOutside)

  componentWillUnmount = () =>
    document.removeEventListener('mousedown', this.handleClickOutside)

  handleClickOutside = (e: Event) => {
    if (e.target === this.buttonRef.current)
      this.setState({
        isMenuOpen: true,
      })
    else if (e.target != this.listRef.current)
      this.setState({
        isMenuOpen: false,
      })
  }

  // Direct actions
  onOpenMenu = () => {
    this.setState({
      isMenuOpen: true,
    })
    if (this.props.parentClassName != undefined)
      setTimeout(() => {
        const diffTop: number =
            this.listRef.current.getBoundingClientRect().top -
            document
              .getElementsByClassName(this.props.parentClassName as string)[0]
              .getBoundingClientRect().top,
          diffBottom: number =
            this.listRef.current.getBoundingClientRect().bottom -
            document
              .getElementsByClassName(this.props.parentClassName as string)[0]
              .getBoundingClientRect().bottom

        if (diffTop < -16) {
          this.listRef.current.style.top = '-6px'
          this.listRef.current.style.bottom = 'auto'
        }
        if (diffBottom > -16) {
          this.listRef.current.style.top = 'auto'
          this.listRef.current.style.bottom = '-6px'
        }
      }, 1)
  }

  onSelectItem = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    this.setState({
      isMenuOpen: false,
      position: (e.target as HTMLLIElement).dataset.position,
    })
    this.props.onChange(e)
  }

  onSelectAction = (callback: () => void) => {
    this.setState({
      isMenuOpen: false,
    })
    callback()
  }

  findSelectedOption = (options: Array<DropdownOption>) =>
    options
      .map((option) => {
        if (option.value === this.props.selected) return option
        else
          return option.children?.find(
            (child) => child.value === this.props.selected
          )
      })
      .find((item) => item != null)

  // Templates
  Menu = (props: {
    options: Array<DropdownOption> | undefined
    actions?: Array<DropdownAction> | undefined
  }) => {
    return (
      <ul
        className="select-menu__menu select-menu__menu--active"
        style={{ top: `${this.state['position'] * -24 - 6}px` }}
        ref={this.listRef}
      >
        {props.options?.map((option, index) => {
          if (option.children != undefined) {
            if (option.isActive && option.children.length > 0)
              return (
                <this.MenuGroup
                  key={'group-' + index}
                  option={option}
                />
              )
            else
              return (
                <this.MenuOption
                  key={'option-' + index}
                  option={option}
                />
              )
          }
        })}
        {props.actions != undefined ? (
          props.actions.length > 0 ? (
            <>
              <hr />
              {props.actions.map((action, index) => (
                <this.MenuAction
                  key={index}
                  action={action}
                />
              ))}
            </>
          ) : null
        ) : null}
      </ul>
    )
  }

  SubMenu = (props: { options: Array<DropdownOption> | undefined }) => {
    return (
      <ul className="select-menu__menu select-menu__submenu select-menu__menu--active">
        {props.options?.map((option, index) => {
          if (option.children != undefined) {
            if (option.isActive && option.children.length > 0)
              return (
                <this.MenuGroup
                  key={'group-' + index}
                  option={option}
                />
              )
            else
              return (
                <this.MenuOption
                  key={'option-' + index}
                  option={option}
                />
              )
          }
        })}
      </ul>
    )
  }

  MenuGroup = (props: { option: DropdownOption }) => {
    return (
      <li
        className={`select-menu__item${
          props.option.isBlocked ? ' select-menu__item--blocked' : ''
        }`}
        data-position={props.option.position}
        data-is-blocked={props.option.isBlocked}
        onMouseOver={() => this.setState({ openedGroup: props.option.value })}
        onMouseOut={() => this.setState({ openedGroup: 'EMPTY' })}
      >
        <span className="select-menu__item-icon"></span>
        <span className="select-menu__item-label">{props.option.label}</span>
        <span className="select-menu__item-carret"></span>
        {this.state['openedGroup'] === props.option.value ? (
          <this.SubMenu options={props.option.children} />
        ) : null}
      </li>
    )
  }

  MenuOption = (props: { option: DropdownOption }) => {
    return (
      <li
        className={`select-menu__item${
          props.option.value === this.props.selected
            ? ' select-menu__item--selected'
            : ''
        }${props.option.isBlocked ? ' select-menu__item--blocked' : ''}`}
        data-value={props.option.value}
        data-position={props.option.position}
        data-is-blocked={props.option.isBlocked}
        data-feature={this.props.feature}
        onMouseDown={(e) => this.onSelectItem(e)}
      >
        <span className="select-menu__item-icon"></span>
        <span className="select-menu__item-label">{props.option.label}</span>
      </li>
    )
  }

  MenuSubOption = (props: { option: DropdownOption }) => {
    console.log(props.option.position)
    return (
      <li
        className={`select-menu__item${
          props.option.value === this.props.selected
            ? ' select-menu__item--selected'
            : ''
        }${props.option.isBlocked ? ' select-menu__item--blocked' : ''}`}
        data-value={props.option.value}
        data-position={props.option.position}
        data-is-blocked={props.option.isBlocked}
        data-feature={this.props.feature}
        onMouseDown={(e) => this.onSelectItem(e)}
      >
        <span className="select-menu__item-icon"></span>
        <span className="select-menu__item-label">{props.option.label}</span>
      </li>
    )
  }

  MenuAction = (props: { action: DropdownAction }) => {
    return (
      <li
        className={`select-menu__item${
          props.action.isBlocked ? ' select-menu__item--blocked' : ''
        }`}
        data-feature={props.action.feature}
        data-is-blocked={props.action.isBlocked}
        onMouseDown={() => this.onSelectAction(props.action.action)}
      >
        <span className="select-menu__item-icon"></span>
        <span className="select-menu__item-label">{props.action.label}</span>
      </li>
    )
  }

  render() {
    return (
      <div
        id={this.props.id}
        className={`select-menu${
          this.props.alignment === 'LEFT'
            ? ' select-menu--left'
            : this.props.alignment === 'RIGHT'
            ? ' select-menu--right'
            : ' select-menu--fill'
        }`}
        ref={this.selectMenuRef}
      >
        <button
          className={`select-menu__button${
            this.state['isMenuOpen'] ? ' select-menu__button--active' : ''
          }`}
          onMouseDown={this.onOpenMenu}
          ref={this.buttonRef}
        >
          <span className="select-menu__label">
            {this.findSelectedOption(this.props.options)?.label}
          </span>
          <span className="select-menu__caret"></span>
        </button>
        {this.state['isMenuOpen'] ? (
          <this.Menu
            options={this.props.options}
            actions={this.props.actions}
          />
        ) : null}
      </div>
    )
  }
}
