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
          className={`${className}  ml-4 mt-1 flex items-start gap-1.5 text-sm font-normal leading-4.5 text-state-error`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mt-[0.0625rem] flex-none"
          >
            <path
              d="M7.7 7.7H6.3V3.5H7.7M7.7 10.5H6.3V9.1H7.7M7 0C6.08075 0 5.17049 0.18106 4.32122 0.532843C3.47194 0.884626 2.70026 1.40024 2.05025 2.05025C0.737498 3.36301 0 5.14348 0 7C0 8.85651 0.737498 10.637 2.05025 11.9497C2.70026 12.5998 3.47194 13.1154 4.32122 13.4672C5.17049 13.8189 6.08075 14 7 14C8.85651 14 10.637 13.2625 11.9497 11.9497C13.2625 10.637 14 8.85651 14 7C14 6.08075 13.8189 5.17049 13.4672 4.32122C13.1154 3.47194 12.5998 2.70026 11.9497 2.05025C11.2997 1.40024 10.5281 0.884626 9.67878 0.532843C8.8295 0.18106 7.91925 0 7 0Z"
              fill="#D35563"
            />
          </svg>
          <span className="flex-auto first-letter:uppercase">{children}</span>
        </div>
      )}
    </>
  )
}

export default ErrorMessage
