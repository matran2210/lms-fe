import React from 'react'

const iconType = 'camera'

type SAPP_ICONS_TYPE = {
  [key in typeof iconType]: React.ReactNode
}

type Props = {
  icon: keyof SAPP_ICONS_TYPE
}

const SappIcon = ({ icon }: Props) => {
  const SAPP_ICONS: SAPP_ICONS_TYPE = {
    camera: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        height={16}
        fill="none"
      >
        <g fill="#A1A1A1" clipPath="url(#a)">
          <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6ZM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2Z" />
          <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
        </g>
        <defs>
          <clipPath id="a">
            <path fill="#fff" d="M0 0h16v16H0z" />
          </clipPath>
        </defs>
      </svg>
    ),
  }

  return <div>{SAPP_ICONS[icon]}</div>
}

export default SappIcon
