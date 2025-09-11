import LayoutMarketingInApp from '@components/marketing-in-app/LayoutMarketingInApp'
import { useRouter } from 'next/router'
import dashboardIcon from '@assets/images/dashboard_mkt_in_app.svg'
import { useEffect, useState } from 'react'

const listTab = [
  { title: 'Marketing In App', value: 'home', src: dashboardIcon },
  { title: 'Dashboard', value: 'dashboard', src: dashboardIcon },
  { title: 'My Course', value: 'my-course', src: dashboardIcon },
  {
    title: 'Student Calendar',
    value: 'student-calendar',
    src: dashboardIcon,
  },
  {
    title: 'Learning Activity',
    value: 'learning-activity',
    src: dashboardIcon,
  },
  { title: 'Test', value: 'test', src: dashboardIcon },
  { title: 'Dashboard Test', value: 'dashboard-test', src: dashboardIcon },
  { title: 'Exam List', value: 'exam-list', src: dashboardIcon },
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
