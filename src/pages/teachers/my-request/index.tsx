import LayoutTeacher from '@components/layout/Teacher'
import SappTabs from '@components/tabs/SappTabs'
import ScheduleRequestTable from '@components/teacher/my-request/schedule-request'
import React, { useState } from 'react'
import { ANIMATION, PageLink } from 'src/constants'
import { ITabs } from 'src/type'

const breadcrumbs: ITabs[] = [
  {
    link: `${PageLink.TEACHERS}`,
    title: 'LMS',
  },
  {
    link: `${PageLink.TEACHER_MY_REQUEST}`,
    title: 'My Class',
  },
]
const tabs = [
  {
    id: 1,
    title: 'Personal Schedule Request',
  },
  {
    id: 2,
    title: 'Timeoff Request',
  },
  {
    id: 3,
    title: 'Schedule Request',
  },
]
const MyRequestPage = () => {
  const [selected, setSelected] = useState<number>(tabs[0].id)

  const renderClassDetail = (selected: number) => {
    switch (selected) {
      case 1:
        return null
      case 2:
        return null
      case 3:
        return <ScheduleRequestTable />
      default:
        return null
    }
  }
  return (
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
  )
}

export default MyRequestPage
