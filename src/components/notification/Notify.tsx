import React, { useState } from 'react'
import Icon from '@components/icons'

interface NotifyProps {
  message: string
  readStatus: boolean
  time: number
}

const Notify = ({ message, readStatus, time }: NotifyProps) => {
  return (
    <div
      className={`w-full p-6 pb-5 relative ${
        readStatus ? 'bg-white' : 'bg-secondary'
      }`}
    >
      {!readStatus && (
        <Icon type="ellip" className="text-primary absolute left-2 top-1/2" />
      )}
      <h4
        className="text-base text-bw-1 mb-1"
        dangerouslySetInnerHTML={{ __html: message }}
      ></h4>
      <p className="text-gray-1 text-medium-sm text-left">{time} mins ago</p>
    </div>
  )
}

export default Notify
