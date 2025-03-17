import React from 'react'
import Link from 'next/link'
import { ITabs } from 'src/type'

const SappBreadCrumbs = ({ breadcrumbs = [] }: { breadcrumbs?: ITabs[] }) => {
  const lastIndex = breadcrumbs.length - 1

  return (
    <nav aria-label="breadcrumb">
      <ul className="flex items-center space-x-2 text-sm text-gray-600">
        {breadcrumbs.map((breadcrumb, index) => (
          <React.Fragment key={breadcrumb.title}>
            <li
              className={`${index === lastIndex ? 'font-semibold text-black' : ''}`}
            >
              {index !== lastIndex ? (
                <Link href={breadcrumb.link} className="hover:text-blue-600">
                  {breadcrumb.title}
                </Link>
              ) : (
                <span>{breadcrumb.title}</span>
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
