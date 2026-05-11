'use client'
import { CloseIcon, DownloadIcon, FileIcon, MediaClassResourceIcon, ImageClassResourceIcon, LoadingIcon } from '@lms/assets'
import { IClassResource } from '@lms/core'
import { useTailwindBreakpoint, useUserRole } from '@lms/hooks'
import {
  ActionCellWithPopover,
  EditorReader,
  FileViewer,
  ModalResizeable,
  PdfViewer,
  SAPPAudio,
  SappModalImageOriginalRatio,
  SAPPVideo,
  SheetViewer,
  TextPreview,
  Tooltip,
} from '@lms/ui'
import { handleDocUploadFromBlob } from '@lms/utils'
import { Modal } from 'antd'
import clsx from 'clsx'
import CryptoJS from 'crypto-js'
import { useParams } from 'next/navigation'
import { useMemo, useRef, useState } from 'react'
import { ClassAPI } from 'src/api/class'
import { UploadAPI } from 'src/api/upload'

interface IFileItemProps {
  file: IClassResource
}

function getLastThumbnailUrl(
  thumbnail: IClassResource['thumbnail'],
): string | undefined {
  if (thumbnail == null || typeof thumbnail !== 'object') return undefined
  const values = Object.values(thumbnail)
  for (let i = values.length - 1; i >= 0; i--) {
    const v = values[i]
    if (typeof v === 'string' && v.trim() !== '') return v
  }
  return undefined
}

