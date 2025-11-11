import LayoutMarketingInApp from '@components/marketing-in-app/LayoutMarketingInApp'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { TitleSidebar, ValueSidebar } from 'src/constants'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'

export const linkCdnMktInApp = 'https://cdn.sapp.edu.vn/images/fe'

export const listTab = [
  {
    title: TitleSidebar.HOME,
    value: ValueSidebar.HOME,
    src: `${linkCdnMktInApp}/bg_home_mkt-min.png`,
    height: 6170,
  },
  {
    title: TitleSidebar.DASHBOARD,
    value: ValueSidebar.DASHBOARD,
    src: `${linkCdnMktInApp}/bg_dashboard_mkt-min.png`,
    height: 6170,
  },
  {
    title: TitleSidebar.COURSES,
    value: ValueSidebar.COURSES,
    src: `${linkCdnMktInApp}/bg_my_course_mkt-min.png`,
    height: 6778,
  },
  {
    title: TitleSidebar.STUDENT_CALENDAR,
    value: ValueSidebar.STUDENT_CALENDAR,
    src: `${linkCdnMktInApp}/bg_calendar_mkt-min.png`,
    height: 5225,
  },
  {
    title: TitleSidebar.STUDENT_PROFILE,
    value: ValueSidebar.STUDENT_PROFILE,
    src: `${linkCdnMktInApp}/bg_student_profile_mkt-min.png`,
    height: 5225,
  },
  {
    title: TitleSidebar.LEARNING_ACTIVITY,
    value: ValueSidebar.LEARNING_ACTIVITY,
    src: `${linkCdnMktInApp}/bg_learning_activity_mkt-min.png`,
    height: 6156,
  },
  {
    title: TitleSidebar.TEST,
    value: ValueSidebar.TEST,
    src: `${linkCdnMktInApp}/bg_test_mkt-min.png`,
    height: 11019,
  },
  {
    title: TitleSidebar.DASHBOARD_TEST,
    value: ValueSidebar.DASHBOARD_TEST,
    src: `${linkCdnMktInApp}/bg_test_result_mkt-min.png`,
    height: 5837,
  },
  {
    title: TitleSidebar.EXAM_LIST,
    value: ValueSidebar.EXAM_LIST,
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
    <div className="pointer-events-none overflow-x-hidden">
      <LayoutMarketingInApp title={activeTab.title} dashboardTab={activeTab} />
    </div>
  )
}
export default MarketingInApp
