import { UploadFile } from 'antd/es/upload'
import axios, { CancelTokenSource } from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
// import SappModal from '../../SappModal'
// import '../..//ModalUploadFile.scss'
import { IResource } from './UploadFileInterface'
import UploadFileHandle from './UploadFileHandle'
import { RESOURCE_LOCATION, UPLOAD_TYPE } from './UploadFileInterface'
import SappModal from '@components/base/modal/SappModal'
import { UploadAPI } from 'src/pages/api/upload'

interface IModalUploadProps {
  open: boolean
  setOpen: any
  setSelectedFile?: any
  setUnSelectedFile?: any
  fileType: keyof typeof UPLOAD_TYPE
  isMultiple?: boolean
  resourceLocation: RESOURCE_LOCATION
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
}

export const initCompleteModal = {
  open: false,
  errorRows: 0,
  totalRows: 0,
  fileName: '',
}

const ModalUploadFile = ({
  open,
  setOpen,
  setSelectedFile,
  setUnSelectedFile,
  fileType,
  isMultiple,
  resourceLocation,
  fileChecked,
  onlyTab,
  title,
  getDefaultChecked,
  customValidate,
  parentId,
  maxCount,
}: IModalUploadProps) => {
  const sourceRef = useRef<CancelTokenSource>()
  const isCancel = useRef<boolean>()
  const [uploadFile, setUploadFile] = useState<UploadFile[] | undefined>()

  const [progress, setProgress] = useState<{ [key: string]: number }>({})
  const [loadingUpload, setLoadingUpload] = useState<boolean>(false)

  const [fileResource, setFileResource] = useState<{
    listDataChecked: IResource[] | IResource
    unCheckedListData?: IResource[]
  }>()

  const [tab, setTab] = useState<'UPLOAD_FILE' | 'RESOURCES'>(
    onlyTab || 'UPLOAD_FILE',
  )

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
      setOpen(false)
      setTab('UPLOAD_FILE')
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

  const handleUploadFile = async () => {
    if (!uploadFile?.length) {
      toast.error(
        `Before uploading, please choose the file in the format of ${UPLOAD_TYPE[fileType].extension}.`,
      )
      return
    }
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
            content_type: u.originFileObj.type,
            blob: u.originFileObj,
            size: u.originFileObj.size?.toString() || '',
            description: '',
            name: u.originFileObj.name || 'undefined',
            getProgress: (percent) => getProgress(percent, u.uid),
            location: 'essay',
          })
          if (response) {
            responseUploadedFiles.push(response)
            setUploadFile((e: any) => {
              e[index] = { ...e[index], status: 'done', id: response.id }
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
      setSelectedFile && setSelectedFile(responseUploadedFiles, 'upload')
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
      }, 1000)
    }
  }

  return (
    <div>
      <SappModal
        open={open}
        title={title || `Add ${UPLOAD_TYPE[fileType].type.toLocaleLowerCase()}`}
        cancelButtonCaption="Cancel"
        okButtonCaption={'Save'}
        confirmOnclose
        handleCancel={handleCancel}
        handleSubmit={handleUploadFile}
        closeAfterSubmit={true}
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
      </SappModal>
    </div>
  )
}
export default ModalUploadFile
