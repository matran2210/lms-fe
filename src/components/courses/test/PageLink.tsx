import React from 'react'
import { Flag } from '../icons/Flag'
import { PageLinkProps } from 'src/type/courses-3-level'

const PageLink = ({
  active,
  disabled,
  arrow,
  type,
  children,
  isViewedProp,
  isFlagedProp,
  ...otherProps
}: PageLinkProps) => {
  if (arrow && disabled) {
    return (
      <li
        className={`flex cursor-not-allowed items-center justify-center ${
          type === 'table'
            ? 'min-h-8 min-w-8 text-gray-6'
            : 'min-h-9 text-gray-1'
        }`}
      >
        {children}
      </li>
    )
  } else if (arrow) {
    return (
      <li
        className={`${
          type === 'table' ? 'min-h-8 min-w-8 text-gray-5' : 'min-h-10'
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
            ? 'min-h-8 min-w-8 text-gray-5'
            : 'min-h-10 text-3xl font-thin leading-[33px] text-gray-1'
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
          ? 'min-h-8 min-w-8 rounded-md text-xsm font-semibold leading-[18px]'
          : 'min-h-9.5 max-h-10 min-w-[38px] text-sm font-normal leading-[22px]'
      } relative flex cursor-pointer items-center justify-center rounded p-2
      ${isViewedProp && type !== 'row' ? 'bg-gray-12 text-white' : ''} ${
        active
          ? 'border-primary bg-primary text-white'
          : !isViewedProp
            ? 'bg-gray-3 text-bw-15 hover:border-primary hover:bg-primary hover:text-white'
            : 'text-gray-3 hover:bg-primary hover:text-white'
      }`}
      aria-current={active ? 'page' : undefined}
      {...otherProps}
    >
      <span className="h-[22px] w-4 text-center">{children}</span>
      {isFlagedProp && (
        <div className="absolute -right-1 -top-1.5">
          <Flag className="h-4 w-4 text-badge-reject" />
        </div>
      )}
    </li>
  )
}

export default PageLink
