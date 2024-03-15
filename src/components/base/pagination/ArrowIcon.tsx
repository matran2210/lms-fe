import React from 'react'
import { ReactNode } from 'react'

interface Props {
  className?: string
  iconType?: 'chervon' | 'teeny'
  right?: boolean
  children?: ReactNode
}

const ArrowIcon = ({ className = '', iconType, right }: Props) => {
  return (
    <>
      {iconType === 'chervon' && (
        <svg
          className={`${className} ${right ? 'rotate-180 ' : ''}`}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.5301 6.08L8.6001 12L14.5301 17.92"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {iconType === 'teeny' && (
        <svg
          className={`${className} ${right ? 'rotate-180 ' : ''}`}
          width="6"
          height="20"
          viewBox="0 0 8 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.06508 22.4001L0.998413 12.0001L7.06508 1.6001"
            stroke="currentColor"
            strokeLinecap="square"
          />
        </svg>
      )}
    </>
  )
}

export default ArrowIcon
