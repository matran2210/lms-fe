import LayoutMarketingInApp from '@components/marketing-in-app/LayoutMarketingInApp'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'

export const linkCdnMktInApp = 'https://cdn.sapp.edu.vn/images/fe'

const listTab = [
  {
    title: 'Marketing In App',
    value: 'home',
    src: `${linkCdnMktInApp}/bg_home_mkt-min.png`,
    height: 6170,
  },
  {
    title: 'Dashboard',
    value: 'dashboard',
    src: `${linkCdnMktInApp}/bg_dashboard_mkt-min.png`,
    height: 6170,
  },
  {
    title: 'My Course',
    value: 'my-course',
    src: `${linkCdnMktInApp}/bg_my_course_mkt-min.png`,
    height: 6778,
  },
  {
    title: 'Student Calendar',
    value: 'student-calendar',
    src: `${linkCdnMktInApp}/bg_calendar_mkt-min.png`,
    height: 5225,
  },
  {
    title: 'Learning Activity',
    value: 'learning-activity',
    src: `${linkCdnMktInApp}/bg_learning_activity_mkt-min.png`,
    height: 6156,
  },
  {
    title: 'Test',
    value: 'test',
    src: `${linkCdnMktInApp}/bg_test_mkt-min.png`,
    height: 11019,
  },
  {
    title: 'Dashboard Test',
    value: 'dashboard-test',
    src: `${linkCdnMktInApp}/bg_test_result_mkt-min.png`,
    height: 5837,
  },
  {
    title: 'Exam List',
    value: 'exam-list',
    src: `${linkCdnMktInApp}/bg_exam_list_mkt-min.png`,
    height: 4707,
  },
]

const MarketingInApp = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(listTab[0])
  const { tab } = router.query
  const { isMobileView } = useTailwindBreakpoint()

  useEffect(() => {
    setActiveTab(listTab.find((item) => item.value === tab) || listTab[0])
  }, [tab])

  if (isMobileView) return null
  return (
    <div className="overflow-x-hidden">
      <LayoutMarketingInApp title={activeTab.title} dashboardTab={activeTab} />
    </div>
  )
}
export default MarketingInApp
