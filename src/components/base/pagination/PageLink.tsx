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
          : 'min-h-default min-w-default border text-sm font-normal leading-8.5'
      } relative flex cursor-pointer items-center justify-center p-0.5
      ${isViewedProp && type !== 'row' ? '!border-default bg-gray-3' : ''} ${
        active
          ? 'border-active bg-primary text-white'
          : !isViewedProp
            ? 'border-default bg-white text-gray-1 hover:border-active hover:bg-primary hover:text-white'
            : 'border-gray-2 text-gray-1 hover:border-active hover:bg-primary hover:text-white'
      }`}
      aria-current={active ? 'page' : undefined}
      {...otherProps}
    >
      <span
        className="h-full w-full text-center"
        // onClick={() => {
        //   setIsViewed(true)
        //   // setIsFlagged(!isFlagged)
        // }}
      >
        {children}
      </span>
      {isFlagedProp && (
        <i className="absolute right-1 top-1 h-2 w-2 rounded-full bg-gray-1"></i>
      )}
    </li>
  )
}

export default PageLink
