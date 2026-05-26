'use client'
import NameNoActionCell from './NameNoActionCell'
import { CloseIcon, DownloadIcon, LoadingIcon } from '@lms/assets'
import { useFeature } from '@lms/contexts'
import {
  CLASS_SUFFIX_TYPE,
  DEFAULT_PAGE_NUMBER,
  IClassResource,
  IClassResourceList,
} from '@lms/core'
import { useClassResourceRouteId, useUserRole } from '@lms/hooks'
import {
  ActionCellWithPopover,
  EditorReader,
  FileViewer,
  ModalResizeable,
  PaginationSapp,
  PdfViewer,
  Popover,
  SAPPAudio,
  SappModalImageOriginalRatio,
  SappTable,
  SAPPVideo,
  SheetViewer,
  TextPreview,
  Tooltip,
} from '@lms/ui'
import { buildQueryString, handleDocUploadFromBlob } from '@lms/utils'
import { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import clsx from 'clsx'
import CryptoJS from 'crypto-js'
import {
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'
import { Dispatch, SetStateAction, useRef, useState } from 'react'
interface IProps {
  files: IClassResourceList
  pagination: TablePaginationConfig
  setPagination: Dispatch<SetStateAction<TablePaginationConfig>>
  syncPagingToUrl?: boolean
  /** Align column layout with Folders table when either table has rows */
  syncTableColumns?: boolean
}

const colClassName = 'custom-column-table'
const textStyle = 'text-base font-medium text-gray-800'
const textTruncateStyle = `${textStyle} overflow-hidden text-ellipsis whitespace-nowrap w-[250px]`

const SectionHeader = ({ title, count }: { title: string; count: number }) => (
  <div className="flex items-center gap-3 p-8 pb-0">
    <h2 className="text-lg font-semibold leading-[27px] text-gray-800">
      {title}
    </h2>
    <span className="rounded bg-[#e9f6ff] px-2 py-0.5 text-sm font-normal leading-[22px] text-[#22aaff]">
      {count}
    </span>
  </div>
)

const ClassResourceFileTable = ({
  files,
  pagination,
  setPagination,
  syncPagingToUrl = true,
  syncTableColumns = false,
}: IProps) => {
  const { videoUrl, uploadApi, classApi } = useFeature()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const classId = useClassResourceRouteId()
  const query = Object.fromEntries(searchParams.entries())
  const { isTeacher } = useUserRole()
  const internalRef = useRef<HTMLVideoElement>(null)

  const [previewResource, setPreviewResource] = useState<IClassResource | null>(null)
  const [openPreview, setOpenPreview] = useState(false)
  const [defaultEditor, setDefaultEditor] = useState<string>()
  const [loadingEditor, setLoadingEditor] = useState<boolean>(false)
  const [sheetResizeVersion, setSheetResizeVersion] = useState(0)
  const hasFileData = Boolean(files?.data?.length)

  const canDownload = (record: IClassResource) => {
    const perms = record?.class_resource_permissions
    if (!perms) return false
    return isTeacher ? perms.teacher === 'DOWNLOAD' : perms.student === 'DOWNLOAD'
  }

  const download = async (resource_id: string) => {
    await uploadApi?.downloadFileClassResource?.(classId, resource_id)
  }

  const loadDocFile = async (url: string) => {
    try {
      const res = await fetch(url)
      const blob = await res.blob()
      return await handleDocUploadFromBlob(blob)
    } catch {
      return ''
    }
  }

  const handleOpenPreview = async (resource: IClassResource) => {
    try {
      const res = await classApi?.previewClassFile?.(
        classId,
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
        setPreviewResource({ ...resource, url: originalUrl, is_encrypted: res.is_encrypted })
        setOpenPreview(true)
        if (resource.suffix_type === 'WORD_DOCUMENT') {
          setLoadingEditor(true)
          const editorData = await loadDocFile(originalUrl)
          setDefaultEditor(editorData)
          setLoadingEditor(false)
        }
      }
    } catch {}
  }

  const renderPreviewContent = (resource: IClassResource) => {
    const videoBaseUrl = process.env.NEXT_PUBLIC_VIDEO_URL as string
    switch (resource.suffix_type) {
      case 'VIDEO':
        return resource.url ? (
          <SAPPVideo
            isFetchCaptions={false}
            streamRef={internalRef}
            options={{
              src: resource.url
                .replace(videoBaseUrl || '', '')
                .replace('/manifest/video.m3u8', ''),
            }}
          />
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
                .replace(videoBaseUrl || '', '')
                .replace('/manifest/video.m3u8', ''),
            }}
          />
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
          <FileViewer fileName={resource.name} fileUrl={resource.url} onlyView />
        )
      case 'SHEET':
        return resource.is_encrypted ? (
          <SheetViewer
            fileUrl={resource.url}
            fileName={resource.name}
            resizeVersion={sheetResizeVersion}
          />
        ) : (
          <FileViewer fileName={resource.name} fileUrl={resource.url} onlyView />
        )
      case 'PDF':
        return resource.is_encrypted ? (
          <PdfViewer url={resource.url} />
        ) : (
          <FileViewer fileName={resource.name} fileUrl={resource.url} onlyView />
        )
      case 'POWER_POINT':
        return <FileViewer fileName={resource.name} fileUrl={resource.url} onlyView />
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

  const columns: ColumnsType<IClassResource> = [
    {
      title: '#',
      key: 'index',
      width: 60,
      align: 'center',
      className: colClassName,
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
      width: 250,
      className: clsx(colClassName),
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
      className: clsx(colClassName, 'text-center'),
      align: 'center',
      render: (_, record) => (
        <NameNoActionCell
          isCenter
          dataColumn={
            CLASS_SUFFIX_TYPE?.find((item) => item.value === record.suffix_type)?.label
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
      className: clsx(colClassName, 'text-center'),
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
    ...(syncTableColumns
      ? [
          {
            title: '',
            key: 'actions',
            width: 80,
            align: 'right' as const,
            ...(hasFileData ? { fixed: 'right' as const } : {}),
            className: colClassName,
            render: (_: unknown, record: IClassResource) => {
              const allowDownload = canDownload(record)
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
                        action: () => download(record.id),
                      },
                    ]}
                  />
                </div>
              )
            },
          },
        ]
      : []),
  ]

  return (
    <div className="flex flex-col gap-4" onContextMenu={(e) => e.preventDefault()}>
      <SectionHeader title="Files" count={files?.metadata?.total_records ?? 0} />
      <SappTable
        columns={columns}
        data={files?.data}
        loading={false}
        rowKey="id"
        pagination={pagination}
        className="style-table-class-resource bg-white"
        isShowPagination={false}
        tableLayout={syncTableColumns ? 'fixed' : undefined}
        scroll={syncTableColumns ? { x: 890 } : undefined}
      />
      <div className="p-8 pt-0">
        <PaginationSapp
          currentPage={pagination?.current || DEFAULT_PAGE_NUMBER}
          pageSize={pagination?.pageSize || 10}
          totalItems={pagination?.total || 0}
          setCurrentPage={(page) => {
            if (syncPagingToUrl) {
              router.push(
                `${pathname}?${buildQueryString({
                  ...query,
                  page_index: page as number,
                })}`,
                { scroll: false },
              )
            }
            setPagination((prev) => ({ ...prev, current: page as number }))
          }}
          setPageSize={(page) => {
            if (syncPagingToUrl) {
              router.push(
                `${pathname}?${buildQueryString({
                  ...query,
                  page_size: page as number,
                  page_index: DEFAULT_PAGE_NUMBER,
                })}`,
                { scroll: false },
              )
            }
            setPagination((prev) => ({
              ...prev,
              current: DEFAULT_PAGE_NUMBER,
              pageSize: page as number,
            }))
          }}
        />
      </div>

      {openPreview && previewResource && previewResource.suffix_type !== 'IMAGE' && (
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
          minHeight={previewResource.suffix_type === 'AUDIO' ? 100 : undefined}
          maxHeight={previewResource.suffix_type === 'AUDIO' ? 100 : undefined}
          minWidth={
            ['AUDIO', 'VIDEO'].includes(previewResource.suffix_type) ? 430 : undefined
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
            <div className="modal-header modal-dragger flex h-10 w-full items-center justify-between">
              <div className="truncate font-semibold">{previewResource.name}</div>
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
          onResizeStopDone={() => setSheetResizeVersion((v) => v + 1)}
        >
          <div className="h-full bg-white">{renderPreviewContent(previewResource)}</div>
        </ModalResizeable>
      )}

      {openPreview && previewResource && previewResource.suffix_type === 'IMAGE' && (
        <SappModalImageOriginalRatio
          src={previewResource.url}
          setSrc={() => setOpenPreview(false)}
        />
      )}
    </div>
  )
}

export default ClassResourceFileTable
