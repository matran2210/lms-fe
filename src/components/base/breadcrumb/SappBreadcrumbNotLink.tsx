import React from 'react'

type IProps = {
  id: string
  name: string
  type: string
}

const SappBreadcrumbNotLink = ({ paths }: { paths: IProps[] }) => {
  return (
    <>
      {paths.map((path, index) => (
        <span key={path?.id}>
          <span className="font-normal text-sm text-gray-1 w-max max-w-[190px] inline-block whitespace-nowrap overflow-hidden text-ellipsis">
            {path?.name}
          </span>
          {index < paths.length - 1 && (
            <span className="font-normal text-sm text-gray-1 inline-block overflow-hidden px-1">
              {' '}
              /{' '}
            </span>
          )}
        </span>
      ))}
    </>
  )
}

export default SappBreadcrumbNotLink
