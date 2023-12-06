import React from 'react'

type iconType =
  | 'camera'
  | 'course_text'
  | 'course_video'
  | 'course_video_timeline'

type SAPP_ICONS_TYPE = {
  [key in iconType]: React.ReactNode
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
    course_text: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        height={16}
        fill="none"
      >
        <rect
          width={15}
          height={15}
          x={0.5}
          y={0.5}
          stroke="#A1A1A1"
          rx={1.5}
        />
        <path
          fill="#A1A1A1"
          d="M3.333 4.2c0-.11.09-.2.2-.2h8.934c.11 0 .2.09.2.2v.6a.2.2 0 0 1-.2.2H3.533a.2.2 0 0 1-.2-.2v-.6ZM3.333 6.533c0-.11.09-.2.2-.2h8.934c.11 0 .2.09.2.2v.6a.2.2 0 0 1-.2.2H3.533a.2.2 0 0 1-.2-.2v-.6ZM3.333 8.867c0-.11.09-.2.2-.2h8.934c.11 0 .2.09.2.2v.6a.2.2 0 0 1-.2.2H3.533a.2.2 0 0 1-.2-.2v-.6ZM3.333 11.2c0-.11.09-.2.2-.2H9.8c.11 0 .2.09.2.2v.6a.2.2 0 0 1-.2.2H3.533a.2.2 0 0 1-.2-.2v-.6Z"
        />
      </svg>
    ),
    course_video: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        height={16}
        fill="none"
      >
        <rect
          width={15}
          height={15}
          x={0.5}
          y={0.5}
          stroke="#A1A1A1"
          rx={1.5}
        />
        <path
          stroke="#A1A1A1"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 10.403V5.466a.469.469 0 0 1 .709-.4l4.228 2.457a.468.468 0 0 1 0 .812L6.71 10.803a.469.469 0 0 1-.709-.4Z"
        />
      </svg>
    ),
    course_video_timeline: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={18}
        height={18}
        fill="none"
      >
        <path
          fill="#FFB800"
          d="M17.438 4.219H.563v1.687h16.875V4.22ZM14.625 8.156H3.375v1.688h11.25V8.156ZM11.25 12.094h-4.5v1.687h4.5v-1.687Z"
        />
      </svg>
    ),
  }

  return <div>{SAPP_ICONS[icon]}</div>
}

export default SappIcon
