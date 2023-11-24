import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface Tab {
  label: string
  path: string
  total: number
  current: boolean
}

interface TabsProps {
  tabs: Tab[]
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<number>(
    tabs.findIndex((tab) => tab.path === router.pathname),
  )

  const handleTabClick = (index: number) => {
    setActiveTab(index)
  }

  return (
    <ul className="tab-buttons d-flex flex border-r border-gray-1 items-center py-[4.5px]">
      {tabs.map((tab, index) => (
        <Link href={`/courses/my-course#${tab.path}`} key={index}>
          <li className="mr-12 min-w-[80px]">
            <a
              onClick={() => handleTabClick(index)}
              className={`item relative uppercase text-base w-full flex justify-center cursor-pointer ${
                tab.current
                  ? 'active text-primary font-semibold capitalize'
                  : 'text-gray-1'
              }`}
              aria-current={tab.current ? 'page' : undefined}
            >
              {tab.label}
              <span className="ml-1">({tab.total})</span>
              {tab.current && (
                <span className="activecolor w-full left-0 absolute bottom-0 h-2.5 bg-primary opacity-[0.15]"></span>
              )}
            </a>
          </li>
        </Link>
      ))}
    </ul>
  )
}

export default Tabs
