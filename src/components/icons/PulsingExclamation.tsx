import React from 'react'

const PulsingExclamation = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      fill="none"
      viewBox="0 28 28"
      {...props}
    >
      <g fill="#F80903" clip-path="url(#a)">
        <path d="M14.633 24.449a2.471 2.471 0 1 1-4.569-1.887 2.471 2.471 0 0 1 4.569 1.887ZM21.54 9.843l-4.84 8.528a2.066 2.066 0 0 1-2.61.926 2.07 2.07 0 0 1-1.195-2.498l2.591-9.457a3.295 3.295 0 1 1 6.054 2.501Z" />
      </g>
      <defs>
        <clipPath id="a">
          <style>
            {`
          @keyframes pulseAnim {
            0%   { transform: scale(1);   opacity: 1; }
            50%  { transform: scale(1.3); opacity: 0.7; }
            100% { transform: scale(1);   opacity: 1; }
          }
        `}
          </style>
          <path fill="#fff" d="m9.164 0 22.182 9.164-9.165 22.182L0 22.18z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default PulsingExclamation
