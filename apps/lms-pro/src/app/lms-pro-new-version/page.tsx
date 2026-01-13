'use client'
import LayoutMarketingInApp from '@components/marketing-in-app/LayoutMarketingInApp'
import { useTailwindBreakpoint } from '@lms/hooks'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { listTab } from 'src/constants'

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
