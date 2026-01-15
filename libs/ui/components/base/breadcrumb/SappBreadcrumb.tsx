import React from 'react'
import Link from 'next/link'
import { ITabs } from '@lms/core'

interface BreadcrumbProps {
  tabs: ITabs[]
  currentPage: string
  className?: string
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  tabs,
  currentPage,
  className,
}) => {
  return (
    <nav className="breadcrumb" aria-label="breadcrumbs">
      <ul
        className={`breadcrumb flex flex-row py-6 text-sm font-medium ${className}`}
      >
        {tabs.map((tab, index) => (
          <li className="flex items-center gap-0.5 text-sm" key={index}>
            {index !== tabs.length - 1 ? (
              <>
                {tab.link && !tab?.disable ? (
                  <Link href={tab.link}>
                    <a
                      className={`line-clamp-1 w-fit max-w-[210px] ${
                        currentPage === tab.title
                          ? 'text-gray-800'
                          : 'text-gray-400'
                      } `}
                    >
                      {tab.title}
                    </a>
                  </Link>
                ) : (
                  <span className="">{tab.title}</span>
                )}
                <span
                  className={`${
                    currentPage === tab.title
                      ? 'text-gray-800'
                      : 'text-gray-400'
                  } pr-1`}
                >
                  {' / '}
                </span>
              </>
            ) : (
              <span
                className={
                  currentPage === tab.title
                    ? 'text-gray-800'
                    : 'text-gray-400'
                }
              >
                {tab.title}
              </span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Breadcrumb
