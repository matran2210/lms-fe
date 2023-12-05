import React from 'react'

const NotData = ({ className }: { className?: string | undefined }) => {
  return (
    <div
      className={`${
        className ?? ''
      } d-flex text-center w-100 align-content-center justify-content-center`}
    >
      No matching records found
    </div>
  )
}

export default NotData
