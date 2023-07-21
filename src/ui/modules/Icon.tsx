import * as React from 'react'

interface Props {
  size: number
}

export default class Icon extends React.Component<Props> {
  render() {
    return (
      <svg
        width={this.props.size}
        height={this.props.size}
        viewBox="0 0 128 128"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="4" width="120" height="128" rx="28" fill="white"/>
        <g clipPath="url(#clip0_1975_2917)">
        <rect x="44" width="40" height="43" fill="#BEDFE3" stroke="#00272F" strokeWidth="2"/>
        <rect x="44" y="43" width="40" height="42" fill="#E9F4F6" stroke="#00272F" strokeWidth="2"/>
        <rect x="44" y="85" width="40" height="43" fill="#0E8390" stroke="#00272F" strokeWidth="2"/>
        <rect x="8" width="36" height="43" fill="#003D47" stroke="#00272F" strokeWidth="2"/>
        <rect x="8" y="43" width="36" height="42" fill="#005460" stroke="#00272F" strokeWidth="2"/>
        <rect x="8" y="85" width="36" height="43" fill="#006C79" stroke="#00272F" strokeWidth="2"/>
        <rect x="84" width="36" height="43" fill="#93C9D0" stroke="#00272F" strokeWidth="2"/>
        <rect x="84" y="43" width="36" height="42" fill="#6AB2BC" stroke="#00272F" strokeWidth="2"/>
        <rect x="84" y="85" width="36" height="43" fill="#419BA7" stroke="#00272F" strokeWidth="2"/>
        </g>
        <rect width="112" height="120" rx="24" transform="matrix(1 0 0 -1 8 124)" stroke="#00272F" strokeWidth="4"/>
        <rect x="36" y="28" width="56" height="72" rx="6" fill="#88EBF9" stroke="#00272F" strokeWidth="4"/>
        <defs>
        <clipPath id="clip0_1975_2917">
        <rect width="112" height="120" rx="24" transform="matrix(1 0 0 -1 8 124)" fill="white"/>
        </clipPath>
        </defs>
      </svg>
    )
  }
}
