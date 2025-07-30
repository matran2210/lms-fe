import { CollapseArrowIcon } from '@assets/icons'
import { Collapse } from 'antd'
import React, { useState } from 'react'
import TableListQuizInActivity from './TableListQuizInActivity'
import { ITestQuizProps } from 'src/type/results'
import clsx from 'clsx'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'

const CollapseActivity = ({
  resultData,
  handleViewResult,
  getScore,
  lastElementRef,
}: ITestQuizProps) => {
  const { isMobileView } = useTailwindBreakpoint()
  const [activeKey, setActiveKey] = useState<string | string[]>(['activity'])

  if (!resultData) return null

  const handleChange = (key: string | string[]) => {
    setActiveKey(key)
  }
  const handleViewActivity = () => {
    handleViewResult(resultData)
  }
  const getItemsActivity = [
    {
      key: 'activity',
      label: (
        <div className="text-base font-semibold leading-[27px] text-gray-800 md:text-lg">
          {resultData?.name}
        </div>
      ),
      children: (
        <>
          {!isMobileView && (
            <div className="mb-4 mt-2 text-base font-normal leading-normal text-gray-400">
              {resultData?.path}
            </div>
          )}
          <TableListQuizInActivity
            data={resultData}
            handleViewActivity={handleViewActivity}
            getScore={getScore ?? (() => '-')}
          />
        </>
      ),
    },
  ]
  return (
    <Collapse
      ref={lastElementRef}
      bordered={false}
      expandIconPosition="end"
      activeKey={activeKey}
      onChange={handleChange}
      expandIcon={({ isActive }) => (
        <CollapseArrowIcon
          className={clsx({ '-rotate-180': isActive })}
          selected={isActive}
        />
      )}
      items={getItemsActivity}
      className={`learning-activity-collapse rounded-xl bg-white p-4 shadow-small md:p-6 hover:${
        Array.isArray(activeKey) && activeKey.includes('activity')
          ? 'bg-white'
          : 'bg-primary-50'
      }`}
    />
  )
}

export default CollapseActivity
