'use client'
import { LoadingIcon } from '@assets/icons'
import NameNoActionCell from '@components/teacher/components/NameNoActionCell'
import { CloseIcon, DownloadIcon } from '@lms/assets'
import {
  CLASS_SUFFIX_TYPE,
  DEFAULT_PAGE_NUMBER,
  IClassResource,
} from '@lms/core'
import { useUserRole } from '@lms/hooks'
import {
  ActionCellV2,
  EditorReader,
  FileViewer,
  SheetViewer,
  ModalResizeable,
  PaginationSappV2,
  SappModalImageV2,
  SappTable,
  SAPPVideo,
  TextPreview,
  Tooltip,
} from '@lms/ui'
import { buildQueryString } from '@lms/utils'
import request from '@services/requestV2'
import { handleDocUploadFromBlob } from '@utils/helpers'
import { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { AxiosResponse } from 'axios'
import clsx from 'clsx'
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'
import { Dispatch, SetStateAction, useRef, useState } from 'react'
import { ClassAPI } from 'src/api/class'
import { UploadAPI } from 'src/api/upload'
import { getBaseUrl } from 'src/redux/services/httpService'

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
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const params = useParams()
  const query = Object.fromEntries(searchParams.entries())
  const textStyle = 'text-base font-medium text-gray-800'
  const className = 'custom-column-table'
  const textTruncateStyle = `${textStyle} overflow-hidden text-ellipsis whitespace-nowrap max-w-[300px]`
  const { isTeacher } = useUserRole()
  const internalRef = useRef<HTMLVideoElement>(null)
  const [previewResource, setPreviewResource] = useState<IClassResource | null>(
    null,
  )
  const [openPreview, setOpenPreview] = useState(false)
  const [defaultEditor, setDefaultEditor] = useState<string>()
  const [loadingEditor, setLoadingEditor] = useState<boolean>(false)
  const [loadingSheet, setLoadingSheet] = useState<boolean>(false)

  const handleOpenPreview = async (resource: IClassResource) => {
    if (['PDF', 'SHEET', 'WORD_DOCUMENT'].includes(resource.suffix_type)) {
      try {
        const res = await ClassAPI.previewClassFile(
          params.courseId as string,
          resource.id,
        )
        if (res) {
          if (!res.url) return
          setPreviewResource({
            ...resource,
            url: res.url,
          })
          setOpenPreview(true)
          if (resource.suffix_type === 'WORD_DOCUMENT') {
            setLoadingEditor(true)
            const defaultEditor = await getEditorData(res.url)
            setDefaultEditor(defaultEditor)
            setLoadingEditor(false)
          }
        }
      } catch (error) {}
    } else {
      if (!resource?.url && !resource?.sub_url) return
      setPreviewResource(resource)
      setOpenPreview(true)
    }
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
        record?.class_resource_permissions?.schedules.map((item, index) => (
          <div key={index} className="text-base text-gray-400">
            {item?.name}
          </div>
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
      console.log('res', res)
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
            options={{ src: resource.sub_url }}
          ></SAPPVideo>
        )
      case 'WORD_DOCUMENT':
        return loadingEditor ? (
          <LoadingIcon stroke="#404041" />
        ) : (
          <div className="word-document-preview">
            <EditorReader text_editor_content={defaultEditor || ''} />
          </div>
        )

      case 'SHEET':
        return <SheetViewer fileUrl={resource.url} fileName={resource.name} />
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
          setPagination((prev) => ({ ...prev, pageSize: page as number }))
        }}
      />
      {openPreview &&
        previewResource &&
        previewResource.suffix_type !== 'IMAGE' && (
          <ModalResizeable
            bodyClassName={clsx('px-5', {
              'pb-5': previewResource.suffix_type === 'WORD_DOCUMENT',
            })}
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
            header={({ requestClose }) => (
              <div className="modal-header modal-dragger flex h-10 w-full items-center justify-between">
                <div className="truncate font-semibold">
                  {previewResource.name}
                </div>
                <button
                  onClick={() => {
                    requestClose()
                    setTimeout(() => setOpenPreview(false), 300)
                  }}
                >
                  <CloseIcon />
                </button>
              </div>
            )}
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
