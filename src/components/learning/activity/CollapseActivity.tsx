import { CollapseArrowIcon } from '@assets/icons'
import { Collapse } from 'antd'
import React from 'react'
import TableListQuizInActivity from './TableListQuizInActivity'
import SappBreadcrumbNotLink from '@components/base/breadcrumb/SappBreadcrumbNotLink'

interface IProps {
  activity: any
  activityName: string
  courseSectionPath: string
}
const CollapseActivity = ({
  activity,
  activityName,
  courseSectionPath,
}: IProps) => {
  const getItemsActivity = [
    {
      key: 'activity',
      label: (
        <div className="text-lg font-semibold leading-[27px] text-gray-800">
          {activityName}
        </div>
      ),
      children: (
        <>
          <div className="mb-6 mt-2 text-base font-normal leading-normal text-gray-400">
            {courseSectionPath}
          </div>
          <TableListQuizInActivity activity={activity} />
        </>
      ),
    },
  ]
  return (
    <Collapse
      bordered={false}
      expandIconPosition="end"
      defaultActiveKey={['learning_outcome']}
      expandIcon={({ isActive }) => <CollapseArrowIcon selected={isActive} />}
      items={getItemsActivity}
      className="learning-activity-collapse rounded-xl bg-white p-6 shadow-learning-activity"
    />
  )
}

export default CollapseActivity
