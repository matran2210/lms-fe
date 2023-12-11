import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface Tab {
  label: string
  path: string
  total?: number
}

interface TabsProps {
  tabs: Tab[]
  classUl?: string
  currentClass?: string
  tabClass?: string
  liClass?: string
  tabCurrentClass?: string
  tabNotCurrentClass?: string
}

const NotifyTab: React.FC<TabsProps> = ({
  tabs,
  classUl = 'tab-buttons d-flex flex gap-10',
  currentClass = 'activecolor text-bw-1 absolute w-full h-px bg-primary bottom-0 left-0',
  tabClass = 'item text-base relative py-4.5 block',
  liClass,
  tabCurrentClass = 'text-bw-1',
  tabNotCurrentClass = 'text-gray-1',
}) => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<number>(0)

  const handleTabClick = (index: number) => {
    setActiveTab(index)
  }

  return (
    <ul className={classUl}>
      {tabs.map((tab, index) => (
        <Link href={`/notifications?${tab.path}`} key={index}>
          <li className={`cursor-pointer ${liClass}`}>
            <a
              onClick={() => handleTabClick(index)}
              className={`${tabClass} ${
                router.asPath.includes(tab.path) ||
                (activeTab == 0 && tab.label == 'All')
                  ? `${tabCurrentClass}`
                  : `${tabNotCurrentClass}`
              }`}
            >
              {tab.label}
              {tab.total && <span className="ml-1">({tab.total})</span>}
              {router.asPath.includes(tab.path) ||
              (activeTab == 0 && tab.label == 'All') ? (
                <span className={currentClass}></span>
              ) : (
                <></>
              )}
            </a>
          </li>
        </Link>
      ))}
    </ul>
  )
}

export default NotifyTab
