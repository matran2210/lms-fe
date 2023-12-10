import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface Tab {
  label: string
  path: string
  total?: number
  current: boolean
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
  classUl,
  currentClass,
  tabClass,
  liClass,
  tabCurrentClass,
  tabNotCurrentClass,
}) => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<number>(
    tabs.findIndex((tab) => tab.path === router.pathname),
  )

  const handleTabClick = (index: number) => {
    setActiveTab(index)
  }

  return (
    <ul className={classUl}>
      {tabs.map((tab, index) => (
        <Link href={`/notifications#${tab.path}`} key={index}>
          <li className={`cursor-pointer ${liClass}`}>
            <a
              onClick={() => handleTabClick(index)}
              className={`${tabClass} ${
                tab.current ? `${tabCurrentClass}` : `${tabNotCurrentClass}`
              }`}
              aria-current={tab.current ? 'page' : undefined}
            >
              {tab.label}
              {tab.total && <span className="ml-1">({tab.total})</span>}
              {tab.current && <span className={currentClass}></span>}
            </a>
          </li>
        </Link>
      ))}
    </ul>
  )
}

export default NotifyTab
