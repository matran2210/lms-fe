import React from 'react'

type iconType =
  | 'course_text'
  | 'course_video'
  | 'course_past_exam_analysis'
  | 'course_video_timeline'
  | 'course_quiz'
  | 'arrowDownFull'
  | 'arrowRightFull'

type SAPP_ICONS_TYPE = {
  [key in iconType]: React.ReactNode
}

type Props = {
  icon: keyof SAPP_ICONS_TYPE
  className?: string
  colorIcon?: string
}

const SappIcon = ({ icon, className, colorIcon }: Props) => {
  const SAPP_ICONS: SAPP_ICONS_TYPE = {
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
    course_quiz: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        height={16}
        fill="none"
      >
        <path
          fill="#A1A1A1"
          stroke="#A1A1A1"
          strokeWidth={0.1}
          d="M7.202 9.69c.005-.49.062-.884.173-1.18a1.79 1.79 0 0 1 .473-.72 3.74 3.74 0 0 1 .723-.5c.164-.09.31-.195.44-.317.13-.123.23-.264.304-.424.076-.16.115-.335.115-.53 0-.24-.063-.447-.187-.621a1.225 1.225 0 0 0-.503-.408 1.684 1.684 0 0 0-.706-.145c-.226 0-.444.043-.653.127-.207.083-.38.214-.52.393a1.12 1.12 0 0 0-.2.437c-.04.17-.183.313-.368.313h-.477c-.198 0-.366-.169-.329-.373.057-.308.172-.582.347-.82A2.25 2.25 0 0 1 6.76 4.2a3.175 3.175 0 0 1 1.274-.249c.505 0 .946.09 1.323.273.378.182.672.432.879.752.21.32.314.683.314 1.09 0 .286-.05.547-.148.78a1.9 1.9 0 0 1-.42.624M7.203 9.69l2.745-2.256M7.202 9.69c0 .053.043.096.096.096h.928a.096.096 0 0 0 .096-.096h-.05m-1.07 0h1.07m1.71-2.22-.035-.036m.036.035-.036-.035m.036.035c-.18.182-.396.343-.65.483m.614-.518a2.756 2.756 0 0 1-.637.474m.024.044-.024-.044m.024.044a2.55 2.55 0 0 0-.588.435c-.145.147-.25.322-.316.527a2.738 2.738 0 0 0-.108.777h-.05m1.062-1.74v.001l-.024-.044m0 0L8.272 9.69m-.07 2.262a.808.808 0 0 0 .295-.268.681.681 0 0 0-.127-.895.83.83 0 0 0-.574-.216.83.83 0 0 0-.573.216.681.681 0 0 0-.242.523c0 .204.082.379.242.523a.83.83 0 0 0 .573.215c.15 0 .285-.032.406-.098Z"
        />
        <rect
          width={15}
          height={15}
          x={0.5}
          y={0.5}
          stroke="#A1A1A1"
          rx={1.5}
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
      >
        <path
          className={className}
          d="M17.438 4.219H.563v1.687h16.875V4.22ZM14.625 8.156H3.375v1.688h11.25V8.156ZM11.25 12.094h-4.5v1.687h4.5v-1.687Z"
        />
      </svg>
    ),

    arrowDownFull: (
      <svg
        width="10"
        height="8"
        viewBox="0 0 10 8"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5 8C4.60655 8 4.23607 7.80241 4 7.46667L0.250007 2.13333C-0.0340716 1.72931 -0.0797668 1.18876 0.131973 0.737049C0.343713 0.285337 0.776541 0 1.25001 0H8.74999C9.22346 0 9.65629 0.285337 9.86803 0.737049C10.0798 1.18876 10.0341 1.72931 9.74999 2.13333L6 7.46667C5.76393 7.80241 5.39345 8 5 8Z"
          fill="#EF5941"
        />
      </svg>
    ),
    arrowRightFull: (
      <svg
        width="8"
        height="10"
        viewBox="0 0 8 10"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.737049 0.131973C1.18876 -0.0797666 1.72931 -0.0340718 2.13333 0.250007L7.46667 4C7.80241 4.23607 8 4.60655 8 5C8 5.39345 7.80241 5.76393 7.46667 6L2.13333 9.74999C1.72931 10.0341 1.18876 10.0798 0.737049 9.86803C0.285336 9.65629 0 9.22346 0 8.74999V1.25001C0 0.776541 0.285336 0.343713 0.737049 0.131973Z"
          fill="#A1A1A1"
        />
      </svg>
    ),
  }

  return <div>{SAPP_ICONS[icon]}</div>
}

export default SappIcon
