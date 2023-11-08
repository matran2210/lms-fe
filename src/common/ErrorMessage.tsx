import { Typography } from 'antd'
import { ReactNode } from 'react'

interface IProps {
  className?: string
  children: ReactNode
}

const ErrorMessage = ({ className = '', children }: IProps) => {
  return (
    <>
      {children && (
        <Typography className={`${className} text-danger`}>
          <small>{children}</small>
        </Typography>
      )}
    </>
  )
}

export default ErrorMessage
