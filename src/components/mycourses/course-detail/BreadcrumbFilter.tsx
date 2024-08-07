import React from 'react'
import Link from 'next/link'
import { Tooltip } from 'antd'
import { truncateString } from '@utils/index'
import clsx from 'clsx'
import { trackGAEvent } from '@utils/google-analytics'

const BreadcrumbFilter = ({
  name,
  subpath,
  courseId,
}: {
  name: string
  subpath?: string
  courseId?: string | string[]
}) => {
  return (
    <nav
      className="breadcrumbs max-w-[70%]"
      role="navigation"
      aria-label="breadcrumbs"
    >
      <ol className="breadcrumbs__list flex text-medium-sm font-medium">
        <li className="breadcrumbs__item text-gray-1 shrink-0 hover:underline">
          <Link
            href="/courses"
            className="breadcrumbs__link"
            scroll={false}
            onClick={() => trackGAEvent('Breadcrumb My Course')}
          >
            My Course
          </Link>
        </li>
        <li
          className={clsx(
            'breadcrumbs__item current-course ml-1 line-clamp-1',
            subpath ? 'text-gray-1' : 'text-bw-1',
          )}
        >
          {(name as string)?.length > 80 ? (
            <Tooltip title={name} color="#ffffff" placement="bottom">
              <span>/ {truncateString(name, 80)}</span>
            </Tooltip>
          ) : (
            <>
              /&nbsp;
              <span className="hover:underline">
                <Link
                  href={`/courses/my-course/${courseId}`}
                  className="breadcrumbs__link"
                  scroll={false}
                >
                  {`${name}`}
                </Link>
              </span>
            </>
          )}
        </li>
        {subpath && (
          <li className="breadcrumbs__item current-course text-bw-1 ml-1 line-clamp-1">
            / {subpath}
          </li>
        )}
      </ol>
    </nav>
  )
}

export default BreadcrumbFilter
