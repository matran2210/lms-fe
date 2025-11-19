import { CollapseArrowIcon, DownloadIcon } from '@assets/icons'
import { SUFFIX_TYPE } from '@components/uploadFile/ModalUploadFile/UploadFileInterface'
import { UploadAPI } from '@pages/api/upload'
import { trackGAEvent } from '@lms/utils'
import { Collapse } from 'antd'
import clsx from 'clsx'
import React from 'react'
import Tooltip from 'src/common/Tooltip'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'
import { IActivity } from '@lms/core'

export const download = async (name: string, file_key: string) => {
  await UploadAPI.downloadFile({
    files: [
      {
        name: name,
        file_key: file_key,
      },
    ],
  })
}
interface IProps {
  activity: IActivity
  handleOpenScratchPad: (
    data: any,
    file?: string,
    fileName?: string,
    event?: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => void
}
const ActivityResource = ({ activity, handleOpenScratchPad }: IProps) => {
  const { isAlwaysShowSidebar } = useTailwindBreakpoint()
  const getItemsActivityResource = [
    {
      key: 'activity_resource',
      label: (
        <div className={'select-none text-lg font-medium text-bw-13'}>
          Activity Resource
        </div>
      ),
      children: (
        <>
          {activity?.files?.length > 0 && (
            <div className="mt-4 select-none text-sm">
              {activity?.files.map((e: any, index: number) => {
                const isPreviewFile =
                  isAlwaysShowSidebar &&
                  e.resource.suffix_type !== SUFFIX_TYPE.GENERAL_FILE &&
                  e.resource.name.slice(-4) !== '.csv'

                return (
                  <div
                    className={clsx(
                      'group flex w-min cursor-pointer items-center gap-3',
                      { 'mb-3': index < activity?.files?.length - 1 },
                    )}
                    key={index}
                    onClick={() => {
                      isPreviewFile
                        ? handleOpenScratchPad(
                            { type: 'file' },
                            e?.resource?.url,
                            e?.resource?.name,
                          )
                        : download(e?.resource?.name, e?.resource?.file_key)

                      trackGAEvent('Click Open File Resource')
                    }}
                  >
                    {/* Text */}
                    <Tooltip title="Preview File">
                      <p className="text-info-600 underline group-hover:text-primary">
                        {e?.resource?.name}
                      </p>
                    </Tooltip>

                    {/* Icon */}
                    <div
                      className="block cursor-pointer text-icon group-hover:block group-hover:text-primary lg:hidden"
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
          )}
        </>
      ),
    },
  ]
  return (
    <Collapse
      bordered={false}
      expandIconPosition="end"
      defaultActiveKey={['activity_resource']}
      expandIcon={({ isActive }) => <CollapseArrowIcon selected={isActive} />}
      items={getItemsActivityResource}
      className="learning-activity-collapse rounded-xl bg-white p-6 shadow-small"
    />
  )
}

export default ActivityResource
