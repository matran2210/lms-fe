import ButtonText from '@components/base/button/ButtonText'
import SappButton from '@components/base/button/SappButton'
import SappDrawerV2 from '@components/base/drawer/SappDrawerV2'
import HookFormSelect from '@components/base/select/HookFormSelect'
import HookFormTextArea from '@components/base/textfield/HookFormTextArea'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import useSelectExams from 'src/hooks/useSelectExams'
import { ClassAPI } from 'src/pages/api/class'
import { ClassKey } from 'src/pages/api/queryKey'
import { ExaminationForm } from 'src/redux/types/Course/MyCourse/ExamInformation'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

interface Iprops {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  data: any
}

const ExamEditDrawer = ({ isOpen, setIsOpen, data }: Iprops) => {
  const router = useRouter()
  const validationSchema = z.object({
    note: z.string().optional(),
    examination_subject_id: z.object({
      label: z.string().min(1),
      value: z.string().min(1),
    }),
  })

  const { control, handleSubmit, reset } = useForm<ExaminationForm>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      examination_subject_id: {
        label: data?.data?.exam?.examination?.name,
        value: data?.data?.exam?.id,
      },
    },
  })

  const queryClient = useQueryClient()

  const { exams, hasNextPage, fetchNextPage } = useSelectExams(
    router.query.courseId as string,
  )
  const { mutate, isLoading } = useMutation({
    mutationFn: (value: {
      id: string
      data: {
        examination_subject_id: string
        note: string
      }
    }) => {
      return ClassAPI.changeExamDate(value?.id, value?.data)
    },
    onSuccess: () => {
      setIsOpen(false)
      queryClient.invalidateQueries(ClassKey.ExamInfo)
      reset()
    },
  })
  const options = exams?.data?.map((exam) => ({
    label: exam.examination.name,
    value: exam.id,
  }))

  const onSubmit: SubmitHandler<ExaminationForm> = (data) => {
    const output = {
      examination_subject_id: data.examination_subject_id?.value,
      note: data.note,
    }
    mutate({
      id: router.query.courseId as string,
      data: output,
    })
  }
  return (
    <SappDrawerV2
      open={isOpen}
      title="Change my exam date"
      handleCancel={() => setIsOpen(false)}
    >
      <div className="flex flex-col gap-3">
        <Controller
          control={control}
          name="examination_subject_id"
          render={({ field: { onChange, value } }) => (
            <div>
              <label className="mb-2 block text-base font-medium">
                <span>{'Change My Exam Date'}</span>
                <span className="ml-2 text-red-500">*</span>
              </label>
              <HookFormSelect
                classParent="w-full md:max-w-full"
                placeholder="Exam Date"
                options={options}
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
          loading={isLoading}
        />
      </div>
    </SappDrawerV2>
  )
}

export default ExamEditDrawer
