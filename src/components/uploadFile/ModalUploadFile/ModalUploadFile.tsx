import SappModalV3 from '@components/base/modal/SappModalV3'
import { UploadFile } from 'antd/es/upload'
import axios, { CancelTokenSource } from 'axios'
import { capitalize } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { UploadAPI } from 'src/pages/api/upload'
import UploadFileHandle from './UploadFileHandle'
import { IResource, UPLOAD_TYPE } from './UploadFileInterface'

interface IModalUploadProps {
  open: boolean
  handleClose: any
  setSelectedFile?: any
  setUnSelectedFile?: any
  fileType: keyof typeof UPLOAD_TYPE
  isMultiple?: boolean
  fileChecked?: any
  onlyTab?: 'UPLOAD_FILE' | 'RESOURCES'
  title?: string
  getDefaultChecked?: (resources: IResource[]) => IResource[]
  customValidate?: (
    file: UploadFile<any>,
    fileList: UploadFile<any>[],
    index: number,
  ) => boolean
  parentId?: string
  maxCount?: number
  location: string
  className?: string
  overlayClass?: string
}

export const initCompleteModal = {
  open: false,
  errorRows: 0,
  totalRows: 0,
  fileName: '',
}

const ModalUploadFile = ({
  open,
  handleClose,
  setSelectedFile,
  fileType,
  isMultiple,
  title,
  customValidate,
  maxCount,
  location,
}: IModalUploadProps) => {
  const sourceRef = useRef<CancelTokenSource>()
  const isCancel = useRef<boolean>()
  const [uploadFile, setUploadFile] = useState<UploadFile[] | undefined>()

  const [progress, setProgress] = useState<{ [key: string]: number }>({})
  const [loadingUpload, setLoadingUpload] = useState<boolean>(false)
  const [disabled, setDisabled] = useState(false)
  const handleCancel = (closeModal: boolean = true, removedUid?: string) => {
    if (sourceRef.current) {
      sourceRef.current.cancel()
      isCancel.current = true
    }
    if (removedUid) {
      setUploadFile((e) => e?.filter((f) => f.uid !== removedUid))
      setProgress((e) => {
        delete e[removedUid]
        return e
      })
    } else {
      setUploadFile(undefined)
      setProgress({})
    }

    if (closeModal) {
      handleClose()
    }
  }

  useEffect(() => {
    return () => {
      handleCancel()
    }
  }, [])

  const getProgress = (percent: number, index: string) => {
    if (percent < 7) {
      percent = 7
    }

    setProgress((progress) => {
      return { ...progress, [index]: percent }
    })
  }

  async function handleUploadFile() {
    if (!uploadFile?.length) {
      toast.error(
        `Before uploading, please choose the file in the format of ${UPLOAD_TYPE[fileType].extension}.`,
      )
      return
    }
    setDisabled(true)
    sourceRef.current = axios.CancelToken.source()
    isCancel.current = false
    setUploadFile((e: any) =>
      e.map((f: any) => ({ ...f, status: 'uploading' })),
    )
    try {
      setLoadingUpload(true)
      setProgress({})
      const responseUploadedFiles: any[] = []

      for await (const [index, u] of uploadFile.entries()) {
        if (!u.originFileObj) {
          continue
        }
        try {
          getProgress(7, u.uid)
          const response = await UploadAPI.startUpload({
            content_type: u?.originFileObj?.type,
            blob: u?.originFileObj,
            size: u?.originFileObj.size?.toString() || '',
            description: '',
            name: u?.originFileObj?.name || 'undefined',
            getProgress: (percent) => getProgress(percent, u?.uid),
            location: location,
          })
          if (response) {
            responseUploadedFiles.push(response.data)

            setUploadFile((e: any) => {
              e[index] = {
                ...e?.[index],
                status: 'done',
                fileName: response?.data?.name,
                file_key: response?.data?.file_key,
              }
              return e
            })
          }
        } catch (error) {
          setUploadFile((e: any) => {
            return e?.map((f: any, i: number) => {
              if (i === index) {
                return { ...f, status: 'error' }
              } else {
                return f
              }
            })
          })
        }
      }
      setSelectedFile && setSelectedFile(responseUploadedFiles)
      toast.success('Upload completed!')
    } catch (error) {
      if (isCancel.current) {
        toast.success('Cancel successfully!')
        return
      }
      toast.error('An error occurred during the upload process!')
      setUploadFile((e: any) => ({ ...e, status: 'error' }))
    } finally {
      setTimeout(() => {
        handleCancel()
        setLoadingUpload(false)
        setDisabled(false)
      }, 1000)
    }
  }
  return (
    <div>
      <SappModalV3
        open={open}
        title={
          title ||
          `Add ${capitalize(UPLOAD_TYPE[fileType].type.toLocaleLowerCase())}`
        }
        cancelButtonCaption="Cancel"
        okButtonCaption={'Save'}
        handleCancel={handleCancel}
        externalLoading={disabled}
        size="max-w-xl"
        scrollbale={false}
        onOk={handleUploadFile}
        icon={undefined}
        header={''}
        fullWidthBtn={true}
        buttonSize="extra"
      >
        <UploadFileHandle
          uploadFile={uploadFile}
          setUploadFile={setUploadFile}
          progress={progress}
          loading={loadingUpload}
          handleCancel={handleCancel}
          fileType={fileType}
          icon={UPLOAD_TYPE[fileType]?.icon}
          isMultiple={isMultiple}
          customValidate={customValidate}
          maxCount={maxCount}
        ></UploadFileHandle>
      </SappModalV3>
    </div>
  )
}
export default ModalUploadFile
