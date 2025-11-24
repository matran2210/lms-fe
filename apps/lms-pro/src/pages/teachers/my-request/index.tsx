import PersonalScheduleTab from '@components/request/request-tabs/PersonalScheduleTab'
import TimeOffTab from '@components/request/request-tabs/TimeOffTab'
import ScheduleRequestTable from '@components/teacher/my-request/schedule-request'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import withAuthorization from 'src/HOC/withAuthorization'
import { RequestProvider, UserType } from '@lms/contexts'
import { ITabs } from '@lms/core'
import { PageLink } from 'src/constants/routers'
import { LayoutTeacher, SappTabs } from '@lms/ui'
import { CoursesAPI } from '@pages/api/courses'
import { AuthenticationManager } from '@utils/helpers/keycloak'

const breadcrumbs: ITabs[] = [
  {
    link: PageLink.TEACHERS,
    title: 'LMS',
  },
  {
    link: PageLink.TEACHER_MY_REQUEST,
    title: 'My Class',
  },
]
const tabs = [
  {
    id: 1,
    title: 'Personal Schedule Request',
    urlTitle: 'personalschedule',
  },
  {
    id: 2,
    title: 'Timeoff Request',
    urlTitle: 'timeoff',
  },
  {
    id: 3,
    title: 'Schedule Request',
    urlTitle: 'schedulerequest',
  },
]
const MyRequestPage = () => {
  const router = useRouter()
  const { query } = router

  const selectedTab = query.tab
    ? (tabs.find((item) => item.urlTitle == query.tab)?.id ?? tabs[0].id)
    : tabs[0].id

  const [selected, setSelected] = useState<number>(selectedTab)

  const renderClassDetail = (selected: number) => {
    switch (selected) {
      case 1:
        return <PersonalScheduleTab />
      case 2:
        return <TimeOffTab />
      case 3:
        return <ScheduleRequestTable />
      default:
        return null
    }
  }
  return (
    <RequestProvider>
      <LayoutTeacher
        title="My Request"
        breadcrumbs={breadcrumbs}
        className="bg-[#F2F4F7] p-0"
        courseApi={CoursesAPI} authManager={new AuthenticationManager} pageLink={PageLink}
      >
        <div className="h-fit w-full rounded-xl bg-white px-8 py-5">
          <SappTabs
            tabs={tabs}
            setSelected={setSelected}
            selected={selected}
            bordered
          />
          <div className="w-full rounded-xl bg-white">
            {renderClassDetail(selected)}
          </div>
        </div>
      </LayoutTeacher>
    </RequestProvider>
  )
}

export default withAuthorization([UserType.TEACHER])(MyRequestPage)
