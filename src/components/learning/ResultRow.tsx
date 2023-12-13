import React, { useState } from 'react'
import Icon from '@components/icons'
import { formatTime } from '@components/common/timer'

interface ResultRowsProps {
  type: string
  partName: string
  chapter: string
  correctStatus: boolean
  status: string
  statusPercentage: number
  statusIcon: string
  time?: number
}

const ResultRow = ({
  type,
  partName,
  chapter,
  correctStatus,
  status,
  statusPercentage,
  statusIcon,
  time,
}: ResultRowsProps) => {
  const formattedTime = formatTime(time)

  return (
    <>
      <td className="text-base text-bw-1 w-18 pl-11 py-5 border-b border-default border-dashed min-w-165px">
        {type}
      </td>
      <td className="text-base text-bw-1 py-5 border-b border-default border-dashed w-3.6 min-w-400px">
        {partName}
      </td>
      <td className="text-base text-bw-1 py-5 border-b border-default border-dashed w-17 min-w-190px">
        {chapter}
      </td>
      <td className="text-base text-bw-1 flex justify-between pr-14 py-5 border-b border-default border-dashed min-w-132px">
        <div className="flex justify-between gap-x-5 w-full">
          <span>
            {correctStatus ? (
              <span className="text-state-success">{status}</span>
            ) : (
              <span className="text-state-error">{status}</span>
            )}
          </span>
          {statusPercentage != 0 && (
            <span className="flex gap-1 text-base text-gray-1 items-center">
              <Icon type={statusIcon} />
              {statusPercentage}%
            </span>
          )}
        </div>
      </td>
      <td className="text-base text-bw-1 text-center py-5 border-b border-default border-dashed w-7-percent min-w-78px">
        {formattedTime}
      </td>
    </>
  )
}

export default ResultRow
