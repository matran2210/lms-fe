import { CloseIcon, DownloadIcon, LoadingIcon } from '@lms/assets'
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
  ActionCellWithPopover,
  EditorReader,
  FileViewer,
  LayoutFilter,
  ModalResizeable,
  NameNoActionCell,
  PdfViewer,
  Popover,
  SAPPAudio,
  SappModalImage,
  SappTable,
  SAPPVideo,
  SheetViewer,
  TextPreview,
  Tooltip
} from '@lms/ui'
import { formatDate, handleDocUploadFromBlob } from '@lms/utils'
import clsx from 'clsx'
import CryptoJS from 'crypto-js'
import { useParams } from 'next/navigation'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import ClassResourceTeacherFilter from '../../ClassResourceTeacherFilter'

export default function ClassResourceTeacher() {
  const { videoUrl, classApi, uploadApi } = useFeature()
  const param = useParams()
  const { id } = param
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
  const [defaultEditor, setDefaultEditor] = useState<string>()
  const [loadingEditor, setLoadingEditor] = useState<boolean>(false)
  const [sheetResizeVersion, setSheetResizeVersion] = useState(0)

  const handleOpenPreview = async (resource: IClassResource) => {
    try {
      const res = await classApi.previewClassFile?.(
        param.id as string,
        resource.id,
      )
      if (res) {
        let originalUrl = res.url
        if (res.is_encrypted) {
          const rawDecoded = CryptoJS.AES.decrypt(
            res.url,
            process.env.NEXT_PUBLIC_DECRYPT_CRYPTO_KEY || '',
          )
          originalUrl = rawDecoded.toString(CryptoJS.enc.Utf8)
        }
        setPreviewResource({
          ...resource,
          url: originalUrl,
          is_encrypted: res.is_encrypted,
        })
        setOpenPreview(true)
        if (resource.suffix_type === 'WORD_DOCUMENT') {
          setLoadingEditor(true)
          const defaultEditor = await getEditorData(originalUrl)
          setDefaultEditor(defaultEditor)
          setLoadingEditor(false)
        }
      }
    } catch (error) { }
  }

  const { data, pagination, isLoading, handleChangeParams, setPagination } =
    useSappPaging({
      uniqueKey: ClassKey.ClassResource,
      queryFn: () =>
        classApi.getClassResource!(id as string, {
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
      align: 'left',
      render: (record: IClassResource) => {
        const schedules = record?.class_resource_permissions?.schedules || []
        const preview = schedules.slice(0, 2)

        return (
          <div>
            {preview.map((i) => (
              <div key={i.name} className="text-base text-gray-400">
                {i.name}
              </div>
            ))}
            <Popover
              placement="right"
              content={
                <div className="tooltip-scroll flex max-h-60 flex-col gap-1 overflow-auto">
                  {schedules.map((i, idx) => (
                    <div className="p-2 text-sm" key={idx}>
                      {i.name}
                    </div>
                  ))}
                </div>
              }
            >
              <div className="inline cursor-pointer">
                {schedules.length > 2 && (
                  <span className="text-sm font-medium text-primary">
                    +{schedules.length - 2} more
                  </span>
                )}
              </div>
            </Popover>
          </div>
        )
      },
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
            <ActionCellWithPopover
              className=""
              listAction={[
                {
                  icon: <DownloadIcon className="h-5 w-5" />,
                  nameAction: 'Download',
                  action: () => download(param.id as string, record.id),
                },
              ]}
            />
          </div>
        )
      },
    },
  ]

  const download = async (class_id: string, resource_id: string) => {
    await uploadApi.downloadFileClassResource(class_id, resource_id)
  }

  const loadDocFile = async (url: string) => {
    try {
      const res = await fetch(url)
      const blob = await res.blob()
      return await handleDocUploadFromBlob(blob)
    } catch (error) {
      return ''
    }
  }

  async function getEditorData(url: string) {
    return loadDocFile(url)
  }

  const renderPreviewContent = (resource: IClassResource) => {
    switch (resource.suffix_type) {
      case 'VIDEO':
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
      case 'AUDIO':
        return (
          <SAPPAudio
            streamRef={internalRef}
            options={{
              src: resource.url
                ? resource.url
                  .replace(videoUrl || '', '')
                  .replace('/manifest/video.m3u8', '')
                : resource.sub_url,
            }}
          ></SAPPAudio>
        )
      case 'WORD_DOCUMENT':
        return loadingEditor ? (
          <LoadingIcon stroke="#404041" />
        ) : resource.is_encrypted ? (
          <div className="word-document-preview">
            <EditorReader text_editor_content={defaultEditor || ''} />
          </div>
        ) : (
          <FileViewer
            fileName={resource.name}
            fileUrl={resource.url}
            onlyView
          />
        )

      case 'SHEET':
        return resource.is_encrypted ? (
          <SheetViewer
            fileUrl={resource.url}
            fileName={resource.name}
            resizeVersion={sheetResizeVersion}
          />
        ) : (
          <FileViewer
            fileName={resource.name}
            fileUrl={resource.url}
            onlyView
          />
        )
      case 'PDF':
        return resource.is_encrypted ? (
          <PdfViewer url={resource.url} />
        ) : (
          <FileViewer
            fileName={resource.name}
            fileUrl={resource.url}
            onlyView
          />
        )
      case 'POWER_POINT':
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
          <div className="flex h-full items-center justify-center text-base font-medium text-gray-500">
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
            isInBody={true}
            bodyClassName={clsx('px-5', {
              'pb-5': previewResource.suffix_type === 'WORD_DOCUMENT',
            })}
            key={previewResource.url}
            modalIndex={1}
            title={previewResource.name}
            width={900}
            height={previewResource.suffix_type === 'AUDIO' ? 100 : 548}
            minHeight={
              previewResource.suffix_type === 'AUDIO' ? 100 : undefined
            }
            maxHeight={
              previewResource.suffix_type === 'AUDIO' ? 100 : undefined
            }
            minWidth={
              ['AUDIO', 'VIDEO'].includes(previewResource.suffix_type)
                ? 430
                : undefined
            }
            className={clsx('!z-40 !rounded-lg', {
              '!overflow-visible': previewResource.suffix_type === 'AUDIO',
            })}
            position="center"
            onClose={() => {
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
                  onTouchEnd={() => {
                    setOpenPreview(false)
                    setPreviewResource(null)
                  }}
                >
                  <CloseIcon />
                </button>
              </div>
            }
            onResizeStopDone={() => {
              setSheetResizeVersion((v) => v + 1)
            }}
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
