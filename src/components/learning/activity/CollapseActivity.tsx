import { CollapseArrowIcon } from '@assets/icons'
import { Collapse } from 'antd'
import React from 'react'
import TableListQuizInActivity from './TableListQuizInActivity'
import { ITestQuizProps } from 'src/type/results'
import clsx from 'clsx'

const CollapseActivity = ({
  resultData,
  handleViewResult,
  getScore,
}: ITestQuizProps) => {
  if (!resultData) return null
  const handleViewActivity = () => {
    handleViewResult(resultData)
  }
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
          <TableListQuizInActivity
            dataTestQuiz={resultData}
            handleViewActivity={handleViewActivity}
            getScore={getScore ?? (() => '-')}
          />
        </>
      ),
    },
  ]
  return (
    <Collapse
      bordered={false}
      expandIconPosition="end"
      defaultActiveKey={['activity']}
      expandIcon={({ isActive }) => (
        <CollapseArrowIcon
          className={clsx({ '-rotate-180': isActive })}
          selected={isActive}
        />
      )}
      items={getItemsActivity}
      className="learning-activity-collapse rounded-xl bg-white p-6 shadow-learning-activity"
    />
  )
}

export default CollapseActivity
