import ButtonText from '@components/base/button/ButtonText'
import SappButton from '@components/base/button/SappButton'
import SappDrawerV2 from '@components/base/drawer/SappDrawerV2'
import HookFormSelect from '@components/base/select/HookFormSelect'
import HookFormTextArea from '@components/base/textfield/HookFormTextArea'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation, useQueryClient } from 'react-query'
import { zodMsg } from 'src/constants'
import useSelectExams from 'src/hooks/useSelectExams'
import { ClassAPI } from 'src/pages/api/class'
import { UserKey } from 'src/pages/api/queryKey'
import { ExaminationForm } from 'src/redux/types/Course/MyCourse/ExamInformation'
import { z } from 'zod'

interface Iprops {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  data: any
}

const ExamEditDrawer = ({ isOpen, setIsOpen, data }: Iprops) => {
  const validationSchema = z.object({
    note: z.string().optional(),
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
    formState: { errors },
  } = useForm<ExaminationForm>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      examination_subject_id: {
        label: data?.examination_subject?.examination?.name,
        value: data?.examination_subject?.examination?.id,
      },
    },
  })

  const queryClient = useQueryClient()

  const { exams, hasNextPage, fetchNextPage, refetch } = useSelectExams(
    data?.class?.id as string,
  )

  const { mutate, isLoading: isChangingLoad } = useMutation({
    mutationFn: (value: {
      id: string
      data: {
        examination_subject_id: string
        note: string
      }
    }) => {
      return ClassAPI.changeExamDate(value?.id, value?.data)
    },
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.data.message)
        setIsOpen(false)
        queryClient.invalidateQueries(UserKey.ExamList)
        reset()
      }
    },
  })

  const options = exams?.data?.map((exam) => ({
    label: exam.examination.name,
    value: exam.id,
  }))

  const onSubmit: SubmitHandler<any> = (formData) => {
    const output = {
      examination_subject_id: formData.examination_subject_id?.value,
      note: formData.note,
    }
    mutate({
      id: data?.class?.id as string,
      data: output,
    })
  }

  useEffect(() => {
    if (data) {
      setValue('examination_subject_id', {
        label: data?.examination_subject?.examination?.name,
        value: data?.examination_subject?.examination?.id,
      })
    }
  }, [data])

  useEffect(() => {
    isOpen && refetch()
  }, [isOpen, refetch])

  return (
    <SappDrawerV2
      open={data?.examination_subject && isOpen}
      title="Change my exam date"
      handleCancel={() => {
        setIsOpen(false)
        reset()
      }}
    >
      <div className="flex flex-col gap-3">
        <Controller
          control={control}
          name="examination_subject_id"
          render={({ field: { onChange, value } }) => (
            <div>
              <label className="mb-2 block text-base font-medium">
                <span>{'New Exam Date'}</span>
                <span className="ml-2 text-red-500">*</span>
              </label>
              {errors.examination_subject_id && (
                <p className="mb-2 text-red-500">
                  {errors.examination_subject_id?.message}
                </p>
              )}
              <HookFormSelect
                classParent="w-full md:max-w-full"
                placeholder="Exam Date"
                options={options}
                required
                onChange={(e) => {
                  return onChange(e === undefined || null ? {} : e)
                }}
                value={value}
                onMenuScrollToBottom={hasNextPage && fetchNextPage}
              />
            </div>
          )}
        />
        <div>
          <label className="mb-2 block text-base font-medium">
            <span>{'Note'}</span>
          </label>
          <HookFormTextArea control={control} name="note" />
        </div>
      </div>
      <div className="absolute bottom-6 right-8">
        <ButtonText
          title="Cancel"
          onClick={() => setIsOpen(false)}
          size={'medium'}
        />
        <SappButton
          onClick={handleSubmit(onSubmit)}
          size="medium"
          title={'Save'}
          loading={isChangingLoad}
        />
      </div>
    </SappDrawerV2>
  )
}

export default ExamEditDrawer
