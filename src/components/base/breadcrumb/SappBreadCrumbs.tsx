import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'
import { ITabs } from 'src/type'

const SappBreadCrumbs = ({
  breadcrumbs = [],
  isTeacher = true,
}: {
  breadcrumbs?: ITabs[]
  isTeacher?: boolean
}) => {
  const lastIndex = breadcrumbs.length - 1

  return (
    <nav aria-label="breadcrumb">
      <ul className="flex items-center justify-start space-x-2 text-medium-sm font-normal text-gray-400">
        {breadcrumbs.map((breadcrumb, index) => (
          <React.Fragment key={breadcrumb.title}>
            <li
              className={`${index === lastIndex ? 'justify-start text-medium-sm font-medium text-gray-800' : ''}`}
            >
              {index !== lastIndex ? (
                <Link href={breadcrumb.link} className="truncate-breadcrumbs">
                  {breadcrumb.title}
                </Link>
              ) : (
                <span>{breadcrumb.title}</span>
              )}
            </li>
            {index !== lastIndex && (
              <li className="flex items-center">
                <span
                  className={clsx({
                    'text-[8px] text-gray-400': isTeacher,
                    'text-gray-800': !isTeacher,
                  })}
                >
                  {isTeacher ? '▶' : '/'}
                </span>
              </li>
            )}
          </React.Fragment>
        ))}
      </ul>
    </nav>
  )
}

export default SappBreadCrumbs
