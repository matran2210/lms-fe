'use client'
import { listTab } from '@lms/core'
import { useTailwindBreakpoint } from '@lms/hooks'
import { LayoutMarketingInApp } from '@lms/ui'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const MarketingInApp = () => {
  const searchParam = useSearchParams()
  const query = Object.fromEntries(searchParam.entries())
  const [activeTab, setActiveTab] = useState(listTab[0])
  const { tab } = query
  const { isMobileView } = useTailwindBreakpoint()

  useEffect(() => {
    setActiveTab(listTab.find((item) => item.value === tab) || listTab[0])
  }, [tab])

  if (isMobileView) return null

  return (
    <div className="pointer-events-none overflow-x-hidden">
      <LayoutMarketingInApp title={activeTab.title} dashboardTab={activeTab} />
    </div>
  )
}
export default MarketingInApp
