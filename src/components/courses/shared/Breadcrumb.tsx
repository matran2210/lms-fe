import React from 'react'
import Link from 'next/link'
import { BreadcrumbProps } from 'src/type/courses-3-level'

export default function Breadcrumb3Level({
  tabs,
  currentPage,
  className,
}: BreadcrumbProps) {
  return (
    <nav className="breadcrumb" aria-label="breadcrumbs">
      <ul
        className={`breadcrumb flex flex-row pb-3 pt-10 text-sm ${className}`}
      >
        {tabs.map((tab, index) => (
          <li
            className="flex items-center gap-2 text-ssm md:text-base"
            key={index}
          >
            {index !== tabs.length - 1 ? (
              <>
                {tab.link && !tab?.disable ? (
                  <Link href={tab.link}>
                    <span
                      className={`line-clamp-1 w-max max-w-[210px] cursor-pointer md:w-fit ${
                        currentPage === tab.title
                          ? 'font-semibold text-bw-15'
                          : 'text-gray-1'
                      }
                      `}
                    >
                      {index === 0 ? (
                        <>
                          <span className="md:hidden">...</span>
                          <span className="hidden md:inline">{tab.title}</span>
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
                        <span className="hidden md:inline">{tab.title}</span>
                      </>
                    ) : (
                      tab.title
                    )}
                  </span>
                )}
                <span className={`pr-2 text-bw-15`}>{' / '}</span>
              </>
            ) : (
              <span
                className={
                  currentPage === tab.title
                    ? 'font-semibold text-bw-15'
                    : 'text-gray-1'
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
