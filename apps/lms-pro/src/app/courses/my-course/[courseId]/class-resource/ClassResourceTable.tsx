'use client'
import { LoadingIcon } from '@lms/assets'
import NameNoActionCell from '@components/teacher/components/NameNoActionCell'
import { CloseIcon, DownloadIcon } from '@lms/assets'
import { useFeature } from '@lms/contexts'
import {
  CLASS_SUFFIX_TYPE,
  DEFAULT_PAGE_NUMBER,
  IClassResource,
} from '@lms/core'
import { useUserRole, useWindowWidth } from '@lms/hooks'
import {
  ActionCellWithPopover,
  EditorReader,
  FileViewer,
  ModalResizeableNew,
  PaginationSapp,
  PdfViewer,
  Popover,
  SAPPAudio,
  SappModalImageOriginalRatio,
  SappTable,
  SAPPVideo,
  SheetViewer,
  TextPreview,
  Tooltip
} from '@lms/ui'
import { buildQueryString, handleDocUploadFromBlob } from '@lms/utils'
import { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import clsx from 'clsx'
import CryptoJS from 'crypto-js'
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'
import { Dispatch, SetStateAction, useRef, useState } from 'react'
import { ClassAPI } from 'src/api/class'
import { UploadAPI } from 'src/api/upload'

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
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const params = useParams()
  const query = Object.fromEntries(searchParams.entries())
  const textStyle = 'text-base font-medium text-gray-800'
  const className = 'custom-column-table'
  const textTruncateStyle = `${textStyle} overflow-hidden text-ellipsis whitespace-nowrap max-w-[300px]`
  const { isTeacher } = useUserRole()
  const windowWidth = useWindowWidth()
  const previewModalWidth = Math.max(320, Math.min(900, windowWidth - 32))
  const internalRef = useRef<HTMLVideoElement>(null)
  const [previewResource, setPreviewResource] = useState<IClassResource | null>(
    null,
  )
  const [openPreview, setOpenPreview] = useState(false)
  const [defaultEditor, setDefaultEditor] = useState<string>()
  const [loadingEditor, setLoadingEditor] = useState<boolean>(false)
  const [sheetResizeVersion, setSheetResizeVersion] = useState(0)

  const handleOpenPreview = async (resource: IClassResource) => {
    try {
      const res = await ClassAPI.previewClassFile(
        params.courseId as string,
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
      align: 'left',
      render: (_, record) => {
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
      width: 400,
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
            <ActionCellWithPopover
              className=""
              listAction={[
                {
                  icon: <DownloadIcon className="h-5 w-5" />,
                  nameAction: 'Download',
                  action: () => download(params.courseId as string, record.id),
                },
              ]}
            />
          </div>
        )
      },
    },
  ]

  const download = async (class_id: string, resource_id: string) => {
    await UploadAPI.downloadFileClassResource(class_id, resource_id)
  }
  /**
   * @static
   * @description Download file từ resource
   * @param {number} fileSize
   * @param {{files: {name: string; file_key: string}}} {files}
   * @memberof ResourcesAPI
   */
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
    const videoUrl = process.env.NEXT_PUBLIC_VIDEO_URL as string
    switch (resource.suffix_type) {
      case 'VIDEO':
        return resource.url ? (
          <div
            className="flex h-full min-h-0 w-full items-center justify-center overflow-hidden bg-black"
          >
            <SAPPVideo
              isFetchCaptions={false}
              streamRef={internalRef}
              options={{
                src: resource.url
                  .replace(videoUrl || '', '')
                  .replace('/manifest/video.m3u8', ''),
              }}
              className='rounded-none'
              controlClassName='rounded-b-none'
            ></SAPPVideo>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-base text-gray-400">
            File đang trong quá trình xử lý
          </div>
        )
      case 'AUDIO':
        return resource.url ? (
          <SAPPAudio
            streamRef={internalRef}
            options={{
              src: resource.url
                .replace(videoUrl || '', '')
                .replace('/manifest/video.m3u8', ''),
            }}
          ></SAPPAudio>
        ) : (
          <div className="flex h-full items-center justify-center text-base text-gray-400">
            File đang trong quá trình xử lý
          </div>
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
      <SappTable
        columns={columns}
        data={data?.data}
        loading={isLoading}
        rowKey="id"
        pagination={pagination}
        className="style-table rounded-xl bg-white "
        isShowPagination={false}
      />
      <PaginationSapp
        currentPage={pagination?.current || DEFAULT_PAGE_NUMBER}
        pageSize={pagination?.pageSize || 10}
        totalItems={pagination?.total || 0}
        setCurrentPage={(page) => {
          router.push(
            `${pathname}?${buildQueryString({
              ...query,
              page_index: page as number,
            })}`,
          )
          setPagination((prev) => ({ ...prev, current: page as number }))
        }}
        setPageSize={(page) => {
          router.push(
            `${pathname}?${buildQueryString({
              ...query,
              page_size: page as number,
              page_index: DEFAULT_PAGE_NUMBER,
            })}`,
          )
          setPagination((prev) => ({
            ...prev,
            current: DEFAULT_PAGE_NUMBER,
            pageSize: page as number,
          }))
        }}
      />
      {openPreview &&
        previewResource &&
        previewResource.suffix_type !== 'IMAGE' && (
          <ModalResizeableNew
            bodyClassName={clsx('px-5', {
              'pb-5': previewResource.suffix_type === 'WORD_DOCUMENT',
            })}
            key={previewResource.url}
            title={previewResource.name}
            width={previewModalWidth}
            height={previewResource.suffix_type === 'AUDIO' ? 100 : 548}
            minHeight={
              previewResource.suffix_type === 'AUDIO' ? 100 : previewResource.suffix_type === 'VIDEO' ? 350 : undefined
            }
            maxHeight={
              previewResource.suffix_type === 'AUDIO' ? 100 : undefined
            }
            minWidth={
              ['AUDIO', 'VIDEO'].includes(previewResource.suffix_type)
                ? Math.min(430, previewModalWidth)
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
            header={({ requestClose }) => (
              <div className="modal-header modal-dragger cursor-move flex h-10 w-full items-center justify-between">
                <div className="truncate font-semibold">
                  {previewResource.name}
                </div>
                <button
                  onClick={() => {
                    requestClose()
                    setTimeout(() => setOpenPreview(false), 300)
                  }}
                  onTouchEnd={() => {
                    setOpenPreview(false)
                    setPreviewResource(null)
                  }}
                >
                  <CloseIcon />
                </button>
              </div>
            )}
            onResizeStopDone={() => {
              setSheetResizeVersion((v) => v + 1)
            }}
            isInBody
          >
            <div
              className={clsx('flex h-full min-h-0 w-full flex-col', {
                'bg-black': previewResource.suffix_type === 'VIDEO',
                'bg-white': previewResource.suffix_type !== 'VIDEO',
              })}
            >
              {renderPreviewContent(previewResource)}
            </div>
          </ModalResizeableNew>
        )}
      {openPreview &&
        previewResource &&
        previewResource.suffix_type === 'IMAGE' && (
          <SappModalImageOriginalRatio
            src={previewResource.url}
            setSrc={() => setOpenPreview(false)}
          />
        )}
    </div>
  )
}

export default ClassResourceTable
