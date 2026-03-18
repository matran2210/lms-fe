import React from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { BreadcrumbProps } from '@lms/core'

export default function Breadcrumb3Level({
  tabs,
  currentPage,
  className,
}: BreadcrumbProps) {
  return (
    <nav className="breadcrumb" aria-label="breadcrumbs">
      <ul className={`breadcrumb flex flex-row pt-4 text-sm ${className}`}>
        {tabs?.map((tab, index) => (
          <li
            className="flex items-center gap-2 text-xs md:text-base"
            key={index}
          >
            {index !== tabs.length - 1 ? (
              <>
                {tab.link && !tab?.disable ? (
                  <Link href={tab.link}>
                    <span
                      className={`line-clamp-1 w-max max-w-[210px] cursor-pointer select-none leading-6 md:w-fit ${
                        currentPage === tab.title
                          ? 'font-medium text-gray-400'
                          : 'text-gray-800 duration-300 hover:text-primary'
                      }`}
                    >
                      {index === 0 ? (
                        <>
                          <span className="md:hidden">...</span>
                          <span className="hidden leading-6 md:inline">
                            {tab.title}
                          </span>
                        </>
                      ) : (
                        tab.title
                      )}
                    </span>
                  </Link>
                ) : (
                  <span>
                    {index === 0 ? (
                      <>
                        <span className="md:hidden">...</span>
                        <span className="hidden select-none md:inline">
                          {tab.title}
                        </span>
                      </>
                    ) : (
                      tab.title
                    )}
                  </span>
                )}
                <span className={`pr-2 text-gray-800`}>{' / '}</span>
              </>
            ) : (
              <span
                className={clsx(
                  'select-none leading-6',
                  currentPage === tab.title
                    ? 'font-medium text-gray-400'
                    : 'text-gray-800',
                )}
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
