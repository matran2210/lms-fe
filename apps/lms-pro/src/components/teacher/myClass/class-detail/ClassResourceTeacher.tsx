import ClassResourceTeacherFilter from '@components/teacher/components/ClassResourceTeacherFilter'
import NameNoActionCell from '@components/teacher/components/NameNoActionCell'
import { CloseIcon, DownloadIcon } from '@lms/assets'
import { useFeature } from '@lms/contexts'
import {
  CLASS_SUFFIX_TYPE,
  ClassKey,
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  IClassResource,
  IListClassResourceParams,
} from '@lms/core'
import { useSappPaging, useUserRole } from '@lms/hooks'
import {
  ActionCellV2,
  FileViewer,
  LayoutFilter,
  ModalResizeable,
  SappModalImage,
  SappTable,
  SAPPVideo,
  Tooltip,
  TextPreview,
} from '@lms/ui'
import { formatDate } from '@lms/utils'
import { ClassAPI } from '@pages/api/class'
import { UploadAPI } from '@pages/api/upload'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

export default function ClassResourceTeacher() {
  const { videoUrl } = useFeature()
  const router = useRouter()
  const internalRef = useRef<HTMLVideoElement>(null)
  const { control, reset, getValues } = useForm()
  const [params, setParams] = useState<IListClassResourceParams>({
    page_size: DEFAULT_PAGE_SIZE,
    page_index: DEFAULT_PAGE_NUMBER,
  })

  const [previewResource, setPreviewResource] = useState<IClassResource | null>(
    null,
  )
  const [openPreview, setOpenPreview] = useState(false)

  const handleOpenPreview = (resource: IClassResource) => {
    if (!resource?.url && !resource?.sub_url) return
    setPreviewResource(resource)
    setOpenPreview(true)
  }

  const { data, pagination, isLoading, handleChangeParams, setPagination } =
    useSappPaging({
      uniqueKey: ClassKey.ClassResource,
      queryFn: () =>
        ClassAPI.getClassResource(router.query.id as string, {
          ...params,
          page_index: pagination.current as number,
          page_size: pagination.pageSize as number,
        }),
      params,
    })

  const { isTeacher } = useUserRole()

  const handleResetFilter = () => {
    reset({ search_key: '', suffix_types: '' })
    setParams({
      page_size: DEFAULT_PAGE_SIZE,
      page_index: DEFAULT_PAGE_NUMBER,
    })
  }

  const onSubmit = () => {
    setParams((prev) => ({
      ...prev,
      search_key: getValues('search_key') || undefined,
      suffix_types: getValues('suffix_types')?.value || undefined,
      schedule_ids: getValues('schedule_ids') || undefined,
    }))
  }

  const canDownload = (record: IClassResource, isTeacher: boolean) => {
    const perms = record?.class_resource_permissions

    if (!perms) return false

    return isTeacher
      ? perms.teacher === 'DOWNLOAD'
      : perms.student === 'DOWNLOAD'
  }
  const textStyle = 'text-base font-medium text-gray-800'
  const textTruncateStyle = `${textStyle} overflow-hidden text-ellipsis whitespace-nowrap max-w-[300px]`

  const columnsValue = [
    {
      title: 'File name',
      render: (record: IClassResource) => (
        <Tooltip
          placement="bottomLeft"
          title={record?.name}
          className="cursor-pointer"
        >
          <div
            onClick={() => handleOpenPreview(record)}
            className={clsx(textTruncateStyle, 'cursor-pointer')}
          >
            {record?.name}
          </div>
        </Tooltip>
      ),
      onCell: () => ({
        style: { cursor: 'pointer' },
      }),
    },
    {
      title: 'Type',
      render: (record: IClassResource) => (
        <NameNoActionCell
          dataColumn={
            CLASS_SUFFIX_TYPE?.find((item) => item.value === record.suffix_type)
              ?.label
          }
        />
      ),
    },
    {
      title: 'Owner',
      render: (record: IClassResource) => (
        <NameNoActionCell
          dataColumn={record?.created_by_staff?.detail?.full_name}
        />
      ),
    },
    {
      title: 'Date',
      render: (record: IClassResource) => (
        <>
          {record?.created_at && (
            <div>
              Created: {formatDate(record?.created_at, 'DD-MM-YYYY HH:mm')}
            </div>
          )}
          {record?.updated_at && (
            <div>
              Updated: {formatDate(record?.updated_at, 'DD-MM-YYYY HH:mm')}
            </div>
          )}
        </>
      ),
    },
    {
      title: 'Lesson',
      render: (record: IClassResource) =>
        record?.class_resource_permissions?.schedules.map((item) => (
          <div>{item?.name}</div>
        )),
    },
    {
      title: '',
      render: (record: IClassResource) => {
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
      <LayoutFilter
        listFilter={<ClassResourceTeacherFilter control={control} />}
        loading={isLoading}
        onReset={handleResetFilter}
        onSubmit={onSubmit}
      />
      <SappTable
        handleChangeParams={handleChangeParams}
        columns={columnsValue}
        data={data?.data ?? []}
        pagination={pagination}
        setPagination={setPagination}
        loading={isLoading}
        titleTable={{
          title: `Class Resource List: ${data?.metadata?.total_records ?? 0}`,
          isShowTitle: true,
        }}
        isShowIndex
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
          <SappModalImage
            src={previewResource.url}
            setSrc={() => setOpenPreview(false)}
          />
        )}
    </div>
  )
}
