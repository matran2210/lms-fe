import { memo } from 'react'

const Heading = ({ title }: { title: string }) => {
  return (
    <div className="flex content-center items-center justify-between">
      <div>
        <p className="mb-2">
          <span className="font-sans text-base font-normal leading-6 tracking-normal text-gray-11">
            LMS{' '}
          </span>
          <span className="font-fira text-sm font-normal leading-[21px] tracking-normal text-bw-11">
            | {title}
          </span>
        </p>
        <p className="font-sans text-2xl font-medium leading-9 tracking-normal text-bw-11">
          {title}
        </p>
      </div>
    </div>
  )
}

export default memo(Heading)
