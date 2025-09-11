import LayoutMarketingInApp from '@components/marketing-in-app/LayoutMarketingInApp'
import { useRouter } from 'next/router'
import dashboardMktInApp from '@assets/images/dashboard_mkt_in_app.svg'
import { useEffect, useState } from 'react'

const listTab = [
  { title: 'Marketing In App', value: 'home', src: dashboardMktInApp },
  { title: 'Dashboard', value: 'dashboard', src: dashboardMktInApp },
  { title: 'My Course', value: 'my-course', src: dashboardMktInApp },
  {
    title: 'Student Calendar',
    value: 'student-calendar',
    src: dashboardMktInApp,
  },
  {
    title: 'Learning Activity',
    value: 'learning-activity',
    src: dashboardMktInApp,
  },
  { title: 'Test', value: 'test', src: dashboardMktInApp },
  { title: 'Dashboard Test', value: 'dashboard-test', src: dashboardMktInApp },
  { title: 'Exam List', value: 'exam-list', src: dashboardMktInApp },
]

const MarketingInApp = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(listTab[0])
  const { tab } = router.query
  useEffect(() => {
    setActiveTab(listTab.find((item) => item.value === tab) || listTab[0])
  }, [tab])

  return (
    <LayoutMarketingInApp
      title={activeTab.title}
      dashboardTab={activeTab.src}
    />
  )
}
export default MarketingInApp
