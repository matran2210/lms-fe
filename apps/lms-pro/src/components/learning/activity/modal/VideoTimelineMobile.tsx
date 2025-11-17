import SappDrawerV3 from '@components/base/drawer/SappDrawerV3'
import { formatTime, htmlToRaw } from '@components/common/timer'
import React, { useRef, useState } from 'react'
import NoData from 'src/common/NoData'
import { IVideo } from '@lms/core'

interface IProps {
  open: boolean
  onClose: () => void
  currentVideo: IVideo
}
const VideoTimelineMobile = ({ open, onClose, currentVideo }: IProps) => {
  const internalRef = useRef<any>()
  const handleGoTimeline = (time: number) => {
    if (internalRef.current) {
      internalRef.current.currentTime = time
    }
  }

  const timeLine = [...(currentVideo?.file?.resource?.time_line || [])]?.sort(
    (a, b) => (Number(a?.time) || 0) - (Number(b.time) || 0),
  )

  return (
    <SappDrawerV3
      open={open}
      handleCancel={onClose}
      title=""
      isShowBtnClose
      classNameBody="px-2 py-4"
      rootClassName={'responsive-drawer-v3'}
      closable={false}
      isShowHeader={false}
    >
      <div>
        {timeLine && timeLine?.length > 0 ? (
          timeLine?.map((e, i) => {
            return (
              <div
                key={i}
                className="mb-2 grid grid-cols-[1.3fr,6fr] gap-3 rounded p-2 text-sm text-[#050505] hover:bg-gray-100"
                onClick={() => {
                  handleGoTimeline(e?.time)
                }}
              >
                <div className="mim-w-[62px] text-info-600">
                  {formatTime(e?.time)}
                </div>
                <div className="text-inherit line-clamp-2 text-gray-800">
                  {htmlToRaw(e?.text)}
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center">
            <NoData />
          </div>
        )}
      </div>
    </SappDrawerV3>
  )
}

export default VideoTimelineMobile
