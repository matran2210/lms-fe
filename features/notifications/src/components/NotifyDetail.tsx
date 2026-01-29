import React from 'react'

interface IProps {
  notifyDetail: any
}

const NotifyDetail = ({ notifyDetail }: IProps) => {
  return (
    <div key={notifyDetail?.id} className="w-full">
      <div
        className="sapp-notifcation text-base text-gray-800"
        dangerouslySetInnerHTML={{ __html: notifyDetail?.content }}
      ></div>
    </div>
  )
}

export default NotifyDetail
