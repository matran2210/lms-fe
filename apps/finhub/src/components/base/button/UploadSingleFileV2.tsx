import { Upload, UploadProps } from 'antd'
import ButtonSecondary from './ButtonSecondary'
import { UploadIcon } from '@assets/icons'
import { useRef } from 'react'
import { RcFile } from 'antd/es/upload'

interface IProps extends UploadProps {
  title?: string
  fileList?: RcFile[]
}

const UploadSingleFileV2 = ({
  title = 'Choose file upload',
  fileList = [],
  ...props
}: IProps) => {
  const uploadRef = useRef<HTMLDivElement>(null)

  const hasFile = fileList?.length || 0

  return (
    <Upload
      ref={uploadRef}
      multiple={false}
      maxCount={1}
      fileList={fileList}
      showUploadList={false}
      beforeUpload={(file) => {
        // Gọi props.beforeUpload nếu có
        if (
          props.beforeUpload &&
          !props.beforeUpload(file, fileList as RcFile[])
        )
          return Upload.LIST_IGNORE

        // Gọi props.onChange nếu có (tự cập nhật fileList)
        props.onChange?.({ file, fileList: [file] })

        return false // Ngăn AntD upload mặc định
      }}
      {...props}
    >
      {hasFile ? (
        <div
          className="text-info group relative inline-flex cursor-pointer items-center text-base font-semibold"
          onClick={(e) => {
            e.stopPropagation()
            const input = document.querySelector(
              '.ant-upload input[type=file]',
            ) as HTMLInputElement
            if (input) {
              input.value = '' // Reset input
              input.click()
            }
          }}
        >
          {fileList?.[0]?.name}
          <div className="ml-2 opacity-0 transition-opacity duration-1000 group-hover:opacity-100">
            <UploadIcon />
          </div>
        </div>
      ) : (
        <ButtonSecondary
          title={title}
          size="small"
          startIcon={<UploadIcon />}
        />
      )}
    </Upload>
  )
}

export default UploadSingleFileV2
