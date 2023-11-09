import React from 'react'
import { IButtonProps } from 'src/type'

const ButtonSecondary = ({
  title,
  onClick,
  className = '',
  link,
}: IButtonProps) => {
  if (link)
    return (
      <a href={link} className={`${className} btn btn-light`}>
        <i className="ki-outline ki-check fs-3 d-none"></i>
        <span className="indicator-label">{title}</span>
        <span className="indicator-progress">
          Please wait...
          <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
        </span>
      </a>
    )

  return (
    <div className={`${className} btn btn-light me-3`} onClick={onClick}>
      {title}
    </div>
  )
}

export default ButtonSecondary