const FileItem = ({ file }: IFileItemProps) => {
  const { courseId } = useParams<{ courseId: string }>()
  const { isTeacher } = useUserRole()
  const internalRef = useRef<HTMLVideoElement>(null)
  const { isAlwaysShowSidebar } = useTailwindBreakpoint()
  const [previewResource, setPreviewResource] = useState<IClassResource | null>(null)
  const [openPreview, setOpenPreview] = useState(false)
  const [defaultEditor, setDefaultEditor] = useState<string>()
  const [loadingEditor, setLoadingEditor] = useState(false)
  const [sheetResizeVersion, setSheetResizeVersion] = useState(0)
  const isLandscape = window.matchMedia('(orientation: landscape)').matches
  const heightPreview = useMemo(() => {
    if (previewResource?.suffix_type === 'VIDEO') {
      return ''
    } else if (previewResource?.suffix_type === 'AUDIO') {
      return 'h-[56px]'
    }
    return 'h-[calc(100vh-100px)]'
  }, [previewResource?.suffix_type])

  const canDownload = (record: IClassResource) => {
    const perms = record?.class_resource_permissions
    if (!perms) return false
    return isTeacher ? perms.teacher === 'DOWNLOAD' : perms.student === 'DOWNLOAD'
  }

  const download = async () => {
    await UploadAPI.downloadFileClassResource(courseId, file.id)
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

  const handleOpenPreview = async () => {
    try {
      const res = await ClassAPI.previewClassFile(courseId, file.id)
      if (res) {
        let originalUrl = res.url
        if (res.is_encrypted) {
          const rawDecoded = CryptoJS.AES.decrypt(
            res.url,
            process.env.NEXT_PUBLIC_DECRYPT_CRYPTO_KEY || '',
          )
          originalUrl = rawDecoded.toString(CryptoJS.enc.Utf8)
        }
        setPreviewResource({ ...file, url: originalUrl, is_encrypted: res.is_encrypted })
        setOpenPreview(true)
        if (file.suffix_type === 'WORD_DOCUMENT') {
          setLoadingEditor(true)
          setDefaultEditor(await loadDocFile(originalUrl))
          setLoadingEditor(false)
        }
      }
    } catch { }
  }

  const renderPreviewContent = (resource: IClassResource) => {
    const videoUrl = process.env.NEXT_PUBLIC_VIDEO_URL as string
    switch (resource.suffix_type) {
      case 'VIDEO':
        return resource.url ? (
          <SAPPVideo
            isFetchCaptions={false}
            streamRef={internalRef}
            options={{
              src: resource.url
                .replace(videoUrl || '', '')
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
                .replace(videoUrl || '', '')
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

  const allowDownload = canDownload(file)

  const mapFileIcon = (suffixType: string) => {
    switch (suffixType) {
      case 'VIDEO':
        return <MediaClassResourceIcon />
      case 'AUDIO':
        return <MediaClassResourceIcon />
      case 'IMAGE':
        return <ImageClassResourceIcon />
      default:
        return <FileIcon />
    }
  }

  const isFileHasThumbnail = (suffixType: string) => {
    if (['SHEET', 'TEXT', 'WORD_DOCUMENT', 'POWER_POINT', 'PDF', 'VIDEO', 'AUDIO', 'IMAGE'].includes(suffixType)) return true
    return false
  }

  const fileThumbnailUrl = getLastThumbnailUrl(file.thumbnail)

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={handleOpenPreview}
        onKeyDown={(e) => e.key === 'Enter' && handleOpenPreview()}
        className="flex w-full cursor-pointer flex-col gap-3 overflow-hidden rounded-lg bg-gray-100 px-2 md:px-4 py-2 md:py-3 shadow-[0px_4px_20px_0px_rgba(41,41,41,0.05)] transition-colors hover:border-primary-400 border border-transparent"
      >
        {/* Header row: icon + name + action */}
        <div className="flex w-full items-center gap-2">
          <span className="shrink-0">
            {mapFileIcon(file.suffix_type)}
          </span>

          <div className="min-w-0 flex-1">
            <Tooltip
              placement="topLeft"
              title={file.name}
            >
              <span className="block truncate text-sm font-medium leading-[22px] text-secondary">
                {file.name}
              </span>
            </Tooltip>
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            className={clsx('shrink-0', {
              'pointer-events-none opacity-40': !allowDownload,
            })}
          >
            <ActionCellWithPopover
              className=""
              listAction={[
                {
                  icon: <DownloadIcon className="h-5 w-5" />,
                  nameAction: 'Download',
                  action: download,
                },
              ]}
            />
          </div>
        </div>

        {/* Thumbnail */}
        <div className="h-24 w-full overflow-hidden rounded-lg bg-gray-200">
          {isFileHasThumbnail(file.suffix_type) && fileThumbnailUrl ? (
            <img
              src={fileThumbnailUrl}
              alt={file.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <img
                src="https://learn-attachment.microsoft.com/api/attachments/09c1c12e-835c-4ad8-a8d5-9340493771b8?platform=QnA"
                alt="file"
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      {isAlwaysShowSidebar && previewResource && previewResource.suffix_type !== 'IMAGE' && (
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
          handleCloseScratchPad={() => {
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
      {!isAlwaysShowSidebar && previewResource && previewResource.suffix_type !== 'IMAGE' && (
        <Modal
          className="modal-preview-class-resource"
          open={openPreview}
          onCancel={() => setOpenPreview(false)}
          title=""
          footer={false}
          width={
            previewResource.suffix_type === 'VIDEO' && isLandscape
              ? window.innerWidth * 0.8
              : window.innerWidth * 0.9
          }
          centered
          closable={false}
          destroyOnHidden
        >
          <header className="flex items-center justify-between px-3 py-2">
            <div className="line-clamp-1 text-sm font-medium text-gray-800">
              {previewResource.name}
            </div>
            <div
              className="cursor-pointer"
              onClick={() => setOpenPreview(false)}
            >
              <CloseIcon className="size-4" />
            </div>
          </header>
          <div className={`w-full ${heightPreview} relative bg-white`}>
            {previewResource && renderPreviewContent(previewResource)}
          </div>
        </Modal>
      )}


      {openPreview && previewResource && previewResource.suffix_type === 'IMAGE' && (
        <SappModalImageOriginalRatio
          src={previewResource.url}
          setSrc={() => setOpenPreview(false)}
        />
      )}
    </>
  )
}

export default FileItem
