import { UploadOutlined } from '@ant-design/icons'
import { AlertTriagle, IconCongrats } from '@assets/icons'
import ButtonText from '@components/base/button/ButtonText'
import SappButton from '@components/base/button/SappButton'
import SappDrawerV2 from '@components/base/drawer/SappDrawerV2'
import SappModalV3 from '@components/base/modal/SappModalV3'
import HookFormSelect from '@components/base/select/HookFormSelect'
import { zodResolver } from '@hookform/resolvers/zod'
import { pluralize } from '@utils/helpers/plurarize'
import { Button, GetProp, Upload, UploadFile, UploadProps, message } from 'antd'
import { RcFile } from 'antd/es/upload'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { zodMsg } from 'src/constants/form'
import useSelectExams from 'src/hooks/useSelectExams'
import { ClassAPI } from 'src/pages/api/class'
import { ExaminationForm } from 'src/redux/types/Course/MyCourse/ExamInformation'
import { z } from 'zod'

interface Iprops {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  classId: string
  onSuccess?: () => void
  remainingChanges?: number
  currentValue?: string
}

const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const ExamEditDrawer = ({
  isOpen,
  setIsOpen,
  classId,
  onSuccess,
  remainingChanges,
  currentValue,
}: Iprops) => {
  const [openConfirmModal, setOpenConfirmModal] = useState(false)
  const validationSchema = z.object({
    note: z
      .array(z.any(), { message: zodMsg.required })
      .min(1, { message: zodMsg.required }),
    examination_subject_id: z.object(
      {
        label: z
          .string({ required_error: zodMsg.required })
          .min(1, { message: zodMsg.required }),
        value: z
          .string({ required_error: zodMsg.required })
          .min(1, { message: zodMsg.required }),
      },
      { message: zodMsg.required },
    ),
  })

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ExaminationForm>({
    resolver: zodResolver(validationSchema),
  })

  const fileList = watch('note')

  const getUploadProps = (onChange: (file: RcFile[]) => void): UploadProps => ({
    beforeUpload: (file) => {
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

  const { exams, hasNextPage, fetchNextPage, refetch } = useSelectExams(classId)

  const { mutate, isLoading: isChangingLoad } = useMutation({
    mutationFn: ({
      examination_subject_id,
      note,
    }: {
      examination_subject_id: string
      note: UploadFile[]
    }) => {
      const formData = new FormData()
      formData.append('examination_subject_id', examination_subject_id)
      note && formData.append('note', note[0] as FileType)

      return ClassAPI.changeExamDate(classId, formData)
    },
    onSuccess: (res) => {
      if (res.data.success) {
        toast.success(res.data.data.message)
        onSuccess && onSuccess()
        setIsOpen(false)
        reset()
      }
      setOpenConfirmModal(false)
    },
  })

  const options = exams?.data
    ?.map((exam) => ({
      label: exam?.examination?.name,
      value: exam?.id,
    }))
    .filter((item) => {
      return item.value !== currentValue
    })

  const onSubmit: SubmitHandler<ExaminationForm> = (data) => {
    mutate({
      examination_subject_id: data.examination_subject_id?.value,
      note: data.note,
    })
  }

  useEffect(() => {
    if (isOpen) {
      reset({})
      refetch()
    }
  }, [isOpen, refetch, reset])

  const closeModal = () => {
    setIsOpen(false)
    reset({})
  }

  return (
    <SappDrawerV2
      open={isOpen}
      title="Change my exam date"
      handleCancel={closeModal}
    >
      <div className="flex flex-col gap-3">
        <Controller
          control={control}
          name="examination_subject_id"
          render={({ field: { onChange, value } }) => {
            return (
              <div>
                <label className="mb-2 block text-base font-medium">
                  <span>{'New Exam Date'}</span>
                  <span className="text-red-500 ml-2">*</span>
                </label>
                {errors.examination_subject_id && (
                  <p className="text-red-500 mb-2">
                    {errors.examination_subject_id?.message}
                  </p>
                )}
                <HookFormSelect
                  isClearable={true}
                  classParent="w-full md:max-w-full"
                  placeholder="Exam Date"
                  options={options}
                  required
                  noOptionsMessage={() => 'No data'}
                  onChange={(e) => {
                    return onChange(e === undefined || null ? {} : e)
                  }}
                  value={value ?? null}
                  onMenuScrollToBottom={hasNextPage && fetchNextPage}
                />
                <em className="mt-1 inline-block">
                  You can only change the exam date up to two times.
                </em>
                <em className="block">
                  {remainingChanges
                    ? `Remaining ${pluralize('change', remainingChanges)}: ${remainingChanges}`
                    : ''}
                </em>
              </div>
            )
          }}
        />
        <div>
          <label className="mb-2 block text-base font-medium">
            <span>{'Note'}</span>
            <span className="text-red-500 ml-2">*</span>
          </label>
          {errors.note && (
            <p className="text-red-500 mb-2">{errors.note.message}</p>
          )}
          <Controller
            control={control}
            name="note"
            render={({ field: { onChange } }) => (
              <Upload
                {...getUploadProps(onChange)}
                multiple={false}
                maxCount={1}
                fileList={fileList}
              >
                <Button
                  icon={<UploadOutlined />}
                  disabled={(options?.length ?? 0) <= 0}
                >
                  Please upload your exam registration evidence.
                </Button>
              </Upload>
            )}
          />
        </div>
      </div>
      <div className="absolute bottom-6 right-8">
        <ButtonText title="Cancel" onClick={closeModal} size={'medium'} />

        <SappButton
          disabled={(options?.length ?? 0) <= 0}
          size="medium"
          title={'Save'}
          loading={isChangingLoad}
          onClick={() => {
            if (exams?.current_exam_name === '') {
              handleSubmit(onSubmit)()
            } else {
              setOpenConfirmModal(true)
            }
          }}
        />
      </div>
      <SappModalV3
        open={openConfirmModal}
        cancelButtonCaption="No"
        okButtonCaption="Change Anyway"
        handleCancel={() => setOpenConfirmModal(false)}
        onOk={handleSubmit(onSubmit, (errors) => {
          if (errors) {
            setOpenConfirmModal(false)
          }
        })}
        fullWidthBtn={true}
        buttonSize="extra"
        icon={<AlertTriagle />}
        header="Are you sure?"
        loading={isChangingLoad}
      >
        Your learning progress in the Revision class for the{' '}
        <span className="text-sm font-medium text-[#050505]">
          {exams?.current_exam_name}
        </span>{' '}
        exam cannot be saved. Do you want to continue making changes?
      </SappModalV3>
    </SappDrawerV2>
  )
}

export default ExamEditDrawer
