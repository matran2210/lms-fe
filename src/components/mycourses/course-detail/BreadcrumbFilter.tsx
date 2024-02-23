// components/SearchForm.tsx

import React from 'react'
import Link from 'next/link'

const BreadcrumbFilter = ({ name }: { name: string }) => {
  return (
    <nav className="breadcrumbs" role="navigation" aria-label="breadcrumbs">
      <ol className="breadcrumbs__list flex flex-wrap text-medium-sm font-medium">
        <li className="breadcrumbs__item text-gray-1">
          <Link href="/courses" className="breadcrumbs__link" scroll={false}>
            My Course
          </Link>
        </li>
        <li
          className="breadcrumbs__item current-course text-bw-1 ml-1"
          title={name}
        >
          <span>/ {name}</span>
        </li>
      </ol>
    </nav>
  )
}

export default BreadcrumbFilter
