import clsx from 'clsx'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { ITabs } from 'src/type'
import Tooltip from 'src/common/Tooltip'

const SappBreadCrumbs = ({
  breadcrumbs = [],
  isTeacher = true,
  className,
  isActive = true,
}: {
  breadcrumbs?: ITabs[]
  isTeacher?: boolean
  className?: string
  isActive?: boolean
}) => {
  const [isLastTakesFullWidth, setIsLastTakesFullWidth] = useState(false)
  const lastIndex = breadcrumbs.length - 1
  const handleTitleDisplay = (title: string, length: number) => {
    const isLong = title?.length > length
    return isLong ? title.slice(0, length) + '...' : title
  }

  const checkIsLastTakesFullWidth = () => {
    const element = document.querySelector('.breadcrumb-last') as HTMLElement
    if (!element) return false
    const computedStyle = window.getComputedStyle(element)
    const lineHeight = parseFloat(computedStyle.lineHeight)
    const elementHeight = element.offsetHeight
    const numberOfLines = Math.round(elementHeight / lineHeight)
    return numberOfLines >= 2
  }
  useEffect(() => {
    setIsLastTakesFullWidth(checkIsLastTakesFullWidth())
  }, [])
  return (
    <nav aria-label="breadcrumb" className={clsx('hidden lg:block', className)}>
      <ul className="flex items-center space-x-2 text-sm font-normal text-[#a1a1aa]">
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === lastIndex
          const titleDisplay = handleTitleDisplay(
            breadcrumb.title,
            isLast ? 20 : 30,
          )
          const isLong = breadcrumb.title?.length > 30

          return (
            <React.Fragment key={breadcrumb.title}>
              <li
                className={clsx(
                  'text-base',
                  isLast ? 'font-medium text-gray-400' : 'text-gray-800',
                )}
              >
                {isLast ? (
                  isLastTakesFullWidth ? (
                    <Tooltip
                      title={breadcrumb.title}
                      showTooltip={isLong}
                      placement="bottomLeft"
                    >
                      <span className="breadcrumb-last cursor-pointer">
                        {titleDisplay}
                      </span>
                    </Tooltip>
                  ) : (
                    <span className="breadcrumb-last">{breadcrumb.title}</span>
                  )
                ) : (
                  <Link href={breadcrumb.link}>
                    <div>
                      <Tooltip
                        title={breadcrumb.title}
                        showTooltip={isLong}
                        placement="bottomLeft"
                      >
                        <span
                          className={clsx(
                            'transition-all duration-300',
                            !breadcrumb?.disable &&
                              'cursor-pointer hover:text-primary',
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
                      'text-[1.125rem]',
                      // isTeacher && 'text-tiny',
                      index === lastIndex - 1
                        ? 'text-gray-800'
                        : 'text-gray-400',
                    )}
                  >
                    {/* {isTeacher ? '▶' : '/'} */}/
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

export default SappBreadCrumbs
