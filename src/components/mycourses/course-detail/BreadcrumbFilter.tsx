// components/SearchForm.tsx

import React, { useState } from 'react'
import HookFormSelect from '@components/base/select/HookFormSelect'
import Link from 'next/link'

const BreadcrumbFilter: React.FC = () => {
  return (
    <nav className="breadcrumbs" role="navigation" aria-label="breadcrumbs">
      <ol className="breadcrumbs__list flex flex-wrap text-medium-sm font-semibold">
        <li className="breadcrumbs__item text-gray-1">
          <Link href="#" className="breadcrumbs__link" scroll={false}>
            My Course
          </Link>
        </li>
        <li className="breadcrumbs__item current-course text-bw-1 ml-1">
          <span>
            / Audit & Assurance (AA) - Kiểm toán và dịch vụ đảm bảo (F8)
          </span>
        </li>
      </ol>
    </nav>
  )
}

export default BreadcrumbFilter
