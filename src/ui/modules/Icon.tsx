import * as React from 'react';

interface Props {
  size: number
};

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
        <mask id="path-1-inside-1_41_1896" fill="white">
        <path d="M64 8C75.826 8 87.3485 11.7439 96.916 18.695L64 64L64 8Z"/>
        </mask>
        <path d="M64 8C75.826 8 87.3485 11.7439 96.916 18.695L64 64L64 8Z" fill="#A0FFFF" stroke="black" stroke-width="2" mask="url(#path-1-inside-1_41_1896)"/>
        <mask id="path-2-inside-2_41_1896" fill="white">
        <path d="M117.259 46.695C120.914 57.9423 120.914 70.0577 117.259 81.305L64 64L117.259 46.695Z"/>
        </mask>
        <path d="M117.259 46.695C120.914 57.9423 120.914 70.0577 117.259 81.305L64 64L117.259 46.695Z" fill="#71D5E2" stroke="black" stroke-width="2" mask="url(#path-2-inside-2_41_1896)"/>
        <mask id="path-3-inside-3_41_1896" fill="white">
        <path d="M117.259 81.305C113.605 92.5522 106.483 102.354 96.916 109.305L64 64L117.259 81.305Z"/>
        </mask>
        <path d="M117.259 81.305C113.605 92.5522 106.483 102.354 96.916 109.305L64 64L117.259 81.305Z" fill="#59BFCC" stroke="black" stroke-width="2" mask="url(#path-3-inside-3_41_1896)"/>
        <mask id="path-4-inside-4_41_1896" fill="white">
        <path d="M96.916 109.305C87.3485 116.256 75.826 120 64 120L64 64L96.916 109.305Z"/>
        </mask>
        <path d="M96.916 109.305C87.3485 116.256 75.826 120 64 120L64 64L96.916 109.305Z" fill="#40A9B6" stroke="black" stroke-width="2" mask="url(#path-4-inside-4_41_1896)"/>
        <mask id="path-5-inside-5_41_1896" fill="white">
        <path d="M64 120C52.174 120 40.6515 116.256 31.084 109.305L64 64L64 120Z"/>
        </mask>
        <path d="M64 120C52.174 120 40.6515 116.256 31.084 109.305L64 64L64 120Z" fill="#2194A0" stroke="black" stroke-width="2" mask="url(#path-5-inside-5_41_1896)"/>
        <mask id="path-6-inside-6_41_1896" fill="white">
        <path d="M31.084 109.305C21.5166 102.354 14.3953 92.5522 10.7408 81.3049L64 64L31.084 109.305Z"/>
        </mask>
        <path d="M31.084 109.305C21.5166 102.354 14.3953 92.5522 10.7408 81.3049L64 64L31.084 109.305Z" fill="#007F8B" stroke="black" stroke-width="2" mask="url(#path-6-inside-6_41_1896)"/>
        <mask id="path-7-inside-7_41_1896" fill="white">
        <path d="M10.7408 81.3049C7.08638 70.0577 7.08638 57.9423 10.7408 46.695L64 64L10.7408 81.3049Z"/>
        </mask>
        <path d="M10.7408 81.3049C7.08638 70.0577 7.08638 57.9423 10.7408 46.695L64 64L10.7408 81.3049Z" fill="#006A77" stroke="black" stroke-width="2" mask="url(#path-7-inside-7_41_1896)"/>
        <mask id="path-8-inside-8_41_1896" fill="white">
        <path d="M10.7408 46.695C14.3953 35.4478 21.5166 25.6462 31.084 18.695L64 64L10.7408 46.695Z"/>
        </mask>
        <path d="M10.7408 46.695C14.3953 35.4478 21.5166 25.6462 31.084 18.695L64 64L10.7408 46.695Z" fill="#005763" stroke="black" stroke-width="2" mask="url(#path-8-inside-8_41_1896)"/>
        <mask id="path-9-inside-9_41_1896" fill="white">
        <path d="M31.084 18.695C40.6515 11.7439 52.174 8 64 8L64 64L31.084 18.695Z"/>
        </mask>
        <path d="M31.084 18.695C40.6515 11.7439 52.174 8 64 8L64 64L31.084 18.695Z" fill="#004450" stroke="black" stroke-width="2" mask="url(#path-9-inside-9_41_1896)"/>
        <mask id="path-10-inside-10_41_1896" fill="white">
        <path d="M96.916 18.695C106.483 25.6462 113.605 35.4478 117.259 46.695L64 64L96.916 18.695Z"/>
        </mask>
        <path d="M96.916 18.695C106.483 25.6462 113.605 35.4478 117.259 46.695L64 64L96.916 18.695Z" fill="#89ECF9" stroke="black" stroke-width="2" mask="url(#path-10-inside-10_41_1896)"/>
        <circle cx="64" cy="64" r="32" fill="#88EBF9"/>
        <circle cx="64" cy="64" r="56" stroke="black" stroke-width="4"/>
        <circle cx="64" cy="64" r="32" stroke="black" stroke-width="4"/>
      </svg>
    )
  }

}
