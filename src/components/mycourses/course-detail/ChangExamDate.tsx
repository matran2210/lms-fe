import SAPPSelectV2 from '@components/base/select/SAPPSelectV2'
import { Controller, useFormContext } from 'react-hook-form'
import useSelectExams from 'src/hooks/useSelectExams'
import UploadSingleFileV2 from '@components/base/button/UploadSingleFileV2'
import { useEffect } from 'react'
import ErrorMessage from 'src/common/ErrorMessage'
import { RcFile } from 'antd/es/upload'
import { message, Upload, UploadProps } from 'antd'
interface IProps {
  classId: string
  remainingChanges?: number
  currentValue?: string
  isOpen: boolean
}

const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']

const ChangExamDate = ({
  classId,
  currentValue,
  remainingChanges,
  isOpen,
}: IProps) => {
  const { control, reset, setValue, clearErrors } = useFormContext()
  const { exams, hasNextPage, fetchNextPage, refetch } = useSelectExams(classId)

  const options = exams?.data
    ?.map((exam) => ({
      label: exam?.examination?.name,
      value: exam?.id,
    }))
    ?.filter((item) => {
      return item.value !== currentValue
    })

  const getUploadProps = (onChange: (file: RcFile[]) => void): UploadProps => ({
    beforeUpload: (file) => {
      clearErrors('note')
      const isValidType = allowedTypes.includes(file.type)

      if (!isValidType) {
        message.error(
          `${file.name} is not a valid image file (only PNG, JPG, and JPEG allowed).`,
        )
        return Upload.LIST_IGNORE
      }
      onChange([file]) // Manually update form state
      return false // Prevent default upload behavior
    },
    onRemove: () => {
      setValue('note', [])
    },
  })
  useEffect(() => {
    if (isOpen) {
      reset({})
      refetch()
    }
  }, [isOpen, refetch, reset])

  return (
    <div className="flex flex-col justify-start">
      <div className="mb-2 text-sm font-semibold leading-normal text-gray-800 md:text-base">
        New Exam Date
      </div>
      <SAPPSelectV2
        name="examination_subject_id"
        control={control}
        options={options ?? []}
        required
        placeholder="Choose one option"
        onMenuScrollToBottom={hasNextPage && fetchNextPage}
      />
      <div className="flex justify-between">
        <div className="mt-2 text-sm font-normal italic leading-snug text-gray-600">
          You can only change the exam date up to two times.
        </div>
        <div className="mt-1 text-sm font-bold italic leading-snug text-gray-600">
          {remainingChanges} change remaining
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-2 md:flex-row md:items-center md:gap-6 ">
        <div className="text-sm font-semibold leading-normal text-gray-800 md:text-base">
          Registration Evidence:
        </div>
        <Controller
          name="note"
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <UploadSingleFileV2
                fileList={field.value || []}
                {...getUploadProps(field.onChange)}
              />
              {fieldState.error && (
                <ErrorMessage>{fieldState.error.message}</ErrorMessage>
              )}
            </div>
          )}
        />
      </div>
    </div>
  )
}
export default ChangExamDate
