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
      <ul className="breadcrumb flex flex-row ml-[64px] pl-[20px] mt-6 font-semibold">
        {tabs.map((tab, index) => (
          <li key={index}>
            {index !== tabs.length - 1 ? (
              <>
                {tab.link ? (
                  <Link href={tab.link}>
                    <a
                      className={
                        currentPage === tab.title
                          ? 'text-[#141414] font-bold'
                          : 'text-[#A1A1A1]'
                      }
                    >
                      {tab.title}
                    </a>
                  </Link>
                ) : (
                  <span>{tab.title}</span>
                )}
                <span className="text-[#A1A1A1]"> {' / '} </span>
              </>
            ) : (
              <span
                className={
                  currentPage === tab.title
                    ? 'text-[#141414]'
                    : 'text-[#A1A1A1]'
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
