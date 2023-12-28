import React from 'react'
import Link from 'next/link'
import { ITabs } from 'src/type'

interface BreadcrumbProps {
  tabs: ITabs[]
  currentPage: string
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ tabs, currentPage }) => {
  return (
    <nav className="breadcrumb" aria-label="breadcrumbs">
      <ul className="breadcrumb flex flex-row py-6 font-semibold">
        {tabs.map((tab, index) => (
          <li key={index}>
            {index !== tabs.length - 1 ? (
              <>
                {tab.link ? (
                  <Link href={tab.link}>
                    <a
                      className={
                        currentPage === tab.title
                          ? 'text-bw-1 font-bold'
                          : 'text-gray-1'
                      }
                    >
                      {tab.title}
                    </a>
                  </Link>
                ) : (
                  <span>{tab.title}</span>
                )}
                <span
                  className={`${
                    currentPage === tab.title
                      ? 'text-bw-1 font-bold'
                      : 'text-gray-1'
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
