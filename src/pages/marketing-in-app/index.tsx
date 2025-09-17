import LayoutMarketingInApp from '@components/marketing-in-app/LayoutMarketingInApp'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const dashboardMktInApp =
  'https://cdn.sapp.edu.vn/icons/bg_dashboard_mkt_small.png'

const listTab = [
  {
    title: 'Marketing In App',
    value: 'home',
    src: dashboardMktInApp,
    height: 6170,
  },
  {
    title: 'Dashboard',
    value: 'dashboard',
    src: dashboardMktInApp,
    height: 4170,
  },
  {
    title: 'My Course',
    value: 'my-course',
    src: dashboardMktInApp,
    height: 6170,
  },
  {
    title: 'Student Calendar',
    value: 'student-calendar',
    src: dashboardMktInApp,
    height: 6170,
  },
  {
    title: 'Learning Activity',
    value: 'learning-activity',
    src: dashboardMktInApp,
    height: 6170,
  },
  { title: 'Test', value: 'test', src: dashboardMktInApp, height: 6170 },
  {
    title: 'Dashboard Test',
    value: 'dashboard-test',
    src: dashboardMktInApp,
    height: 6170,
  },
  {
    title: 'Exam List',
    value: 'exam-list',
    src: dashboardMktInApp,
    height: 6170,
  },
]

const MarketingInApp = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(listTab[0])
  const { tab } = router.query
  useEffect(() => {
    setActiveTab(listTab.find((item) => item.value === tab) || listTab[0])
  }, [tab])

  return (
    <div className="overflow-x-hidden">
      <LayoutMarketingInApp title={activeTab.title} dashboardTab={activeTab} />
    </div>
  )
}
export default MarketingInApp
