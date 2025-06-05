import React, { ReactNode } from 'react'

interface IProps {
  title?: string
  children: ReactNode
  onClick?: () => void
  className?: string
  trigger?: 'click'
  placement?: 'bottom-end'
  toggle?: 'modal'
  target?: string
  customButton?: boolean
}

const ButtonIcon = ({
  title,
  children,
  onClick,
  className = '',
  trigger,
  placement,
  target,
  toggle,
  customButton,
}: IProps) => {
  return (
    <button
      className={`${className} btn ${
        customButton ? `btn-sapp-filter btn-light-primary` : 'btn-primary'
      } h-[50px] w-12.5 rounded-full bg-primary text-white hover:bg-[#FFC83A]`}
      onClick={onClick}
      data-kt-menu-trigger={trigger}
      data-kt-menu-placement={placement}
      data-bs-toggle={toggle}
      data-bs-target={target}
    >
      {children}
      {title}
    </button>
  )
}

export default ButtonIcon
