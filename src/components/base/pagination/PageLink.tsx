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
        className={`cursor-not-allowed flex items-center justify-center p-0.5 ${
          type === 'table'
            ? 'min-w-8 min-h-8 text-gray-6'
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
          type === 'table' ? 'min-w-8 min-h-8 text-gray-5' : 'min-h-default'
        } p-0.5 cursor-pointer flex items-center justify-center`}
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
            ? 'text-gray-5 min-w-8 min-h-8'
            : 'min-h-default text-3xl leading-8.5 text-gray-1 font-thin '
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
          ? 'min-w-8 min-h-8 text-xsm leading-4.8 font-semibold rounded-md'
          : 'min-w-default min-h-default text-sm leading-8.5 font-normal border'
      } relative p-0.5 cursor-pointer flex items-center justify-center
      ${isViewedProp && type !== 'row' ? 'bg-gray-3 !border-default' : ''} ${
        active
          ? 'bg-primary text-white border-active'
          : !isViewedProp
            ? 'bg-white text-gray-1 border-default hover:bg-primary hover:text-white hover:border-active'
            : 'text-gray-1 border-gray-2 hover:bg-primary hover:text-white hover:border-active'
      }`}
      aria-current={active ? 'page' : undefined}
      {...otherProps}
    >
      <span
        className="w-full h-full text-center"
        // onClick={() => {
        //   setIsViewed(true)
        //   // setIsFlagged(!isFlagged)
        // }}
      >
        {children}
      </span>
      {isFlagedProp && (
        <i className="absolute top-1 right-1 w-2 h-2 bg-gray-1 rounded-full"></i>
      )}
    </li>
  )
}

export default PageLink
