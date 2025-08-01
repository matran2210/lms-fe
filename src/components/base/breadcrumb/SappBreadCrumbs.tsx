import Link from 'next/link'
import React from 'react'
import { ITabs } from 'src/type'

const SappBreadCrumbs = ({ breadcrumbs = [] }: { breadcrumbs?: ITabs[] }) => {
  const lastIndex = breadcrumbs?.length - 1 || 0

  return (
    <nav aria-label="breadcrumb">
      <ul className="flex items-center justify-start space-x-2 text-medium-sm font-normal text-gray-400">
        {breadcrumbs?.map((breadcrumb, index) => (
          <React.Fragment key={index}>
            <li
              className={`${index === lastIndex ? 'justify-start text-medium-sm font-medium text-gray-800' : ''}`}
            >
              {index !== lastIndex ? (
                <Link href={breadcrumb?.link}>{breadcrumb?.title || ''}</Link>
              ) : (
                <span>{breadcrumb?.title}</span>
              )}
            </li>
            {index !== lastIndex && (
              <li className="flex items-center">
                <span className="text-[8px] text-gray-400">▶</span>
              </li>
            )}
          </React.Fragment>
        ))}
      </ul>
    </nav>
  )
}

export default SappBreadCrumbs
