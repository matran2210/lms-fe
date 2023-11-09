import { ReactNode } from 'react'

interface IProps {
  className?: string
  children: ReactNode
}

const ErrorMessage = ({ className = '', children }: IProps) => {
  return (
    <>
      {children && (
        <div
          className={`${className} text-state-error text-sm leading-4.5 font-normal mt-1 ml-4`}
        >
          test
        </div>
      )}
    </>
  )
}

export default ErrorMessage
