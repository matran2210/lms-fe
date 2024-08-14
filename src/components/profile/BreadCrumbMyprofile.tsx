import React from 'react'
import Link from 'next/link'
import { ITabs } from 'src/type'

interface BreadcrumbProps {
  tabs: ITabs[]
  currentPage: string
}

const BreadcrumbProfile: React.FC<BreadcrumbProps> = ({
  tabs,
  currentPage,
}) => {
  return (
    <nav className="breadcrumb" aria-label="breadcrumbs">
      <ul className="breadcrumb flex flex-row py-6 text-sm font-medium">
        {tabs.map((tab, index) => (
          <li key={index}>
            {index !== tabs.length - 1 ? (
              <>
                {tab.link ? (
                  <Link href={tab.link}>
                    <a
                      className={
                        currentPage === tab.title
                          ? 'text-sm text-bw-1'
                          : 'text-sm text-gray-1'
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
                    currentPage === tab.link
                      ? 'text-sm text-bw-1 '
                      : 'text-sm text-gray-1'
                  } pr-1`}
                >
                  {' / '}
                </span>
              </>
            ) : (
              <Link href={tab.link}>
                <a className={'text-sm text-bw-1'}>{tab.title}</a>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default BreadcrumbProfile
