import React from 'react'
import Link from 'next/link'
import { Tooltip } from 'antd'
import { truncateString } from '@utils/index'

const BreadcrumbFilter = ({ name }: { name: string }) => {
  return (
    <nav
      className="breadcrumbs max-w-[70%]"
      role="navigation"
      aria-label="breadcrumbs"
    >
      <ol className="breadcrumbs__list flex text-medium-sm font-medium">
        <li className="breadcrumbs__item text-gray-1 shrink-0">
          <Link href="/courses" className="breadcrumbs__link" scroll={false}>
            My Course
          </Link>
        </li>
        <li className="breadcrumbs__item current-course text-bw-1 ml-1 line-clamp-1">
          {(name as string)?.length > 80 ? (
            <Tooltip title={name} color="#ffffff" placement="bottom">
              <span>/ {truncateString(name, 80)}</span>
            </Tooltip>
          ) : (
            <span>/ {name}</span>
          )}
        </li>
      </ol>
    </nav>
  )
}

export default BreadcrumbFilter
