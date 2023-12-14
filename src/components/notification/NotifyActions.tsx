import React, { useState, Dispatch, SetStateAction } from 'react'

interface IProps {
  handleMarkAll: () => void
}

const NotifyActions = ({ handleMarkAll }: IProps) => {
  return (
    <>
      <div
        className="py-3 border-b border-gray-2 last:border-0 text-medium-sm text-bw-1"
        onClick={handleMarkAll}
      >
        <div className="cursor-pointer">Mark all as read</div>
      </div>
    </>
  )
}

export default NotifyActions
