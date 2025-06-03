import { CollapseArrowIcon, DownloadIcon, StarCircleIcon } from '@assets/icons'
import EditorReader from '@components/base/editor/EditorReader'
import { SUFFIX_TYPE } from '@components/uploadFile/ModalUploadFile/UploadFileInterface'
import { UploadAPI } from '@pages/api/upload'
import { trackGAEvent } from '@utils/google-analytics'
import { Collapse } from 'antd'
import clsx from 'clsx'
import React from 'react'
import { IActivity } from 'src/type/course/my-course/Activity'

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
  const download = async (name: string, file_key: string) => {
    await UploadAPI.downloadFile({
      files: [
        {
          name: name,
          file_key: file_key,
        },
      ],
    })
  }
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
                  e.resource.suffix_type !== SUFFIX_TYPE.GENERAL_FILE &&
                  e.resource.name.slice(-4) !== '.csv'

                return (
                  <div
                    className={clsx(`flex items-start gap-8`, {
                      'mb-3': index < activity?.files?.length - 1,
                    })}
                    key={index}
                  >
                    <div className="">
                      <p
                        className="cursor-pointer text-blue-7 underline hover:text-primary"
                        onClick={() => {
                          isPreviewFile
                            ? handleOpenScratchPad(
                                {
                                  type: 'file',
                                },
                                e?.resource?.url,
                                e?.resource?.name,
                              )
                            : download(e?.resource?.name, e?.resource?.file_key)

                          trackGAEvent('Click Open File Resource')
                        }}
                      >
                        {e?.resource?.name}
                      </p>
                    </div>
                    <div
                      className="cursor-pointer text-dark-1"
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
      className="learning-activity-collapse rounded-xl bg-white p-6 shadow-learning-activity"
    />
  )
}

export default ActivityResource
