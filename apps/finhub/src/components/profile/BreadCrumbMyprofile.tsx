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
      <ul className="breadcrumb mb-4 flex flex-row text-sm font-medium">
        {tabs.map((tab, index) => (
          <li key={index}>
            {index !== tabs.length - 1 ? (
              <>
                {tab.link ? (
                  <Link href={tab.link}>
                    <a
                      className={
                        currentPage === tab.title
                          ? 'text-sm text-[#050505]'
                          : 'text-sm text-[#A1A1A1]'
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
                      ? 'text-sm text-[#050505] '
                      : 'text-sm text-[#A1A1A1]'
                  } pr-1`}
                >
                  {' / '}
                </span>
              </>
            ) : (
              <Link href={tab.link ?? ''}>
                <a className={'text-sm text-[#050505]'}>{tab.title}</a>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default BreadcrumbProfile
