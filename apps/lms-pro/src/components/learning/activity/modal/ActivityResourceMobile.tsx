import React from 'react'
import SappDrawerV3 from '@components/base/drawer/SappDrawerV3'
import NoData from 'src/common/NoData'
import { IActivity } from '@lms/core'
import clsx from 'clsx'
import { download } from '../ActivityResource'
import { trackGAEvent } from '@utils/google-analytics'
import { DocumentTextIcon, DownloadIcon } from '@assets/icons'

interface IProps {
  open: boolean
  onClose: () => void
  activity: IActivity
  handleOpenScratchPad: (
    data: any,
    file?: string,
    fileName?: string,
    event?: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => void
}
const ActivityResourceMobile = ({
  open,
  onClose,
  activity,
  handleOpenScratchPad,
}: IProps) => {
  return (
    <SappDrawerV3
      open={open}
      handleCancel={onClose}
      title="Activity Resources"
      classNameBody="!p-4"
      rootClassName={'responsive-drawer-base drawer-bottom-0'}
      isShowBtnClose
      closable
      classNameHeader="!mb-4"
      placement={'bottom'}
    >
      <div>
        {activity && activity?.files?.length > 0 ? (
          activity?.files?.length > 0 && (
            <div className="text-sm">
              {activity?.files.map((e: any, index: number) => {
                return (
                  <div
                    className={clsx(
                      `flex items-start justify-between rounded-md bg-gray-100 p-2`,
                      {
                        'mb-2': index < activity?.files?.length - 1,
                      },
                    )}
                    key={index}
                  >
                    <div
                      className="flex flex-1 cursor-pointer items-center gap-2 overflow-hidden text-xs text-gray-800 hover:text-primary hover:underline"
                      onClick={() => {
                        download(e?.resource?.name, e?.resource?.file_key)
                        trackGAEvent('Click Open File Resource')
                      }}
                    >
                      <DocumentTextIcon className="shrink-0" />
                      <p className="overflow-hidden truncate text-ellipsis whitespace-nowrap">
                        {e?.resource?.name}
                      </p>
                    </div>
                    <div
                      className="shrink-0 cursor-pointer text-gray-800"
                      onClick={() => {
                        download(e?.resource?.name, e?.resource?.file_key)
                        trackGAEvent('Click Button Download Resource Activity')
                      }}
                    >
                      <DownloadIcon color="currentColor" />
                    </div>
                  </div>
                )
              })}
            </div>
          )
        ) : (
          <div className="flex min-h-[200px] items-center justify-center lg:min-h-[calc(100vh-20rem)]">
            <NoData />
          </div>
        )}
      </div>
    </SappDrawerV3>
  )
}

export default ActivityResourceMobile
