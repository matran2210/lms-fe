'use client'
import PersonalScheduleTab from '@components/request/request-tabs/PersonalScheduleTab'
import TimeOffTab from '@components/request/request-tabs/TimeOffTab'
import ScheduleRequestTable from '@components/teacher/my-request/schedule-request'
import { RequestProvider, UserType } from '@lms/contexts'
import { ITabs } from '@lms/core'
import { LayoutTeacher, SappTabs } from '@lms/ui'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { PageLink } from 'src/constants/routers'
import withAuthorization from 'src/HOC/withAuthorization'

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
  const searchParam = useSearchParams()
  const query = Object.fromEntries(searchParam.entries())

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
