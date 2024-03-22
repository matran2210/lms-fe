import React from 'react'

interface IProps {
  notifyDetail: any
}

const NotifyDetail = ({ notifyDetail }: IProps) => {
  return (
    <div key={notifyDetail?.id} className="w-full">
      <div
        className="text-bw-1 sapp-notifcation text-base"
        dangerouslySetInnerHTML={{ __html: notifyDetail?.content }}
      ></div>
    </div>
  )
}

export default NotifyDetail
