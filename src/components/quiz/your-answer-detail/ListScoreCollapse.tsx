import type { CollapseProps } from 'antd'
import React, { Fragment } from 'react'
import BaseCollapse from 'src/components/quiz/your-answer-detail/BaseCollapse'
import ButtonText from '@components/base/button/ButtonText'
import { convertSecondsToMinutesSeconds } from '@utils/helpers'
import { htmlToRaw } from '@components/common/timer'
import clsx from 'clsx'
import { ArrowDownIcon } from '@components/courses/icons'

const ListScoreCollapse = ({
  data,
  onShowDetail,
  renderResult,
  getTypeName,
}: {
  data: any[]
  onShowDetail: (id: any) => void | undefined
  renderResult: (item: any) => React.ReactNode
  getTypeName: (type: string) => string
}) => {
  const renderContent = (item: any) => {
    const classLabel = 'text-sm font-medium text-gray-400'
    const classRow = 'flex items-center gap-3'
    const classContent = 'text-gray-800 text-sm font-normal'
    return (
      <Fragment>
        <div className="flex flex-col gap-3">
          <div className={classRow}>
            <span className={classLabel}>Section:</span>
            <div
              className={clsx(
                classContent,
                'max-w-52 overflow-hidden truncate',
              )}
            >
              {item?.question?.question_filter?.part?.name || '--'}
            </div>
          </div>
          <div className={classRow}>
            <span className={classLabel}>Type:</span>
            <span className={classContent}>
              {getTypeName(item?.question?.qType)}
            </span>
          </div>
          <div className={classRow}>
            <span className={classLabel}>Result:</span>
            <span className="inline-flex items-center justify-center text-nowrap">
              {renderResult(item)}
            </span>
          </div>
          <div className={classRow}>
            <span className={classLabel}>Time Spent:</span>
            <span className={classContent}>
              {item?.time_spent || item?.time_spent === 0
                ? convertSecondsToMinutesSeconds(item?.time_spent)
                : '---'}
            </span>
          </div>
        </div>
        <ButtonText
          title="View Detail"
          className="mt-4"
          onClick={() => (item?.id ? onShowDetail(item?.id) : '#')}
        />
      </Fragment>
    )
  }

  const getItems: (data: any[]) => CollapseProps['items'] = (data) => {
    return data.map((item: any) => ({
      key: item.id,
      label: (
        <div className={`collapse-label text-base font-medium text-gray-800`}>
          {htmlToRaw(item?.question?.question_content)}
        </div>
      ),
      children: renderContent(item),
    }))
  }

  return (
    <BaseCollapse
      items={getItems(data)}
      expandIcon={({ isActive }) => (
        <ArrowDownIcon
          className={clsx('transition-transform', {
            'rotate-180': isActive,
          })}
        />
      )}
    />
  )
}

export default ListScoreCollapse
