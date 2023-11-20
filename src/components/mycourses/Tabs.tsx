import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface Tab {
  label: string
  path: string
  total: number
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
    <ul className="tab-buttons d-flex flex border-r border-gray-1 items-center py-2">
      {tabs.map((tab, index) => (
        <Link href={`/courses/my-course#${tab.path}`} key={index}>
          <li className="mr-12">
            <a
              onClick={() => handleTabClick(index)}
              className={
                index === activeTab
                  ? 'active text-primary font-semibold uppercase'
                  : 'cursor-pointer text-gray-1 text-base uppercase'
              }
            >
              {tab.label}
              <span className="ml-1">({tab.total})</span>
            </a>
          </li>
        </Link>
      ))}
    </ul>
  )
}

export default Tabs
