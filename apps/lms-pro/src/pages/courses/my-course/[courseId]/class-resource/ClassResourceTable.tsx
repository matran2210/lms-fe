import NameNoActionCell from '@components/teacher/components/NameNoActionCell'
import { CloseIcon, DownloadIcon } from '@lms/assets'
import { useFeature } from '@lms/contexts'
import {
  CLASS_SUFFIX_TYPE,
  DEFAULT_PAGE_NUMBER,
  IClassResource,
} from '@lms/core'
import { useUserRole } from '@lms/hooks'
import {
  ActionCellV2,
  FileViewer,
  ModalResizeable,
  PaginationSappV2,
  SappModalImageV2,
  SappTable,
  SAPPVideo,
  TextPreview,
  Tooltip,
} from '@lms/ui'
import { UploadAPI } from '@pages/api/upload'
import { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useRef, useState } from 'react'

const ClassResourceTable = ({
  data,
  pagination,
  isLoading,
  setPagination,
}: {
  data: any
  pagination: TablePaginationConfig
  isLoading: boolean
  setPagination: Dispatch<SetStateAction<TablePaginationConfig>>
}) => {
  const { videoUrl } = useFeature()
  const router = useRouter()
  const textStyle = 'text-base font-medium text-gray-800'
  const className = 'custom-column-table'
  const textTruncateStyle = `${textStyle} overflow-hidden text-ellipsis whitespace-nowrap max-w-[300px]`
  const { isTeacher } = useUserRole()
  const internalRef = useRef<HTMLVideoElement>(null)
  const [previewResource, setPreviewResource] = useState<IClassResource | null>(
    null,
  )
  const [openPreview, setOpenPreview] = useState(false)

  const handleOpenPreview = (resource: IClassResource) => {
    if (!resource?.url && !resource?.sub_url) return
    setPreviewResource(resource)
    setOpenPreview(true)
  }
  const canDownload = (record: IClassResource, isTeacher: boolean) => {
    const perms = record?.class_resource_permissions

    if (!perms) return false

    return isTeacher
      ? perms.teacher === 'DOWNLOAD'
      : perms.student === 'DOWNLOAD'
  }
  const columns: ColumnsType<IClassResource> = [
    {
      title: '#',
      key: 'index',
      width: 60,
      align: 'center',
      className: className,
      render: (_, __, index) => {
        const currentPage = pagination?.current || 1
        const pageSize = pagination?.pageSize || 10
        const order = (currentPage - 1) * pageSize + index + 1

        return (
          <NameNoActionCell
            dataColumn={order}
            className="text-base text-gray-400"
            isCenter
          />
        )
      },
    },
    {
      title: 'File name',
      dataIndex: 'name',
      key: 'name',
      className: clsx(className),
      render: (name, resource) => (
        <Tooltip placement="bottomLeft" title={name}>
          <div
            onClick={() => handleOpenPreview(resource)}
            className={clsx(textTruncateStyle, 'cursor-pointer')}
          >
            {name}
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'suffix_type',
      key: 'type',
      className: clsx(className, 'text-center'),
      align: 'center',
      render: (_, record) => (
        <NameNoActionCell
          isCenter
          dataColumn={
            CLASS_SUFFIX_TYPE?.find((item) => item.value === record.suffix_type)
              ?.label
          }
          className="text-base text-gray-400"
        />
      ),
      width: 100,
    },
    {
      title: 'Lesson',
      dataIndex: 'lesson',
      key: 'lesson',
      className: clsx(className, 'text-center'),
      align: 'center',
      render: (_, record) =>
        record?.class_resource_permissions?.schedules.map((item) => (
          <div className="text-base text-gray-400">{item?.name}</div>
        )),
      width: 400,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      className: clsx(className),
      align: 'center',
      render: (location) => (
        <NameNoActionCell
          isCenter
          dataColumn={location}
          className="text-base text-gray-400"
        />
      ),
      width: 300,
    },
    {
      title: '',
      key: 'actions',
      className: className,
      render: (_, record) => {
        const allowDownload = canDownload(record, isTeacher)
        return (
          <div
            className={clsx('flex justify-end', {
              'pointer-events-none opacity-40': !allowDownload,
            })}
          >
            <ActionCellV2
              className=""
              listAction={[
                {
                  icon: <DownloadIcon className="h-5 w-5" />,
                  nameAction: 'Download',
                  action: () => download(record.name, record.file_key),
                },
              ]}
            />
          </div>
        )
      },
    },
  ]

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

  const renderPreviewContent = (resource: IClassResource) => {
    switch (resource.suffix_type) {
      case 'VIDEO':
      case 'AUDIO':
        return (
          <SAPPVideo
            isFetchCaptions={false}
            streamRef={internalRef}
            options={{
              src: resource.url
                ? resource.url
                    .replace(videoUrl || '', '')
                    .replace('/manifest/video.m3u8', '')
                : resource.sub_url,
            }}
          ></SAPPVideo>
        )
      case 'SHEET':
      case 'WORD_DOCUMENT':
      case 'POWER_POINT':
      case 'PDF':
        return (
          <FileViewer
            fileName={resource.name}
            fileUrl={resource.url}
            onlyView
          />
        )
      case 'TEXT':
        return <TextPreview url={resource.url} />
      case 'ZIP':
        return (
          <div className="text-gray-500 flex h-full items-center justify-center text-base font-medium">
            Không thể hiển thị file ZIP, vui lòng tải xuống
          </div>
        )

      default:
        return (
          <div className="flex h-full items-center justify-center text-base text-gray-400">
            Không hỗ trợ xem trước định dạng này
          </div>
        )
    }
  }

  return (
    <div onContextMenu={(e) => e.preventDefault()}>
      <SappTable
        columns={columns}
        data={data?.data}
        loading={isLoading}
        rowKey="id"
        pagination={pagination}
        className="style-table-v2 rounded-xl bg-white"
        isShowPagination={false}
      />
      <PaginationSappV2
        currentPage={pagination?.current || DEFAULT_PAGE_NUMBER}
        pageSize={pagination?.pageSize || 10}
        totalItems={pagination?.total || 0}
        setCurrentPage={(page) => {
          router.push({
            pathname: router.pathname,
            query: {
              ...router.query,
              page_index: page as number,
            },
          })
          setPagination((prev) => ({ ...prev, current: page as number }))
        }}
        setPageSize={(page) => {
          router.push({
            pathname: router.pathname,
            query: {
              ...router.query,
              page_size: page as number,
              page_index: DEFAULT_PAGE_NUMBER,
            },
          })
          setPagination((prev) => ({ ...prev, pageSize: page as number }))
        }}
      />
      {openPreview &&
        previewResource &&
        previewResource.suffix_type !== 'IMAGE' && (
          <ModalResizeable
            bodyClassName={clsx('px-5')}
            key={previewResource.url}
            modalIndex={1}
            title={previewResource.name}
            width={900}
            height={548}
            className={clsx('!z-40 !rounded-lg')}
            position="center"
            handleCloseScratchPad={() => {
              setOpenPreview(false)
              setPreviewResource(null)
            }}
            header={
              <div className="modal-header modal-dragger flex h-10 w-full items-center justify-between">
                <div className="truncate font-semibold">
                  {previewResource.name}
                </div>
                <button
                  onClick={() => {
                    setOpenPreview(false)
                    setPreviewResource(null)
                  }}
                >
                  <CloseIcon />
                </button>
              </div>
            }
          >
            <div className="h-full bg-white">
              {renderPreviewContent(previewResource)}
            </div>
          </ModalResizeable>
        )}
      {openPreview &&
        previewResource &&
        previewResource.suffix_type === 'IMAGE' && (
          <SappModalImageV2
            src={previewResource.url}
            setSrc={() => setOpenPreview(false)}
          />
        )}
    </div>
  )
}

export default ClassResourceTable
