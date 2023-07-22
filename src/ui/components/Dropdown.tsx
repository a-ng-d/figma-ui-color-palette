import * as React from 'react'

interface Props {
  id: string
  options: Array<{
    label: string
    value: string
    position: number
    isActive?: boolean
    isBlocked?: boolean
  }>
  selected: string
  feature: string
  actions?: Array<{
    label: string
    isBlocked: boolean
    feature: string
    action: React.MouseEventHandler
  }>
  parentClassName?: string
  onChange: React.ChangeEventHandler
}

export default class Dropdown extends React.Component<Props> {
  selectMenuRef: React.MutableRefObject<any>
  listRef: React.MutableRefObject<any>

  static defaultProps = {
    actions: [],
  }

  constructor(props) {
    super(props)
    this.state = {
      isListOpen: false,
      position: this.props.options.filter(
        (option) => option.value === this.props.selected
      )[0].position,
    }
    this.selectMenuRef = React.createRef()
    this.listRef = React.createRef()
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  componentDidMount = () =>
    document.addEventListener('mousedown', this.handleClickOutside)

  componentWillUnmount = () =>
    document.removeEventListener('mousedown', this.handleClickOutside)

  handleClickOutside = (e) => {
    if (this.selectMenuRef && !this.selectMenuRef.current.contains(e.target))
      this.setState({
        isListOpen: false,
      })
  }

  onOpenList = () => {
    this.setState({
      isListOpen: true,
    })
    if (this.props.parentClassName != undefined)
      setTimeout(() => {
        const diffTop: number = this.listRef.current.getBoundingClientRect().top - document.getElementsByClassName(this.props.parentClassName)[0].getBoundingClientRect().top,
          diffBottom: number = this.listRef.current.getBoundingClientRect().bottom - document.getElementsByClassName(this.props.parentClassName)[0].getBoundingClientRect().bottom
        
        if (diffTop < -16) {
          this.listRef.current.style.top = '-6px'
          this.listRef.current.style.bottom = 'auto'
        }
        if (
          diffBottom > -16
        ) {
          this.listRef.current.style.top = 'auto'
          this.listRef.current.style.bottom = '-6px'
        }
      }, 1)
  }

  onSelectItem = (e) => {
    this.setState({
      isListOpen: false,
      position: e.target.dataset.position,
    })
    this.props.onChange(e)
  }

  onSelectAction = (callback) => {
    this.setState({
      isListOpen: false,
    })
    callback()
  }

  render() {
    return (
      <div
        className="select-menu"
        ref={this.selectMenuRef}
      >
        <button
          className={`select-menu__button${
            this.state['isListOpen'] ? ' select-menu__button--active' : ''
          }`}
          onMouseDown={this.onOpenList}
        >
          <span className="select-menu__label">
            {
              this.props.options.filter(
                (option) => option.value === this.props.selected
              )[0].label
            }
          </span>
          <span className="select-menu__caret"></span>
        </button>
        {this.state['isListOpen'] ? (
          <ul
            className="select-menu__menu select-menu__menu--active"
            style={{ top: `${this.state['position'] * -24 - 6}px` }}
            ref={this.listRef}
          >
            {this.props.options.map((option, index) =>
              option.isActive ? (
                <li
                  key={index}
                  className={`select-menu__item${
                    option.value === this.props.selected
                      ? ' select-menu__item--selected'
                      : ''
                  }${option.isBlocked ? ' select-menu__item--blocked' : ''}`}
                  data-value={option.value}
                  data-position={option.position}
                  data-is-blocked={option.isBlocked}
                  data-feature={this.props.feature}
                  onMouseDown={this.onSelectItem}
                >
                  <span className="select-menu__item-icon"></span>
                  <span className="select-menu__item-label">
                    {option.label}
                  </span>
                </li>
              ) : null
            )}
            {this.props.actions.length > 0 ? (
              <>
                <hr />
                {this.props.actions.map((action, index) => (
                  <li
                    key={index}
                    className={`select-menu__item${
                      action.isBlocked ? ' select-menu__item--blocked' : ''
                    }`}
                    data-feature={action.feature}
                    data-is-blocked={action.isBlocked}
                    onMouseDown={() => this.onSelectAction(action.action)}
                  >
                    <span className="select-menu__item-icon"></span>
                    <span className="select-menu__item-label">
                      {action.label}
                    </span>
                  </li>
                ))}
              </>
            ) : null}
          </ul>
        ) : null}
      </div>
    )
  }
}
