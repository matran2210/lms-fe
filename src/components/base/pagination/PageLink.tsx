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
        className={`flex cursor-not-allowed items-center justify-center p-0.5 ${
          type === 'table'
            ? 'min-h-8 min-w-8 text-gray-6'
            : 'min-h-default text-gray-1'
        }`}
      >
        {children}
      </li>
    )
  } else if (arrow) {
    return (
      <li
        className={`${
          type === 'table' ? 'min-h-8 min-w-8 text-gray-5' : 'min-h-default'
        } flex cursor-pointer items-center justify-center p-0.5`}
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
            ? 'min-h-8 min-w-8 text-gray-5'
            : 'min-h-default text-3xl font-thin leading-8.5 text-gray-1 '
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
          ? 'min-h-8 min-w-8 rounded-md text-xsm font-semibold leading-4.8'
          : 'min-h-9.5 min-w-9.5 text-sm font-normal leading-5.5'
      } relative flex cursor-pointer items-center justify-center rounded p-2
      ${isViewedProp && type !== 'row' ? '!border-default bg-gray-3' : ''} ${
        active
          ? 'border-active bg-primary text-white'
          : !isViewedProp
            ? 'bg-gray-100 text-bw-13 hover:border-active hover:bg-primary hover:text-white'
            : 'text-gray-1  hover:bg-primary hover:text-white'
      }`}
      aria-current={active ? 'page' : undefined}
      {...otherProps}
    >
      <span
        className="h-5.5 w-4 text-center"
        // onClick={() => {
        //   setIsViewed(true)
        //   // setIsFlagged(!isFlagged)
        // }}
      >
        {children}
      </span>
      {isFlagedProp && (
        <div className="absolute -right-1 -top-1.5">
          <FlagIcon width={'16'} height={'16'} />
        </div>
      )}
    </li>
  )
}

export default PageLink
