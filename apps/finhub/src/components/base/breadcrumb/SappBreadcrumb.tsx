import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'
import { ITabs } from 'src/type'
import Tooltip from '@components/common/Tooltip'

const SappBreadcrumb = ({
  breadcrumbs = [],
  isTeacher = true,
}: {
  breadcrumbs?: ITabs[]
  isTeacher?: boolean
}) => {
  const lastIndex = breadcrumbs.length - 1
  const handleTitleDisplay = (title: string, length: number) => {
    const isLong = title?.length > length
    return isLong ? title.slice(0, length) + '...' : title
  }
  return (
    <nav aria-label="breadcrumb" className="hidden lg:block">
      <ul className="flex items-center space-x-2 text-sm font-normal text-[#a1a1aa]">
        {breadcrumbs?.map((breadcrumb, index) => {
          const isLast = index === lastIndex
          const titleDisplay = handleTitleDisplay(
            breadcrumb.title,
            isLast ? 60 : 30,
          )
          const isLong = breadcrumb.title?.length > 30

          return (
            <React.Fragment key={breadcrumb.title}>
              <li
                className={clsx(
                  'text-base',
                  isLast ? 'font-semibold text-gray-800' : 'text-gray-400',
                )}
              >
                {isLast ? (
                  <span>{titleDisplay}</span>
                ) : (
                  <Link href={breadcrumb.link ?? ''}>
                    <div>
                      <Tooltip
                        title={breadcrumb.title}
                        showTooltip={isLong}
                        placement="bottomLeft"
                      >
                        <span
                          className={clsx(
                            'cursor-pointer',
                            isLong && 'hover:text-primary',
                          )}
                        >
                          {titleDisplay}
                        </span>
                      </Tooltip>
                    </div>
                  </Link>
                )}
              </li>

              {!isLast && (
                <li className="flex items-center">
                  <span
                    className={clsx(
                      isTeacher && 'text-v2-tiny',
                      index === lastIndex - 1
                        ? 'text-gray-800'
                        : 'text-gray-400',
                    )}
                  >
                    {isTeacher ? '▶' : '/'}
                  </span>
                </li>
              )}
            </React.Fragment>
          )
        })}
      </ul>
    </nav>
  )
}

export default SappBreadcrumb
