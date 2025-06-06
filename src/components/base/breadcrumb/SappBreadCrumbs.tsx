import Link from 'next/link'
import React from 'react'
import { ITabs } from 'src/type'

const SappBreadCrumbs = ({ breadcrumbs = [] }: { breadcrumbs?: ITabs[] }) => {
  const lastIndex = breadcrumbs.length - 1

  return (
    <nav aria-label="breadcrumb">
      <ul className="flex items-center justify-start space-x-2 text-sm font-normal text-[#a1a1aa]">
        {breadcrumbs.map((breadcrumb, index) => (
          <React.Fragment key={breadcrumb.title}>
            <li
              className={`${index === lastIndex ? 'justify-start text-sm font-medium text-[#27272a]' : ''}`}
            >
              {index !== lastIndex ? (
                <Link href={breadcrumb.link}>{breadcrumb.title}</Link>
              ) : (
                <span>{breadcrumb.title}</span>
              )}
            </li>
            {index !== lastIndex && (
              <li className="flex items-center">
                <span className="text-[8px] text-[#a1a1aa]">▶</span>
              </li>
            )}
          </React.Fragment>
        ))}
      </ul>
    </nav>
  )
}

export default SappBreadCrumbs
