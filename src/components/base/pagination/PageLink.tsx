import { FlagIcon } from '@assets/icons'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

interface Props {
  active?: boolean
  disabled?: boolean
  children?: any
  onClick?: () => void
  arrow?: boolean
  type?: string
  isViewedProp?: boolean
  isFlagedProp?: boolean
}

const PageLink = ({
  active,
  disabled,
  arrow,
  type,
  children,
  isViewedProp,
  isFlagedProp,
  ...otherProps
}: Props) => {
  // const [isViewed, setIsViewed] = useState<boolean>(false)
  // useEffect(() => {
  //   if (isViewedProp !== undefined) {
  //     setIsViewed(isViewedProp)
  //   }
  // }, [isViewedProp])
  if (arrow && disabled) {
    return (
      <li
        className={`flex cursor-not-allowed items-center justify-center ${
          type === 'table'
            ? 'min-h-8 min-w-8 text-[#D8D8E5]'
            : 'min-h-9 text-[#A1A1A1]'
        }`}
      >
        {children}
      </li>
    )
  } else if (arrow) {
    return (
      <li
        className={`${
          type === 'table' ? 'min-h-8 min-w-8 text-[#7E8299]' : 'min-h-10'
        } flex cursor-pointer items-center justify-center`}
        {...otherProps}
      >
        {children}
      </li>
    )
  }

  if (disabled) {
    return (
      <li
        className={`flex items-center justify-center ${
          type === 'table'
            ? 'min-h-8 min-w-8 text-[#7E8299]'
            : 'min-h-10 text-3xl font-thin leading-[33px] text-[#A1A1A1] '
        }`}
      >
        {children}
      </li>
    )
  }

  return (
    <li
      className={`${
        type === 'table'
          ? 'text-xsm min-h-8 min-w-8 rounded-md font-semibold leading-[18px]'
          : 'min-h-9.5 max-h-10 min-w-[38px] text-sm font-normal leading-[22px]'
      } relative flex cursor-pointer items-center justify-center rounded p-2
      ${isViewedProp && type !== 'row' ? 'bg-gray-400 text-white' : ''} ${
        active
          ? 'border-[#FFB800] bg-primary text-white'
          : !isViewedProp
            ? 'bg-gray-100 text-gray-800 hover:border-[#FFB800] hover:bg-primary hover:text-white'
            : 'text-gray-100 hover:bg-primary hover:text-white'
      }`}
      aria-current={active ? 'page' : undefined}
      {...otherProps}
    >
      <span
        className="h-[22px] w-4 text-center"
        // onClick={() => {
        //   setIsViewed(true)
        //   // setIsFlagged(!isFlagged)
        // }}
      >
        {children}
      </span>
      {isFlagedProp && (
        <div className="absolute -right-1 -top-[5px]">
          <FlagIcon width={'16'} height={'16'} />
        </div>
      )}
    </li>
  )
}

export default PageLink
