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
      <td className="w-18 min-w-165px border-b border-dashed border-[#DCDDDD] py-5 pl-11 text-base text-[#050505]">
        {type}
      </td>
      <td className="w-3.6 min-w-400px border-b border-dashed border-[#DCDDDD] py-5 text-base text-[#050505]">
        {partName}
      </td>
      <td className="w-17 min-w-190px border-b border-dashed border-[#DCDDDD] py-5 text-base text-[#050505]">
        {chapter}
      </td>
      <td className="flex min-w-132px justify-between border-b border-dashed border-[#DCDDDD] py-5 pr-14 text-base text-[#050505]">
        <div className="flex w-full justify-between gap-x-5">
          <span>
            {correctStatus ? (
              <span className="text-success-600">{status}</span>
            ) : (
              <span className="text-error">{status}</span>
            )}
          </span>
          {statusPercentage != 0 && (
            <span className="flex items-center gap-1 text-base text-[#A1A1A1]">
              <Icon type={statusIcon} />
              {statusPercentage}%
            </span>
          )}
        </div>
      </td>
      <td className="w-7-percent min-w-[78px] border-b border-dashed border-[#DCDDDD] py-5 text-center text-base text-[#050505]">
        {formattedTime}
      </td>
    </>
  )
}

export default ResultRow
