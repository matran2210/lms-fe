import React from 'react'

type iconType =
  | 'camera'
  | 'course_text'
  | 'course_video'
  | 'course_past_exam_analysis'
  | 'course_video_timeline'
  | 'arrow_left'
  | 'arrow_right'
  | 'arrow_down'
  | 'x'

type SAPP_ICONS_TYPE = {
  [key in iconType]: React.ReactNode
}

type Props = {
  icon: keyof SAPP_ICONS_TYPE
  className?: string
}

const SappIcon = ({ icon, className }: Props) => {
  const SAPP_ICONS: SAPP_ICONS_TYPE = {
    camera: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        height={16}
        fill="none"
        className={className}
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
        className={className}
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
        className={className}
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
    course_past_exam_analysis: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
      >
        <rect width="24" height="24" rx="3" fill="#F1F1F2" />
        <rect
          x="5.25"
          y="19"
          width="11"
          height="1.5"
          rx="0.3"
          transform="rotate(-90 5.25 19)"
          fill="#404041"
        />
        <rect
          x="11.25"
          y="19"
          width="14"
          height="1.5"
          rx="0.3"
          transform="rotate(-90 11.25 19)"
          fill="#404041"
        />
        <rect
          x="17.25"
          y="19"
          width="9"
          height="1.5"
          rx="0.3"
          transform="rotate(-90 17.25 19)"
          fill="#404041"
        />
      </svg>
    ),
    course_video_timeline: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={18}
        height={18}
        fill="none"
        className={className}
      >
        <path
          fill="#FFB800"
          d="M17.438 4.219H.563v1.687h16.875V4.22ZM14.625 8.156H3.375v1.688h11.25V8.156ZM11.25 12.094h-4.5v1.687h4.5v-1.687Z"
        />
      </svg>
    ),
    arrow_left: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        height={16}
        fill="none"
        className={className}
      >
        <path
          fill="#404041"
          d="M11.313 3.411V2.203a.125.125 0 0 0-.202-.098L4.067 7.606a.498.498 0 0 0 0 .786l7.044 5.502a.124.124 0 0 0 .201-.099v-1.207a.253.253 0 0 0-.095-.197L5.592 8l5.625-4.392a.253.253 0 0 0 .095-.197Z"
        />
      </svg>
    ),
    arrow_right: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        height={16}
        fill="none"
        className={className}
      >
        <path
          fill="#404041"
          d="M4.688 12.59v1.207c0 .105.12.162.201.098l7.044-5.501a.497.497 0 0 0 0-.786L4.889 2.106a.124.124 0 0 0-.201.099v1.207c0 .077.035.15.095.197L10.408 8l-5.625 4.392a.253.253 0 0 0-.095.197Z"
        />
      </svg>
    ),
    arrow_down: (
      <svg
        width="19"
        height="19"
        viewBox="0 0 19 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path d="M4 9L9.5 14L15 9H4Z" />
      </svg>
    ),
    x: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className={className + ' fill-gray-1'}
      >
        <path d="M13.41 12L17 8.44003C17.191 8.24642 17.2972 7.98489 17.2953 7.71296C17.2934 7.44103 17.1836 7.18099 16.99 6.99003C16.7964 6.79908 16.5349 6.69285 16.2629 6.69473C15.991 6.6966 15.731 6.80642 15.54 7.00003L12 10.59L8.46 7.07003C8.27263 6.88378 8.01918 6.77924 7.755 6.77924C7.49081 6.77924 7.23736 6.88378 7.05 7.07003C6.95627 7.16299 6.88187 7.2736 6.8311 7.39546C6.78034 7.51731 6.7542 7.64802 6.7542 7.78003C6.7542 7.91204 6.78034 8.04275 6.8311 8.16461C6.88187 8.28647 6.95627 8.39707 7.05 8.49003L10.59 12L7 15.56C6.80904 15.7536 6.70282 16.0152 6.70469 16.2871C6.70657 16.559 6.81639 16.8191 7.01 17.01C7.2036 17.201 7.46514 17.3072 7.73707 17.3053C8.00899 17.3035 8.26904 17.1936 8.46 17L12 13.41L15.54 16.93C15.7274 17.1163 15.9808 17.2208 16.245 17.2208C16.5092 17.2208 16.7626 17.1163 16.95 16.93C17.0437 16.8371 17.1181 16.7265 17.1689 16.6046C17.2197 16.4827 17.2458 16.352 17.2458 16.22C17.2458 16.088 17.2197 15.9573 17.1689 15.8355C17.1181 15.7136 17.0437 15.603 16.95 15.51L13.41 12Z" />
      </svg>
    ),
  }

  return <div>{SAPP_ICONS[icon]}</div>
}

export default SappIcon
