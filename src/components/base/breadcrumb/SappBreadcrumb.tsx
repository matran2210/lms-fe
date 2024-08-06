import React from 'react'
import Link from 'next/link'
import { ITabs } from 'src/type'

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
          <li className="flex items-center gap-0.5 text-medium-sm" key={index}>
            {index !== tabs.length - 1 ? (
              <>
                {tab.link && !tab?.disable ? (
                  <Link href={tab.link}>
                    <a
                      className={`line-clamp-1 w-fit max-w-[210px] ${
                        currentPage === tab.title ? 'text-bw-1' : 'text-gray-1'
                      }
                      `}
                    >
                      {tab.title}
                    </a>
                  </Link>
                ) : (
                  <span className="">{tab.title}</span>
                )}
                <span
                  className={`${
                    currentPage === tab.title ? 'text-bw-1' : 'text-gray-1'
                  } pr-1`}
                >
                  {' / '}
                </span>
              </>
            ) : (
              <span
                className={
                  currentPage === tab.title ? 'text-bw-1' : 'text-gray-1'
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
