import { CollapseArrowIcon } from '@assets/icons'
import { Collapse } from 'antd'
import React from 'react'
import TableListQuizInActivity from './TableListQuizInActivity'
import { ITestQuizProps } from 'src/type/results'

const CollapseActivity = ({ resultData, handleViewResult }: ITestQuizProps) => {
  if (!resultData) return null
  const getItemsActivity = [
    {
      key: 'activity',
      label: (
        <div className="text-lg font-semibold leading-[27px] text-gray-800">
          {resultData?.name}
        </div>
      ),
      children: (
        <>
          <div className="mb-6 mt-2 text-base font-normal leading-normal text-gray-400">
            {resultData?.path}
          </div>
          <TableListQuizInActivity activity={resultData?.quiz_activity} />
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
