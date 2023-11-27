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
      <td className="text-base text-bw-1 pl-[45px] py-5 border-b border-default border-dashed">
        {type}
      </td>
      <td className="text-base text-bw-1 py-5 border-b border-default border-dashed w-[34.5%]">
        {partName}
      </td>
      <td className="text-base text-bw-1 py-5 border-b border-default border-dashed w-[16%]">
        {chapter}
      </td>
      <td className="text-base text-bw-1 flex justify-between pr-[42px] py-5 border-b border-default border-dashed">
        <div className="flex justify-between gap-1 w-full">
          <span>
            {correctStatus ? (
              <span className="text-state-success">{status}</span>
            ) : (
              <span className="text-state-error">{status}</span>
            )}
          </span>
          <span className="flex gap-1 text-base text-gray-1 items-center">
            <Icon type={statusIcon} />
            {statusPercentage}%
          </span>
        </div>
      </td>
      <td className="text-base text-bw-1 text-center py-5 border-b border-default border-dashed">
        {formattedTime}
      </td>
    </>
  )
}

export default ResultRow
