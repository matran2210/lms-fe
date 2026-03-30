'use client'
import { RequestProvider, useFeature, UserType } from '@lms/contexts'
import { ITabs } from '@lms/core'
import { withAuthorization } from '@lms/hoc'
import { LayoutTeacher, SappTabs } from '@lms/ui'
import { useState } from 'react'
import ScheduleRequestTable from '../../../components/teacher/my-request/schedule-request/ScheduleRequestTable'
import PersonalScheduleTab from '../../../components/teacher/request/request-tabs/PersonalScheduleTab'
import TimeOffTab from '../../../components/teacher/request/request-tabs/TimeOffTab'


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
  const { pageLink, query } = useFeature()
  const breadcrumbs: ITabs[] = [
    {
      link: pageLink.TEACHERS,
      title: 'LMS',
    },
    {
      link: pageLink.TEACHER_MY_REQUEST,
      title: 'My Class',
    },
  ]
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
