import React from 'react'

const SappBreadcrumbNotLink = ({ paths }: { paths: string[] }) => {
  return (
    <>
      {paths.map((path, index) => (
        <span key={path}>
          <span className="font-normal text-sm text-gray-1">{path}</span>
          {index < paths.length - 1 && (
            <span className="font-normal text-sm text-gray-1"> / </span>
          )}
        </span>
      ))}
    </>
  )
}

export default SappBreadcrumbNotLink
