import { CloseIcon, DownloadIcon, LoadingIcon } from '@lms/assets'
import {
  CLASS_SUFFIX_TYPE,
  IClassResource
} from '@lms/core'
import { useUserRole } from '@lms/hooks'
import {
  ActionCellWithPopover,
  EditorReader,
  FileViewer,
  PdfViewer,
  SAPPAudio,
  SappModalImage,
  SAPPVideo,
  SheetViewer,
  TextPreview,
} from '@lms/ui'
import { handleDocUploadFromBlob } from '@utils/helpers'
import { Modal } from 'antd/es'
import clsx from 'clsx'
import CryptoJS from 'crypto-js'
import { useParams } from 'next/navigation'
import { useMemo, useRef, useState } from 'react'
import { ClassAPI } from 'src/api/class'
import { UploadAPI } from 'src/api/upload'

interface IProps {
  data: IClassResource
  name: string
}

const CardFileItem = ({ data, name }: IProps) => {
  const listSchedulePreview =
    data?.class_resource_permissions?.schedules?.slice(0, 2)
  const [openListLesson, setOpenListLesson] = useState(false)
  const [loadingEditor, setLoadingEditor] = useState<boolean>(false)
  const [previewResource, setPreviewResource] = useState<IClassResource | null>(
    null,
  )
  const [openPreview, setOpenPreview] = useState(false)
  const [defaultEditor, setDefaultEditor] = useState<string>()
  const [sheetResizeVersion, setSheetResizeVersion] = useState(0)
  const { isTeacher } = useUserRole()
  const params = useParams()
  const internalRef = useRef<HTMLVideoElement>(null)
  const isLandscape = window.matchMedia('(orientation: landscape)').matches

  const heightPreview = useMemo(() => {
    if (previewResource?.suffix_type === 'VIDEO') {
      return ''
    } else if (previewResource?.suffix_type === 'AUDIO') {
      return 'h-[56px]'
    }
    return 'h-[calc(100vh-100px)]'
  }, [previewResource?.suffix_type])
  const canDownload = (record: IClassResource, isTeacher: boolean) => {
    const perms = record?.class_resource_permissions

    if (!perms) return false

    return isTeacher
      ? perms.teacher === 'DOWNLOAD'
      : perms.student === 'DOWNLOAD'
  }
  const allowDownload = canDownload(data, isTeacher)

  const type = CLASS_SUFFIX_TYPE.find(
    (item) => item.value === data?.suffix_type,
  )?.label

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
    } catch (error) {}
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

  const download = async (class_id: string, resource_id: string) => {
    await UploadAPI.downloadFileClassResource(class_id, resource_id)
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
          ></SAPPVideo>
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
          <div className="word-document-preview h-full overflow-auto">
            <EditorReader
              className="!overflow-x-visible"
              text_editor_content={defaultEditor || ''}
            />
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
    <div className="space-y-4 rounded-xl bg-white p-4 shadow-small">
      <div className="flex items-center justify-between">
        <div
          onClick={() => handleOpenPreview(data)}
          className="cursor-pointer font-semibold leading-6 text-info-600"
        >
          {name}
        </div>
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
                action: () => download(params.courseId as string, data.id),
              },
            ]}
          />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex text-sm leading-5.5">
          <span className="text-gray-400">Type:&nbsp; &nbsp;</span>
          <span className="font-medium text-gray-800">{type}</span>
        </div>
        <div className="flex text-sm leading-5.5">
          <span className="text-gray-400">Lesson:&nbsp; &nbsp;</span>
          <div>
            {listSchedulePreview?.length > 0 ? (
              listSchedulePreview?.map((item) => (
                <div key={item.id} className="font-medium text-gray-800">
                  {item.name}
                </div>
              ))
            ) : (
              <div className="font-medium text-gray-800">-</div>
            )}
            <div
              onClick={() => setOpenListLesson(!openListLesson)}
              className="inline cursor-pointer"
            >
              {data?.class_resource_permissions?.schedules?.length > 2 && (
                <span className="mt-1 text-sm font-medium leading-5.5 text-primary">
                  +{data?.class_resource_permissions?.schedules?.length - 2}{' '}
                  more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal
        className="modal-view-more-lesson"
        open={openListLesson}
        onCancel={() => setOpenListLesson(false)}
        title=""
        footer={false}
        width={300}
        centered
        closable={false}
      >
        <header className="flex items-center justify-between">
          <div className="text-lg font-semibold text-gray-800">All Lesson</div>
          <div
            className="cursor-pointer"
            onClick={() => setOpenListLesson(false)}
          >
            <CloseIcon className="size-4" />
          </div>
        </header>
        <div className="mt-4 space-y-2">
          {data?.class_resource_permissions?.schedules?.map((item) => (
            <div className="text-sm text-gray-800" key={item.id}>
              {item.name}
            </div>
          ))}
        </div>
      </Modal>

      {previewResource && previewResource.suffix_type !== 'IMAGE' && (
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
              {data.name}
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

export default CardFileItem
